
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, AttendanceStatus } from '../types';
import { employeeService } from '../services/employeeService';
import { attendanceService } from '../services/attendanceService';
import { Link, useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add Employee Form State
  const [formData, setFormData] = useState({
    companyName: 'Odoo India',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    department: 'Engineering',
    jobTitle: 'Developer'
  });

  const [generatedId, setGeneratedId] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const emps = await employeeService.getAll();
    setEmployees(emps);
    
    // Fetch mock attendance for today
    const date = new Date().toISOString().split('T')[0];
    const atts: Record<string, any> = {};
    for (const emp of emps) {
      // In a real app, this would be a single bulk fetch
      const record = await attendanceService.getTodayAttendance(emp.id);
      atts[emp.id] = record;
    }
    setAttendanceData(atts);
  };

  useEffect(() => {
    if (formData.companyName && formData.name) {
      const id = employeeService.generateEmployeeId(formData.companyName, formData.name);
      setGeneratedId(id);
    } else {
      setGeneratedId('');
    }
  }, [formData.companyName, formData.name]);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      await employeeService.create({
        name: formData.name,
        email: formData.email,
        mobile: formData.phone,
        login_id: generatedId,
        department: formData.department,
        job_title: formData.jobTitle,
        role: UserRole.EMPLOYEE
      });
      
      setShowAddModal(false);
      loadEmployees();
      alert(`Employee ${formData.name} created successfully with ID: ${generatedId}`);
      
      setFormData({
        companyName: 'Odoo India',
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        department: 'Engineering',
        jobTitle: 'Developer'
      });
    } catch (err) {
      alert("Error creating employee");
    }
  };

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(search.toLowerCase()) || 
    e.login_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">
            {user.role === UserRole.ADMIN 
              ? 'Manage your workforce and company structure.' 
              : `Welcome back, ${user.name.split(' ')[0]}!`}
          </p>
        </div>
        {user.role === UserRole.ADMIN && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
          >
            <i className="fa-solid fa-user-plus"></i> Add New Employee
          </button>
        )}
      </div>

      {user.role === UserRole.ADMIN ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Total Staff" value={employees.length.toString()} icon="fa-users" color="indigo" />
            <StatCard label="Present Today" value="85%" icon="fa-calendar-check" color="green" />
            <StatCard label="On Leave" value="3" icon="fa-plane" color="orange" />
            <StatCard label="New Hires (May)" value="2" icon="fa-sparkles" color="blue" />
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <h2 className="font-black text-gray-900 text-xl">Workforce Directory</h2>
              <div className="relative w-full md:w-80">
                <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Search name or Employee ID..." 
                  value={search}
                  onChange={(e) => setSearch(setSearch(e.target.value))}
                  className="w-full pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-black focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 p-8">
              {filteredEmployees.map((emp) => {
                const isPresent = attendanceData[emp.id]?.check_in && !attendanceData[emp.id]?.check_out;
                return (
                  <div 
                    key={emp.id} 
                    className="group bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-5">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=random&size=128`} 
                          className="w-24 h-24 rounded-[1.8rem] group-hover:scale-110 transition-transform duration-500 shadow-lg"
                        />
                        {/* Status Symbol in Logo */}
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full shadow-sm ${isPresent ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      </div>
                      
                      <h3 className="font-black text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{emp.name}</h3>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{emp.login_id}</p>
                      
                      {/* Check-in / Check-out Options instead of Status */}
                      <div className="w-full space-y-2 mt-2">
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                          <span className="text-[10px] font-black text-gray-400 uppercase">Check In</span>
                          <span className="text-xs font-black text-indigo-600">{attendanceData[emp.id]?.check_in || '--:--'}</span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
                          <span className="text-[10px] font-black text-gray-400 uppercase">Check Out</span>
                          <span className="text-xs font-black text-gray-500">{attendanceData[emp.id]?.check_out || '--:--'}</span>
                        </div>
                      </div>

                      <Link 
                        to={`/profile/${emp.id}`}
                        className="mt-6 w-full py-3 bg-white border border-gray-100 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             <QuickCard label="My Profile" icon="fa-user-circle" color="indigo" onClick={() => navigate(`/profile/${user.id}`)} />
             <QuickCard label="Attendance" icon="fa-calendar-alt" color="green" onClick={() => navigate('/attendance')} />
             <QuickCard label="Leave Status" icon="fa-paper-plane" color="orange" onClick={() => navigate('/time-off')} />
             <QuickCard label="Sign Out" icon="fa-right-from-bracket" color="red" onClick={() => navigate('/login')} />
          </div>
          {/* Employee Activity items... */}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-900">Register Employee</h2>
                <p className="text-gray-500 font-medium">Create a new profile in the HRMaster system.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Company Name</label>
                  <input 
                    required 
                    value={formData.companyName} 
                    onChange={e => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Company Logo</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-indigo-50/50 border-2 border-dashed border-indigo-100 p-4 rounded-2xl font-bold text-indigo-600 text-center cursor-pointer hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Logo
                    <input type="file" ref={fileInputRef} className="hidden" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-50 my-2"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input 
                    required 
                    placeholder="John Doe"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input 
                    required 
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                  <input 
                    required 
                    placeholder="+91 000-000-0000"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Auto-Generated ID</label>
                  <div className="w-full bg-indigo-600 p-4 rounded-2xl font-black text-white text-center shadow-lg shadow-indigo-100">
                    {generatedId || 'AWAITING NAME...'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                  <input 
                    required 
                    type="password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                  <input 
                    required 
                    type="password"
                    value={formData.confirmPassword} 
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl font-bold text-gray-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const QuickCard: React.FC<{ label: string, icon: string, color: string, onClick: () => void }> = ({ label, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group text-left"
  >
    <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <p className="font-black text-gray-800 text-sm">{label}</p>
  </button>
);

const StatCard: React.FC<{ label: string; value: string; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:border-indigo-100 transition-all group">
    <div className={`w-12 h-12 bg-${color}-50 text-${color}-600 rounded-2xl flex items-center justify-center mb-4 text-xl group-hover:scale-110 transition-transform`}>
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-gray-900 mt-1">{value}</p>
  </div>
);

export default Dashboard;
