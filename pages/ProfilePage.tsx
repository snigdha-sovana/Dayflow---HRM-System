
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, UserRole } from '../types';
import { employeeService } from '../services/employeeService';

interface ProfilePageProps {
  currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('Personal');
  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isOwnProfile = currentUser.id === id;

  useEffect(() => {
    if (id) {
      employeeService.getById(id).then(setEmployee);
    }
  }, [id]);

  if (!employee) return <div>Loading...</div>;

  const tabs = [
    { name: 'Resume', icon: 'fa-file-lines' },
    { name: 'Private Info', icon: 'fa-shield-halved' },
    { name: 'Salary Info', icon: 'fa-money-bill-transfer', hidden: !isAdmin && !isOwnProfile },
    { name: 'Security', icon: 'fa-key', hidden: !isOwnProfile && !isAdmin }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden mb-8">
        <div className="h-48 bg-indigo-600 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-violet-700 opacity-90"></div>
           <div className="absolute top-0 right-0 p-8 flex gap-4">
             {isAdmin && (
               <button className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-xl font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                 <i className="fa-solid fa-pen-to-square"></i> Edit Profile
               </button>
             )}
           </div>
        </div>
        
        <div className="px-12 pb-12 relative">
          <div className="flex flex-col md:flex-row items-end gap-8 -mt-16">
            <div className="relative group">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=256`} 
                alt={employee.name} 
                className="w-40 h-40 rounded-3xl object-cover ring-8 ring-white shadow-2xl relative z-10"
              />
              <div className="absolute inset-0 bg-black/40 rounded-3xl z-20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                <i className="fa-solid fa-camera text-white text-3xl"></i>
              </div>
            </div>
            
            <div className="flex-1 mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold text-gray-900">{employee.name}</h1>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${employee.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                  {employee.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-500 font-medium">
                <span className="flex items-center gap-2"><i className="fa-solid fa-id-badge text-indigo-500"></i> {employee.login_id}</span>
                <span className="flex items-center gap-2"><i className="fa-solid fa-envelope text-indigo-500"></i> {employee.email}</span>
                <span className="flex items-center gap-2"><i className="fa-solid fa-phone text-indigo-500"></i> {employee.mobile}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 flex gap-12 border border-gray-100 mb-2">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Department</p>
                <p className="text-lg font-bold text-gray-900">{employee.department}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Job Title</p>
                <p className="text-lg font-bold text-gray-900">{employee.job_title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-12 border-t border-gray-100 flex gap-10">
          {tabs.filter(t => !t.hidden).map(tab => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`py-6 text-sm font-bold border-b-4 transition-all flex items-center gap-2 ${activeTab === tab.name ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10 space-y-12">
              {activeTab === 'Personal' || activeTab === 'Resume' ? (
                <>
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                         <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                         About
                      </h3>
                      <button className="text-indigo-600 hover:text-indigo-800"><i className="fa-solid fa-pen"></i></button>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Professional with extensive experience in {employee.department}. Dedicated to delivering high-quality work and collaborating with cross-functional teams to achieve organizational goals. Enthusiastic about learning new technologies and streamlining internal processes.
                    </p>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                         <span className="w-2 h-8 bg-violet-600 rounded-full"></span>
                         Skills
                      </h3>
                      <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-bold">+ Add Skills</button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {['Strategic Planning', 'Leadership', 'Budget Management', 'Conflict Resolution', 'Data Analysis', 'Employee Relations'].map(skill => (
                        <span key={skill} className="px-5 py-2.5 bg-gray-50 text-gray-700 rounded-xl font-bold text-sm border border-gray-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                </>
              ) : activeTab === 'Salary Info' ? (
                <SalaryTab isAdmin={isAdmin} />
              ) : (
                <div className="py-20 text-center text-gray-400">
                  <i className="fa-solid fa-lock text-6xl mb-6 opacity-20"></i>
                  <p className="text-xl font-medium">Details for {activeTab} are currently private.</p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Bank Details</h3>
             <div className="space-y-6">
                <InfoRow label="Bank Name" value="Global Commercial Bank" />
                <InfoRow label="Account Number" value="•••• •••• 5678" />
                <InfoRow label="IFSC Code" value="GCB000123" />
                <InfoRow label="PAN No" value="ABCDE1234F" />
             </div>
          </div>
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
             <h3 className="text-xl font-bold text-gray-900 mb-6">Certifications</h3>
             <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-sm font-bold text-gray-900">SHRM Senior Certified Professional</p>
                   <p className="text-xs text-indigo-500 font-medium mt-1">Issued Jun 2022</p>
                </div>
                <button className="w-full py-3 text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl transition-all">+ Add Certifications</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
    <p className="text-sm font-bold text-gray-800">{value}</p>
  </div>
);

const SalaryTab: React.FC<{ isAdmin: boolean }> = ({ isAdmin }) => (
  <div className="space-y-10">
    <div className="grid grid-cols-2 gap-8">
       <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Month Wage</p>
          <p className="text-4xl font-extrabold text-indigo-900">₹ 50,000</p>
       </div>
       <div className="bg-violet-50 p-8 rounded-3xl border border-violet-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-1">Yearly Wage</p>
          <p className="text-4xl font-extrabold text-violet-900">₹ 6,00,000</p>
       </div>
    </div>

    <div className="space-y-6">
       <h4 className="text-xl font-bold text-gray-900">Salary Components</h4>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ComponentCard label="Basic Salary" value="₹ 25,000" percent="50.0%" color="blue" />
          <ComponentCard label="HRA" value="₹ 12,500" percent="50.0%" color="indigo" />
          <ComponentCard label="Standard Allowance" value="₹ 4,167" percent="16.7%" color="violet" />
          <ComponentCard label="PF Contribution" value="₹ 3,000" percent="12.0%" color="red" />
       </div>
    </div>

    <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
       <div>
         <p className="text-sm font-bold text-gray-400">Net Monthly Salary</p>
         <p className="text-3xl font-black text-gray-900">₹ 47,000</p>
       </div>
       {isAdmin && (
         <button className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all">
           Manage Payroll
         </button>
       )}
    </div>
  </div>
);

const ComponentCard: React.FC<{ label: string, value: string, percent: string, color: string }> = ({ label, value, percent, color }) => (
  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
    <div>
      <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-black text-gray-900">{value}</p>
    </div>
    <div className={`px-3 py-1 bg-${color}-100 text-${color}-700 rounded-lg text-[10px] font-black`}>
       {percent}
    </div>
  </div>
);

export default ProfilePage;
