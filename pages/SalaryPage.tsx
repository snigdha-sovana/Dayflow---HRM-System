
import React from 'react';
import { User, UserRole } from '../types';

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
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-500 mt-1">Configure salary structures and process monthly payouts.</p>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100">
          Process Payroll
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
         <div className="xl:col-span-3">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                  <h2 className="font-bold text-gray-800 text-lg">Employee Salary Overview</h2>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-50">
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Employee</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Monthly Wage</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Net Salary</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {[
                           { name: 'Alex Johnson', id: 'EMP0001', wage: '₹ 50,000', net: '₹ 47,000', status: 'Paid' },
                           { name: 'Sarah Williams', id: 'EMP0002', wage: '₹ 45,000', net: '₹ 42,500', status: 'Pending' },
                           { name: 'Michael Chen', id: 'EMP0003', wage: '₹ 42,000', net: '₹ 39,800', status: 'Pending' }
                        ].map(row => (
                           <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-6">
                                 <p className="font-bold text-gray-900">{row.name}</p>
                                 <p className="text-xs text-gray-400">{row.id}</p>
                              </td>
                              <td className="px-8 py-6 font-bold text-gray-900">{row.wage}</td>
                              <td className="px-8 py-6 font-black text-indigo-600">{row.net}</td>
                              <td className="px-8 py-6">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${row.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {row.status}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <button className="text-indigo-600 font-bold hover:underline">View Breakdown</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
               <h3 className="text-xl font-bold text-gray-900 mb-6">Global Rules</h3>
               <div className="space-y-4">
                  <RuleItem label="Basic Salary" value="50% of Wage" />
                  <RuleItem label="HRA" value="50% of Basic" />
                  <RuleItem label="PF Rate" value="12% of Basic" />
                  <RuleItem label="Prof. Tax" value="₹ 200 Fixed" />
               </div>
               <button className="w-full mt-8 py-3 bg-gray-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all border border-indigo-100/30">
                  Update Rules
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

const RuleItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
     <span className="text-sm font-medium text-gray-500">{label}</span>
     <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);

export default SalaryPage;
