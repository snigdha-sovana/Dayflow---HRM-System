
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, UserRole } from '../types';
import { employeeService } from '../services/employeeService';

interface ProfilePageProps {
  currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable fields state
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [editedName, setEditedName] = useState('');

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isOwnProfile = currentUser.id === id;

  useEffect(() => {
    if (id) {
      employeeService.getById(id).then(emp => {
        if (emp) {
          setEmployee(emp);
          setEditedPhone(emp.mobile);
          setEditedAddress(emp.address || '');
          setEditedName(emp.name);
        }
      });
    }
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  const handleSave = async () => {
    try {
      const updateData: Partial<User> = {
        mobile: editedPhone,
        address: editedAddress,
      };
      if (isAdmin) {
        updateData.name = editedName;
      }
      const updated = await employeeService.update(employee.id, updateData);
      setEmployee(updated);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="h-48 bg-indigo-600 relative">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 opacity-90"></div>
           <div className="absolute top-0 right-0 p-8">
             {(isAdmin || isOwnProfile) && (
               <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-xl font-bold hover:bg-white/30 transition-all"
               >
                 {isEditing ? 'Save Changes' : 'Edit Profile'}
               </button>
             )}
           </div>
        </div>
        
        <div className="px-12 pb-12 relative">
          <div className="flex flex-col md:flex-row items-end gap-8 -mt-16">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=256`} 
              className="w-40 h-40 rounded-3xl object-cover ring-8 ring-white shadow-2xl relative z-10"
            />
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3">
                {isEditing && isAdmin ? (
                  <input 
                    value={editedName} 
                    onChange={e => setEditedName(e.target.value)}
                    className="text-4xl font-extrabold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-2"
                  />
                ) : (
                  <h1 className="text-4xl font-extrabold text-gray-900">{employee.name}</h1>
                )}
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${employee.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                  {employee.role}
                </span>
              </div>
              <p className="text-gray-500 font-bold mt-2">Employee ID: {employee.login_id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-10 shadow-sm border border-gray-100">
           <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact & Professional Info</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <EditableInfo 
                label="Phone Number" 
                value={editedPhone} 
                isEditing={isEditing} 
                onChange={setEditedPhone} 
              />
              <EditableInfo 
                label="Mailing Address" 
                value={editedAddress} 
                isEditing={isEditing} 
                onChange={setEditedAddress} 
              />
              <ReadOnlyInfo label="Email Address" value={employee.email} />
              <ReadOnlyInfo label="Department" value={employee.department} />
              <ReadOnlyInfo label="Job Title" value={employee.job_title} />
              <ReadOnlyInfo label="Joined Date" value="Jan 01, 2023" />
           </div>
        </div>

        <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-indigo-900">Salary & Payroll</h3>
            {isAdmin && (
              <Link to="/salary" className="text-[10px] font-black uppercase text-indigo-600 hover:underline">
                View Full Logs
              </Link>
            )}
          </div>
          <div className="space-y-6">
             <div>
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Monthly Wage</p>
               <p className="text-3xl font-black text-indigo-900">₹ 50,000</p>
             </div>
             <div className="h-px bg-indigo-100"></div>
             <div className="grid grid-cols-2 gap-4">
                <MiniStat label="Basic" value="₹ 25k" />
                <MiniStat label="HRA" value="₹ 12k" />
                <MiniStat label="Allowance" value="₹ 8k" />
                <MiniStat label="Tax/PF" value="₹ 5k" />
             </div>
             <div className="mt-4 p-4 bg-white/50 rounded-2xl border border-indigo-100">
               <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Last Payslip Status</p>
               <div className="flex items-center justify-between">
                 <span className="text-sm font-black text-indigo-900">May 2025</span>
                 <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-lg text-[9px] font-black uppercase">Paid</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableInfo: React.FC<{ label: string, value: string, isEditing: boolean, onChange: (v: string) => void }> = ({ label, value, isEditing, onChange }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    {isEditing ? (
      <input 
        value={value} 
        onChange={e => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-900"
      />
    ) : (
      <p className="text-lg font-bold text-gray-900">{value || 'Not provided'}</p>
    )}
  </div>
);

const ReadOnlyInfo: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-lg font-bold text-gray-800">{value}</p>
  </div>
);

const MiniStat: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-bold text-indigo-400">{label}</p>
    <p className="font-black text-indigo-900">{value}</p>
  </div>
);

export default ProfilePage;
