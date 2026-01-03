
import React, { useState, useMemo, useRef } from 'react';
import { User, UserRole, LeaveRequest } from '../types';

interface TimeOffPageProps {
  user: User;
}

const TimeOffPage: React.FC<TimeOffPageProps> = ({ user }) => {
  // Initial state with some sample data
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: '1', user_id: '1', user_name: 'Alex Johnson', type: 'Paid', start_date: '2023-11-20', end_date: '2023-11-22', remarks: 'Vacation', status: 'Approved' },
    { id: '2', user_id: '2', user_name: 'Sarah Williams', type: 'Sick', start_date: '2023-10-15', end_date: '2023-10-16', remarks: 'Flu', status: 'Approved', attachment_name: 'medical_cert.pdf' },
    { id: '3', user_id: '3', user_name: 'Michael Chen', type: 'Unpaid', start_date: '2023-12-01', end_date: '2023-12-02', remarks: 'Personal Errands', status: 'Pending' }
  ]);
  
  const [showApplyModal, setShowApplyModal] = useState(false);
  const isAdmin = user.role === UserRole.ADMIN;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Request Form State
  const [leaveType, setLeaveType] = useState<'Paid' | 'Sick' | 'Unpaid'>('Paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  // Filter requests based on user role
  const visibleRequests = useMemo(() => {
    if (isAdmin) return requests;
    return requests.filter(req => req.user_id === user.id);
  }, [requests, isAdmin, user.id]);

  // Dynamic Dashboard Counts (for the current user)
  const myRequests = useMemo(() => requests.filter(r => r.user_id === user.id && r.status !== 'Rejected'), [requests, user.id]);
  
  const leaveStats = useMemo(() => ({
    paid: myRequests.filter(r => r.type === 'Paid').length,
    sick: myRequests.filter(r => r.type === 'Sick').length,
    unpaid: myRequests.filter(r => r.type === 'Unpaid').length
  }), [myRequests]);

  const handleApply = () => {
    if (!startDate || !endDate || !remarks) {
      alert("Please fill in all fields.");
      return;
    }

    if (leaveType === 'Sick' && !attachment) {
      alert("Please upload a sick leave certificate/attachment.");
      return;
    }

    const newReq: LeaveRequest = {
      id: Math.random().toString(36).substr(2, 9),
      user_id: user.id,
      user_name: user.name,
      type: leaveType,
      start_date: startDate,
      end_date: endDate,
      remarks: remarks,
      status: 'Pending',
      attachment_name: attachment ? attachment.name : undefined
    };

    setRequests(prev => [newReq, ...prev]);
    setShowApplyModal(false);
    
    // Reset form
    setStartDate('');
    setEndDate('');
    setRemarks('');
    setLeaveType('Paid');
    setAttachment(null);
    
    alert("Leave request submitted successfully!");
  };

  const updateStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1 font-medium">
            {isAdmin ? "Oversee company-wide time off and approvals." : "Track your leave balance and applications."}
          </p>
        </div>
        <button 
          onClick={() => setShowApplyModal(true)}
          className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <i className="fa-solid fa-plus"></i> APPLY FOR LEAVE
        </button>
      </div>

      {/* Dashboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <LeaveSummary label="Paid Leaves" used={leaveStats.paid} total={20} color="indigo" />
         <LeaveSummary label="Sick Leaves" used={leaveStats.sick} total={10} color="red" />
         <LeaveSummary label="Unpaid Leaves" used={leaveStats.unpaid} total={5} color="gray" />
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
           <h2 className="font-bold text-gray-800 text-lg">
             {isAdmin ? "Pending Approvals & History" : "My Leave History"}
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-gray-50/50">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Employee</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Type</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Remarks</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Status</th>
                   {isAdmin && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Actions</th>}
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {visibleRequests.length > 0 ? (
                  visibleRequests.map(req => (
                    <tr key={req.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.user_name)}&background=random`} 
                              className="w-8 h-8 rounded-lg shadow-sm"
                              alt=""
                            />
                            <div>
                              <span className="font-bold text-gray-900 block">{req.user_name}</span>
                              {req.attachment_name && (
                                <span className="text-[9px] text-indigo-500 font-bold flex items-center gap-1 mt-1 cursor-pointer hover:underline">
                                  <i className="fa-solid fa-paperclip"></i> {req.attachment_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                            req.type === 'Paid' ? 'bg-indigo-50 text-indigo-700' : 
                            req.type === 'Sick' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {req.type}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-600">
                          {req.start_date} <span className="text-gray-300 mx-1">→</span> {req.end_date}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 italic max-w-xs truncate">{req.remarks}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                              req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                              req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                              {req.status}
                          </span>
                        </td>
                        {isAdmin && (
                          <td className="px-8 py-6">
                              <div className="flex justify-center gap-2">
                                {req.status === 'Pending' ? (
                                  <>
                                    <button 
                                      onClick={() => updateStatus(req.id, 'Approved')} 
                                      className="bg-green-500 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-green-600 shadow-md shadow-green-100 transition-all active:scale-90"
                                      title="Approve"
                                    >
                                      <i className="fa-solid fa-check"></i>
                                    </button>
                                    <button 
                                      onClick={() => updateStatus(req.id, 'Rejected')} 
                                      className="bg-red-500 text-white w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-600 shadow-md shadow-red-100 transition-all active:scale-90"
                                      title="Reject"
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] font-bold text-gray-300 uppercase italic">Processed</span>
                                )}
                              </div>
                          </td>
                        )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 6 : 5} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                      No leave requests found.
                    </td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Request Time Off</h2>
              <p className="text-gray-500 text-sm mb-8">Fill in the details for your leave application.</p>
              
              <div className="space-y-6">
                 {/* Row 1: Time Off Type Selection */}
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Time Off Type</label>
                   <div className="grid grid-cols-3 gap-2">
                      {['Paid', 'Sick', 'Unpaid'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setLeaveType(type as any)}
                          className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                            leaveType === type 
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                              : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {type} Time Off
                        </button>
                      ))}
                   </div>
                 </div>
                 
                 {/* Row 2: Date Range */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Start Date</label>
                      <input 
                        type="date" 
                        value={startDate} 
                        onChange={e => setStartDate(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">End Date</label>
                      <input 
                        type="date" 
                        value={endDate} 
                        onChange={e => setEndDate(e.target.value)} 
                        className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                      />
                    </div>
                 </div>

                 {/* Row 3: Attachments (Conditional for Sick Leave) */}
                 {leaveType === 'Sick' && (
                    <div className="animate-in slide-in-from-top-4 duration-300">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Sick Leave Certificate / Attachment</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          attachment ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-gray-50 hover:border-indigo-200'
                        }`}
                      >
                        <i className={`fa-solid ${attachment ? 'fa-file-circle-check text-green-500' : 'fa-cloud-arrow-up text-gray-300'} text-2xl mb-2`}></i>
                        <p className={`text-xs font-bold ${attachment ? 'text-green-700' : 'text-gray-400'}`}>
                          {attachment ? attachment.name : 'Upload Medical Certificate (PDF, JPG)'}
                        </p>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    </div>
                 )}
                 
                 {/* Row 4: Remarks */}
                 <div>
                   <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Reason / Remarks</label>
                   <textarea 
                    value={remarks} 
                    onChange={e => setRemarks(e.target.value)}
                    rows={3} 
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="Enter short reason for your leave..."
                   />
                 </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                 <button 
                  onClick={() => setShowApplyModal(false)} 
                  className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={handleApply} 
                  className="flex-1 py-4 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
                 >
                   Submit Request
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const LeaveSummary: React.FC<{ label: string, used: number, total: number, color: string }> = ({ label, used, total, color }) => {
  const percentage = Math.min(100, (used / total) * 100);
  
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col hover:border-indigo-100 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <div className={`w-10 h-10 bg-${color === 'gray' ? 'slate' : color}-50 text-${color === 'gray' ? 'slate' : color}-500 rounded-xl flex items-center justify-center text-sm group-hover:scale-110 transition-transform`}>
          <i className={`fa-solid ${label.includes('Paid') ? 'fa-wallet' : label.includes('Sick') ? 'fa-heart-pulse' : 'fa-hourglass'}`}></i>
        </div>
      </div>
      
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-black text-gray-900">{used}</span>
        <span className="text-lg font-bold text-gray-300">/ {total}</span>
        <span className="text-xs font-bold text-gray-400 ml-auto uppercase tracking-tighter">Days Used</span>
      </div>
      
      <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 bg-${color === 'gray' ? 'slate' : color}-500 shadow-sm shadow-${color === 'gray' ? 'slate' : color}-200`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TimeOffPage;
