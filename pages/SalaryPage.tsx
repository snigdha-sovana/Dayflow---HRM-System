
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { attendanceService } from '../services/attendanceService';

interface SalaryPageProps {
  user: User;
}

const SalaryPage: React.FC<SalaryPageProps> = ({ user }) => {
  if (user.role !== UserRole.ADMIN) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[2.5rem] border border-gray-100">
         <i className="fa-solid fa-lock text-7xl text-gray-100 mb-8"></i>
         <h1 className="text-3xl font-bold text-gray-900">Restricted Access</h1>
         <p className="text-gray-500 mt-4 max-w-md">Payroll and salary information are only accessible by administrators and HR officers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1 font-medium">Payslips are generated based on payable days from attendance logs.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
          Process Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         <div className="xl:col-span-3">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-gray-50/20">
                  <h2 className="font-bold text-gray-800 text-lg">Employee Salary Computation</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-100">
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Employee</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Payable Days</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Net Salary</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {[
                           { name: 'Alex Johnson', id: 'EMP0001', payable: 30, net: '₹ 50,000', status: 'Paid' },
                           { name: 'Sarah Williams', id: 'EMP0002', payable: 28, net: '₹ 42,000', status: 'Pending' },
                           { name: 'Michael Chen', id: 'EMP0003', payable: 29, net: '₹ 40,600', status: 'Pending' }
                        ].map(row => (
                           <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors">
                              <td className="px-8 py-6">
                                 <p className="font-bold text-gray-900">{row.name}</p>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{row.id}</p>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">
                                  {row.payable} / 30
                                </span>
                              </td>
                              <td className="px-8 py-6 font-black text-indigo-600">{row.net}</td>
                              <td className="px-8 py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {row.status}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <button className="text-indigo-600 font-bold text-sm hover:underline">Adjust Attendance</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
               <h3 className="text-xl font-bold text-gray-900 mb-6">Payroll Logic</h3>
               <div className="space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    Total Payable Days = (Days Present) + (Paid Leaves).
                  </p>
                  <p className="text-xs text-red-400 leading-relaxed font-bold">
                    * Unpaid leaves and missing attendance days automatically reduce payout.
                  </p>
                  <div className="h-px bg-gray-50 my-4"></div>
                  <RuleItem label="Basic Salary" value="50% of Wage" />
                  <RuleItem label="HRA" value="50% of Basic" />
                  <RuleItem label="PF Rate" value="12% of Basic" />
                  <RuleItem label="Prof. Tax" value="₹ 200 Fixed" />
               </div>
               <button className="w-full mt-8 py-3.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all border border-indigo-100/30">
                  Update Structure
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const RuleItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5">
     <span className="text-xs font-bold text-gray-500">{label}</span>
     <span className="text-xs font-black text-gray-900">{value}</span>
  </div>
);

export default SalaryPage;
