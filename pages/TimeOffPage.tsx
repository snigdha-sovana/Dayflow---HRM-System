
import React, { useState } from 'react';
import { User, UserRole, LeaveRequest } from '../types';

interface TimeOffPageProps {
  user: User;
}

const TimeOffPage: React.FC<TimeOffPageProps> = ({ user }) => {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: '1', user_id: '1', user_name: 'Alex Johnson', type: 'Paid Time Off', start_date: '28/10/2023', end_date: '30/10/2023', status: 'Pending', allocation: 24 },
    { id: '2', user_id: '2', user_name: 'Sarah Williams', type: 'Sick Leave', start_date: '15/10/2023', end_date: '16/10/2023', status: 'Approved', allocation: 7 }
  ]);
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Time Off</h1>
          <p className="text-gray-500 mt-1">Manage leave applications and remaining allocations.</p>
        </div>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
          <i className="fa-solid fa-plus"></i>
          NEW REQUEST
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <LeaveStat label="Paid time Off" available={24} color="indigo" />
         <LeaveStat label="Sick time Off" available={7} color="red" />
         <LeaveStat label="Unpaid Leave" available={0} color="gray" />
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
           <h2 className="font-bold text-gray-800 text-lg">Leave Requests</h2>
           <div className="relative w-64">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input type="text" placeholder="Search requests..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm" />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="border-b border-gray-50">
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Employee</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Start Date</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">End Date</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Type</th>
                   <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                   {isAdmin && <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>}
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50">
                {requests.map(req => (
                   <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6 font-bold text-gray-900">{req.user_name}</td>
                      <td className="px-8 py-6 text-sm text-gray-600">{req.start_date}</td>
                      <td className="px-8 py-6 text-sm text-gray-600">{req.end_date}</td>
                      <td className="px-8 py-6">
                         <span className="text-sm font-bold text-indigo-600">{req.type}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                            req.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                            req.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                         }`}>
                            {req.status}
                         </span>
                      </td>
                      {isAdmin && (
                         <td className="px-8 py-6">
                            <div className="flex gap-2">
                               <button className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors"><i className="fa-solid fa-check text-xs"></i></button>
                               <button className="w-8 h-8 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"><i className="fa-solid fa-xmark text-xs"></i></button>
                            </div>
                         </td>
                      )}
                   </tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LeaveStat: React.FC<{ label: string, available: number, color: string }> = ({ label, available, color }) => (
  <div className={`bg-white p-8 rounded-[2rem] border-b-8 border-${color}-600 border border-gray-100 shadow-sm`}>
     <p className="text-lg font-bold text-gray-900">{label}</p>
     <p className="text-4xl font-black text-gray-900 mt-4">{available < 10 && available > 0 ? `0${available}` : available}</p>
     <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Days Available</p>
  </div>
);

export default TimeOffPage;
