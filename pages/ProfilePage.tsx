
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, UserRole, Salary } from '../types';
import { employeeService } from '../services/employeeService';

interface ProfilePageProps {
  currentUser: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<User | null>(null);
  const [salary, setSalary] = useState<Salary | null>(null);
  const [activeTab, setActiveTab] = useState('Personal');
  const [isEditing, setIsEditing] = useState(false);
  
  // State for editable salary (for Admin)
  const [tempWage, setTempWage] = useState(0);

  const isAdmin = currentUser.role === UserRole.ADMIN;
  const isOwnProfile = currentUser.id === id;

  useEffect(() => {
    if (id) {
      employeeService.getById(id).then(emp => {
        if (emp) {
          setEmployee(emp);
          employeeService.getSalaryByUserId(emp.id).then(sal => {
            setSalary(sal || null);
            if (sal) setTempWage(sal.monthly_wage);
          });
        }
      });
    }
  }, [id]);

  if (!employee) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const handleUpdateSalary = async () => {
    if (!employee || !isAdmin || isOwnProfile) return;
    try {
      const updatedSal = await employeeService.updateSalary(employee.id, { monthly_wage: tempWage });
      setSalary(updatedSal);
      alert('Salary updated successfully!');
    } catch (err) {
      alert('Failed to update salary');
    }
  };

  // Salary Calculations based on provided rule sheet
  const monthlyWage = salary?.monthly_wage || 0;
  const yearlyWage = monthlyWage * 12;
  const basicSalary = monthlyWage * 0.5;
  const hra = basicSalary * 0.5;
  const standardAllowance = basicSalary * 0.1667;
  const performanceBonus = basicSalary * 0.0833;
  const lta = basicSalary * 0.0833;
  const fixedAllowance = basicSalary * 0.1167;
  
  const pfEmployee = basicSalary * 0.12;
  const pfEmployer = basicSalary * 0.12;
  const professionalTax = 200;

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-20">
      {/* Enhanced Profile Header */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-indigo-600 to-violet-700"></div>
        <div className="px-10 pb-10 relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 -mt-20">
            <div className="relative">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=256`} 
                className="w-44 h-44 rounded-[2.5rem] object-cover ring-8 ring-white shadow-2xl z-10"
              />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* Column 1: Identity */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-black text-gray-900">{employee.name}</h1>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${employee.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                    {employee.role}
                  </span>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{employee.login_id}</p>
                <div className="flex flex-col gap-1 mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <i className="fa-solid fa-envelope text-indigo-400 w-4"></i>
                    {employee.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <i className="fa-solid fa-phone text-indigo-400 w-4"></i>
                    {employee.mobile}
                  </div>
                </div>
              </div>

              {/* Column 2: Context */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                <HeaderContextItem label="Company" value={employee.company} icon="fa-building" />
                <HeaderContextItem label="Department" value={employee.department} icon="fa-sitemap" />
                <HeaderContextItem label="Manager" value={employee.manager} icon="fa-user-tie" />
                <HeaderContextItem label="Location" value={employee.location} icon="fa-location-dot" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
        {['Personal', 'Private Info', 'Salary Info', 'Resume'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
            } ${tab === 'Salary Info' && !isAdmin ? 'hidden' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 min-h-[500px]">
        {activeTab === 'Personal' && (
          <div className="space-y-10">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <i className="fa-solid fa-address-card text-indigo-600"></i>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <DataField label="Full Name" value={employee.name} />
              <DataField label="Work Email" value={employee.email} />
              <DataField label="Contact Number" value={employee.mobile} />
              <DataField label="Department" value={employee.department} />
              <DataField label="Job Title" value={employee.job_title} />
              <DataField label="Date of Joining" value={employee.joining_date} />
              <DataField label="Manager" value={employee.manager} />
              <DataField label="Work Location" value={employee.location} />
              <DataField label="Mailing Address" value={employee.address || 'N/A'} fullWidth />
            </div>
          </div>
        )}

        {activeTab === 'Private Info' && (
          <div className="space-y-12">
             <section>
               <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                 <i className="fa-solid fa-user-shield text-indigo-600"></i>
                 Personal Private Details
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <DataField label="Date of Birth" value={employee.dob} />
                 <DataField label="Nationality" value={employee.nationality} />
                 <DataField label="Personal Email" value={employee.personal_email} />
                 <DataField label="Gender" value={employee.gender} />
                 <DataField label="Marital Status" value={employee.marital_status} />
                 <DataField label="Joining Date" value={employee.joining_date} />
               </div>
             </section>

             <section>
               <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3 border-t border-gray-50 pt-10">
                 <i className="fa-solid fa-building-columns text-indigo-600"></i>
                 Bank Details & Identifiers
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <DataField label="Bank Name" value={employee.bank_name} />
                 <DataField label="Account Number" value={employee.bank_account_no} />
                 <DataField label="IFSC Code" value={employee.ifsc_code} />
                 <DataField label="PAN Number" value={employee.pan_number} />
                 <DataField label="Employee Code" value={employee.login_id} />
               </div>
             </section>
          </div>
        )}

        {activeTab === 'Salary Info' && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
               <h3 className="text-2xl font-black text-gray-900">Salary Configuration</h3>
               {isAdmin && !isOwnProfile && (
                 <button 
                  onClick={handleUpdateSalary}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                 >
                   Save Salary Structure
                 </button>
               )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Main Wage Inputs */}
              <div className="space-y-8">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Monthly Wage</label>
                       <div className="relative">
                          <input 
                            type="number"
                            readOnly={!isAdmin || isOwnProfile}
                            value={tempWage}
                            onChange={(e) => setTempWage(Number(e.target.value))}
                            className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-black text-xl text-indigo-600 outline-none focus:ring-4 focus:ring-indigo-50 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">/ Month</span>
                       </div>
                    </div>
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Yearly Wage</label>
                       <div className="relative">
                          <input 
                            readOnly 
                            value={tempWage * 12}
                            className="w-full bg-gray-100/50 border border-gray-100 p-4 rounded-2xl font-black text-xl text-gray-500 outline-none"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">/ Yearly</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                    <DataField label="Work Days / Week" value={salary?.working_days_week.toString() || '5'} />
                    <DataField label="Hours / Day" value={`${salary?.working_hours || 8} hrs`} />
                    <DataField label="Break Time" value={salary?.break_time || '1hr'} />
                 </div>
              </div>

              {/* Breakdown Grid */}
              <div className="bg-gray-50/50 rounded-[2rem] p-10 border border-gray-100">
                <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-8 border-b border-gray-200 pb-4">Components Breakdown</h4>
                <div className="space-y-6">
                   <ComponentRow label="Basic Salary" amount={basicSalary} percentage="50.00%" desc="Defined as 50% of monthly cost" />
                   <ComponentRow label="HRA" amount={hra} percentage="50.00%" desc="50% of the basic salary" />
                   <ComponentRow label="Standard Allowance" amount={standardAllowance} percentage="16.67%" desc="Fixed fixed amount for standard upkeep" />
                   <ComponentRow label="Performance Bonus" amount={performanceBonus} percentage="8.33%" desc="Calculated as % of basic salary" />
                   <ComponentRow label="Leave Travel (LTA)" amount={lta} percentage="8.33%" desc="Annual holiday travel coverage" />
                   <ComponentRow label="Fixed Allowance" amount={fixedAllowance} percentage="11.67%" desc="Balanced portion of monthly wage" />
                   
                   <div className="h-px bg-gray-200 my-4"></div>
                   
                   <h4 className="font-black text-gray-400 text-[10px] uppercase tracking-widest mb-4">Deductions</h4>
                   <ComponentRow label="Employee PF" amount={pfEmployee} percentage="12.00%" color="red" />
                   <ComponentRow label="Professional Tax" amount={professionalTax} percentage="Fixed" color="red" />
                </div>
              </div>
            </div>
            
            {isAdmin && isOwnProfile && (
              <p className="text-xs text-amber-600 font-bold bg-amber-50 p-4 rounded-xl text-center">
                <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                Admins are not permitted to modify their own salary structures. Please contact the finance department for adjustments.
              </p>
            )}
          </div>
        )}

        {activeTab === 'Resume' && (
           <div className="flex flex-col items-center justify-center h-[400px] border-2 border-dashed border-gray-100 rounded-[2rem]">
              <i className="fa-solid fa-file-pdf text-6xl text-gray-200 mb-6"></i>
              <h3 className="text-xl font-bold text-gray-400 mb-2">No Resume Uploaded</h3>
              <button className="bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-all">
                Upload New Resume
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

const HeaderContextItem: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-500 shadow-sm">
      <i className={`fa-solid ${icon} text-xs`}></i>
    </div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      {/* Changed font color to black for better contrast and as requested */}
      <p className="text-xs font-black text-black leading-none">{value}</p>
    </div>
  </div>
);

const DataField: React.FC<{ label: string, value: string, fullWidth?: boolean }> = ({ label, value, fullWidth }) => (
  <div className={fullWidth ? 'md:col-span-2' : ''}>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</p>
    <p className="text-sm font-bold text-gray-800 bg-gray-50/50 p-3.5 rounded-2xl border border-gray-100">
      {value || 'Not Specified'}
    </p>
  </div>
);

const ComponentRow: React.FC<{ label: string, amount: number, percentage: string, desc?: string, color?: 'indigo' | 'red' }> = ({ label, amount, percentage, desc, color = 'indigo' }) => (
  <div>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-black text-gray-800">{label}</p>
        {desc && <p className="text-[9px] text-gray-400 font-bold mt-0.5">{desc}</p>}
      </div>
      <div className="text-right">
        <p className={`text-sm font-black ${color === 'red' ? 'text-red-600' : 'text-indigo-600'}`}>₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        <p className="text-[10px] font-black text-gray-300">{percentage}</p>
      </div>
    </div>
  </div>
);

export default ProfilePage;
