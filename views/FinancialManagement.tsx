import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  FileText, 
  PieChart, 
  BarChart4, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt,
  Download,
  Search,
  Wallet,
  Eye,
  FileCheck2,
  AlertCircle
} from 'lucide-react';

interface FinancialManagementProps {
  language: 'en' | 'ar';
}

interface InstallmentPlan {
  id: number;
  name: string;
  nameEn: string;
  enrolled: number;
  totalValue: number;
  isActive: boolean;
}

interface Transaction {
  id: string;
  studentName: string;
  studentNameEn: string;
  studentId: string;
  grade: string;
  gradeAr: string;
  status: 'paid' | 'overdue' | 'partial';
  amount: number; // For overview: "Amount" column
  balanceDue: number; // For student ledgers: "Balance Due"
  date: string;
  method: 'cash' | 'bank' | 'card';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '#RCP-8012', studentName: 'علي حسن سعيد', studentNameEn: 'Ali Hassan Saeed', studentId: 'STU-8921', grade: 'Grade 10', gradeAr: 'الصف العاشر', status: 'partial', amount: 1500, balanceDue: 1500, date: '10 May 2026', method: 'cash' },
  { id: '#RCP-8011', studentName: 'منى عادل', studentNameEn: 'Mona Adel', studentId: 'STU-8922', grade: 'Grade 8', gradeAr: 'الصف الثامن', status: 'paid', amount: 2000, balanceDue: 0, date: '10 May 2026', method: 'bank' },
  { id: '#RCP-8010', studentName: 'طارق عمر', studentNameEn: 'Tariq Omar', studentId: 'STU-8923', grade: 'Grade 12', gradeAr: 'الصف الثاني عشر', status: 'paid', amount: 900, balanceDue: 0, date: '09 May 2026', method: 'card' },
  { id: '#RCP-8009', studentName: 'سلمى نور', studentNameEn: 'Salma Nour', studentId: 'STU-8924', grade: 'Grade 11', gradeAr: 'الصف الحادي عشر', status: 'overdue', amount: 0, balanceDue: 1000, date: '08 May 2026', method: 'cash' },
  { id: '#RCP-8008', studentName: 'أحمد محمود', studentNameEn: 'Ahmed Mahmoud', studentId: 'STU-8925', grade: 'Grade 10', gradeAr: 'الصف العاشر', status: 'overdue', amount: 500, balanceDue: 1000, date: '05 May 2026', method: 'bank' },
  { id: '#RCP-8007', studentName: 'نورة سالم', studentNameEn: 'Noura Salem', studentId: 'STU-8926', grade: 'Grade 8', gradeAr: 'الصف الثامن', status: 'paid', amount: 1200, balanceDue: 0, date: '04 May 2026', method: 'card' },
  { id: '#RCP-8006', studentName: 'يوسف إبراهيم', studentNameEn: 'Youssef Ibrahim', studentId: 'STU-8927', grade: 'Grade 12', gradeAr: 'الصف الثاني عشر', status: 'paid', amount: 1800, balanceDue: 0, date: '02 May 2026', method: 'cash' },
  { id: '#RCP-8005', studentName: 'سارة كامل', studentNameEn: 'Sara Kamel', studentId: 'STU-8928', grade: 'Grade 11', gradeAr: 'الصف الحادي عشر', status: 'overdue', amount: 800, balanceDue: 700, date: '01 May 2026', method: 'bank' },
  { id: '#RCP-8004', studentName: 'عمر فاروق', studentNameEn: 'Omar Farouk', studentId: 'STU-8929', grade: 'Grade 10', gradeAr: 'الصف العاشر', status: 'paid', amount: 1500, balanceDue: 0, date: '28 Apr 2026', method: 'cash' },
  { id: '#RCP-8003', studentName: 'ليلى خالد', studentNameEn: 'Laila Khaled', studentId: 'STU-8930', grade: 'Grade 8', gradeAr: 'الصف الثامن', status: 'paid', amount: 2000, balanceDue: 0, date: '25 Apr 2026', method: 'card' },
  { id: '#RCP-8002', studentName: 'ماجد صالح', studentNameEn: 'Majed Saleh', studentId: 'STU-8931', grade: 'Grade 12', gradeAr: 'الصف الثاني عشر', status: 'overdue', amount: 1000, balanceDue: 800, date: '20 Apr 2026', method: 'bank' },
  { id: '#RCP-8001', studentName: 'دينا فؤاد', studentNameEn: 'Dina Fouad', studentId: 'STU-8932', grade: 'Grade 11', gradeAr: 'الصف الحادي عشر', status: 'paid', amount: 1500, balanceDue: 0, date: '15 Apr 2026', method: 'cash' },
];

export const FinancialManagement: React.FC<FinancialManagementProps> = ({ language }) => {
  const isRTL = language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModule, setActiveModule] = useState<'overview' | 'invoices' | 'installments' | 'reports' | 'student_ledgers'>('invoices');

  const [plans, setPlans] = useState<InstallmentPlan[]>([
    { id: 1, name: 'خطة 3 أقساط', nameEn: '3 Installments Plan', enrolled: 145, totalValue: 435000, isActive: true },
    { id: 2, name: 'خطة 5 أقساط', nameEn: '5 Installments Plan', enrolled: 89, totalValue: 267000, isActive: true },
    { id: 3, name: 'خطة الدفع الشهري', nameEn: 'Monthly Payment Plan', enrolled: 210, totalValue: 630000, isActive: false },
  ]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InstallmentPlan | null>(null);
  
  const [modalFormData, setModalFormData] = useState({
    name: '',
    totalValue: 0,
    isActive: true,
  });

  const openPlanModal = (plan: InstallmentPlan | null) => {
    setEditingPlan(plan);
    if (plan) {
      setModalFormData({ name: isRTL ? plan.name : plan.nameEn, totalValue: plan.totalValue, isActive: plan.isActive });
    } else {
      setModalFormData({ name: '', totalValue: 0, isActive: true });
    }
    setIsPlanModalOpen(true);
  };
  
  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, name: modalFormData.name, totalValue: modalFormData.totalValue, isActive: modalFormData.isActive } : p));
    } else {
      setPlans([...plans, { id: Date.now(), name: modalFormData.name, nameEn: modalFormData.name, enrolled: 0, totalValue: modalFormData.totalValue, isActive: modalFormData.isActive }]);
    }
    setIsPlanModalOpen(false);
  };

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(t => {
      const matchSearch = t.studentName.includes(searchQuery) ||
                          t.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchGrade = selectedGrade === 'All' || t.grade === selectedGrade || t.gradeAr === selectedGrade;
      const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;
      
      return matchSearch && matchGrade && matchStatus;
    });
  }, [searchQuery, selectedGrade, selectedStatus]);

  const { totalExpected, collected, overdue } = useMemo(() => {
    let exp = 0;
    let coll = 0;
    let ov = 0;
    filteredTransactions.forEach(t => {
      coll += t.amount;
      ov += t.balanceDue;
      exp += (t.amount + t.balanceDue);
    });
    return { totalExpected: exp, collected: coll, overdue: ov };
  }, [filteredTransactions]);

  const collectionRate = totalExpected > 0 ? Math.round((collected / totalExpected) * 100) : 0;

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'cash': return <span className="bg-violet-50 text-violet-700 font-bold px-3 py-1 rounded-full text-xs inline-block">{isRTL ? 'كاش' : 'Cash'}</span>;
      case 'bank': return <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs inline-block">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</span>;
      case 'card': return <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs inline-block">{isRTL ? 'بطاقة إئتمان' : 'Credit Card'}</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-fit"><FileCheck2 size={12} /> {isRTL ? 'مدفوعة' : 'Paid'}</span>;
    if (status === 'overdue') return <span className="bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-fit"><AlertCircle size={12} /> {isRTL ? 'متأخرة' : 'Overdue'}</span>;
    if (status === 'partial') return <span className="bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-fit"><PieChart size={12} /> {isRTL ? 'جزئي' : 'Partial'}</span>;
    return null;
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* HEADER & QUICK ACTIONS */}
      <div className="flex justify-between items-center w-full mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">{isRTL ? 'المالية والمدفوعات' : 'Financial Management'}</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">{isRTL ? 'نظرة عامة على الإيرادات والفواتير والتحصيلات' : 'Overview of revenue, invoices, and collections'}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="border border-violet-200 text-violet-700 bg-white hover:bg-violet-50 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm">
            {isRTL ? 'إصدار فاتورة' : 'Issue Invoice'}
          </button>
          <button className="bg-violet-600 text-white hover:bg-violet-700 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all flex items-center justify-center gap-2 text-sm border-none">
            <Plus size={16} /> {isRTL ? 'تسجيل دفعة' : 'Record Payment'}
          </button>
        </div>
      </div>

      {/* SMART SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px] relative">
          <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder={isRTL ? 'البحث عن طالب، رقم إيصال، أو فاتورة...' : 'Search student, receipt ID, or invoice...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium`}
          />
        </div>
        <select className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-all focus:bg-white">
          <option>{isRTL ? 'العام الدراسي: 2023-2024' : 'Academic Year: 2023-2024'}</option>
        </select>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-all focus:bg-white min-w-[160px]"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
        >
          <option value="All">{isRTL ? 'الصف الدراسي: جميع الصفوف' : 'Grade: All Grades'}</option>
          <option value={isRTL ? 'الصف الثامن' : 'Grade 8'}>{isRTL ? 'الصف الثامن' : 'Grade 8'}</option>
          <option value={isRTL ? 'الصف العاشر' : 'Grade 10'}>{isRTL ? 'الصف العاشر' : 'Grade 10'}</option>
          <option value={isRTL ? 'الصف الحادي عشر' : 'Grade 11'}>{isRTL ? 'الصف الحادي عشر' : 'Grade 11'}</option>
          <option value={isRTL ? 'الصف الثاني عشر' : 'Grade 12'}>{isRTL ? 'الصف الثاني عشر' : 'Grade 12'}</option>
        </select>
        <select 
          className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-violet-500 transition-all focus:bg-white min-w-[160px]"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All">{isRTL ? 'الحالة المالية: الكل' : 'Financial Status: All'}</option>
          <option value="paid">{isRTL ? 'خالص' : 'Cleared'}</option>
          <option value="overdue">{isRTL ? 'عليه متأخرات' : 'Overdue'}</option>
        </select>
      </div>

      {/* FINANCIAL KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-violet-300 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'إجمالي المتوقع' : 'Total Expected'}</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">{totalExpected.toLocaleString()} د.ل</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{isRTL ? 'العام الدراسي الحالي' : 'Current Academic Year'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-colors">
          <div className="w-full mr-4 ml-4">
            <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'إجمالي المحصل' : 'Total Collected'}</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">{collected.toLocaleString()} د.ل</p>
            <div className="flex items-center gap-2 mt-2 w-full">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <div className="bg-emerald-500 rounded-full h-1.5 transition-all duration-500" style={{ width: `${collectionRate}%` }}></div>
              </div>
              <p className="text-xs text-emerald-600 font-bold">{collectionRate}%</p>
            </div>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <BarChart4 size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2">
              {isRTL ? 'المتأخرات' : 'Overdue'}
            </p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">{overdue.toLocaleString()} د.ل</p>
            <p className="text-xs text-rose-500 mt-1 font-medium flex items-center gap-1">
               {overdue > 0 ? <><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> {isRTL ? 'يتطلب المتابعة' : 'Requires follow-up'}</> : (isRTL ? 'لا متأخرات' : 'No overdue')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-violet-300 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'متحصلات اليوم' : 'Today\'s Collections'}</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">5,400 د.ل</p>
            <p className="text-xs text-emerald-500 mt-1 font-bold flex items-center gap-0.5"><ArrowUpRight size={14} /> +2% {isRTL ? 'عن الأمس' : 'vs yesterday'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
            <Plus size={24} />
          </div>
        </div>
      </div>

      {/* NAVIGATION & MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => setActiveModule('invoices')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'invoices' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'invoices' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <Receipt size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'invoices' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'إدارة الفواتير' : 'Invoice Management'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'مراجعة الفواتير المستحقة والمدفوعة' : 'Review pending and paid invoices'}</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModule('installments')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'installments' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'installments' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <PieChart size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'installments' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'خطط الأقساط' : 'Installment Plans'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'جدولة ومتابعة أقساط الطلاب' : 'Schedule and track student installments'}</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModule('reports')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'reports' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'reports' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <BarChart4 size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'reports' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'التقارير المالية' : 'Financial Reports'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'إحصائيات الإيرادات والمصروفات' : 'Revenue and expense statistics'}</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModule('student_ledgers')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'student_ledgers' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'student_ledgers' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <Wallet size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'student_ledgers' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'حسابات الطلاب' : 'Student Ledgers'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'متابعة أرصدة الطلاب وحالة السداد' : 'Track student balances and payment status'}</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      {activeModule === 'invoices' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">{isRTL ? 'الفواتير المستحقة والمدفوعة' : 'Due and Paid Invoices'}</h2>
            {filteredTransactions.length > 0 && <button className="text-sm font-bold text-violet-600 hover:text-violet-700 transition-colors">{isRTL ? 'إصدار فاتورة جديدة' : 'Issue New Invoice'}</button>}
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            {filteredTransactions.length > 0 ? (
              <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">{isRTL ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الطالب' : 'Student'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'تاريخ الإصدار' : 'Issue Date'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'المبلغ' : 'Amount'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-20">{isRTL ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{tx.id.replace('RCP', 'INV')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${tx.studentNameEn.replace(' ', '+')}&background=9333ea&color=fff&size=128`} alt="student" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">{isRTL ? tx.studentName : tx.studentNameEn}</p>
                            <p className="text-xs text-slate-500 font-medium">{isRTL ? tx.gradeAr : tx.grade} • {tx.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{tx.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {tx.status === 'overdue' ? <span className="text-rose-600 font-bold">{tx.date}</span> : tx.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-slate-800">{(tx.amount + tx.balanceDue).toLocaleString()} د.ل</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-violet-600 bg-white border border-slate-200 hover:border-violet-200 rounded-lg p-2 shadow-sm transition-all group-hover:bg-violet-50">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Receipt className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{isRTL ? 'لا توجد فواتير' : 'No Invoices Found'}</h3>
                <p className="text-slate-500 font-medium text-sm max-w-[300px]">{isRTL ? 'لا توجد نتائج تطابق الفلاتر المحددة. جرب تغيير الفلاتر.' : 'No items match your selected filters. Try adjusting your search criteria.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModule === 'installments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600">
                  <PieChart size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${plan.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {plan.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{isRTL ? plan.name : plan.nameEn}</h3>
              <p className="text-sm text-slate-500 font-medium mb-6">
                {isRTL ? `${plan.enrolled} طالب مسجل` : `${plan.enrolled} Enrolled Students`}
              </p>
              <div className="border-t border-slate-100 pt-4 mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{isRTL ? 'إجمالي قيمة الخطة' : 'Total Plan Value'}</p>
                <p className="text-2xl font-mono border-b border-transparent font-extrabold text-slate-800">{plan.totalValue.toLocaleString()} د.ل</p>
              </div>
              <button 
                onClick={() => openPlanModal(plan)}
                className="w-full text-violet-700 bg-violet-50 hover:bg-violet-600 hover:text-white rounded-xl py-3 text-sm font-bold transition-colors"
              >
                {isRTL ? 'إدارة الخطة' : 'Manage Plan'}
              </button>
            </div>
          ))}
          <div 
            onClick={() => openPlanModal(null)}
            className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-violet-50 hover:border-violet-300 group transition-colors min-h-[280px]"
          >
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-violet-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
              <Plus size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-violet-900 transition-colors">{isRTL ? 'إنشاء خطة جديدة' : 'Create New Plan'}</h3>
            <p className="text-sm text-slate-500 font-medium group-hover:text-violet-700/70 transition-colors">{isRTL ? 'تخصيص خطة أقساط للطلاب' : 'Configure a custom installment plan'}</p>
          </div>
        </div>
      )}

      {activeModule === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          {/* List of Reports */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{isRTL ? 'التقارير الجاهزة' : 'Standard Reports'}</h3>
            <div className="space-y-4">
              {[
                { id: 1, title: 'تقرير إغلاق اليومية', titleEn: 'Daily Closing Report', desc: 'ملخص المعاملات الناجحة اليومية', descEn: 'Summary of daily successful transactions.', date: '10 مايو 2026', dateEn: '10 May 2026' },
                { id: 2, title: 'تقرير المتأخرات الشامل', titleEn: 'Comprehensive Overdue Report', desc: 'قائمة بجميع أرصدة الطلاب المتأخرة', descEn: 'List of all students with overdue balances.', date: '01 مايو 2026', dateEn: '01 May 2026' },
                { id: 3, title: 'كشف حساب ضرائب', titleEn: 'Tax Statement', desc: 'كشوفات ضريبة القيمة المضافة الربع سنوية', descEn: 'Quarterly VAT and tax statements.', date: '30 أبريل 2026', dateEn: '30 Apr 2026' },
              ].map(report => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-shrink-0 items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-violet-600 group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{isRTL ? report.title : report.titleEn}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{isRTL ? report.desc : report.descEn}</p>
                      <p className="text-xs text-slate-400 mt-2 font-mono">{isRTL ? report.date : report.dateEn}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-violet-600 bg-white border border-slate-200 hover:border-violet-200 rounded-lg p-2.5 shadow-sm transition-all flex-shrink-0">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Simple Chart Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-10 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">{isRTL ? 'صافي الإيرادات (شهرياً)' : 'Net Revenue (Monthly)'}</h3>
              <select className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-700 outline-none">
                <option>2026</option>
                <option>2025</option>
              </select>
            </div>
            
            <div className="w-full h-48 flex items-end justify-between gap-4 mt-6 border-b border-slate-100 pb-2">
               {/* Mock bars */}
               {[
                 { monthAr: 'يناير', monthEn: 'Jan', height: 'h-[40%]', color: 'bg-violet-300', value: '12,500' },
                 { monthAr: 'فبراير', monthEn: 'Feb', height: 'h-[60%]', color: 'bg-violet-400', value: '18,200' },
                 { monthAr: 'مارس', monthEn: 'Mar', height: 'h-[50%]', color: 'bg-violet-400', value: '15,000' },
                 { monthAr: 'أبريل', monthEn: 'Apr', height: 'h-[90%]', color: 'bg-violet-600', value: '28,400' },
                 { monthAr: 'مايو', monthEn: 'May', height: 'h-[75%]', color: 'bg-violet-500', value: '22,100' },
                 { monthAr: 'يونيو', monthEn: 'Jun', height: 'h-[30%]', color: 'bg-slate-300', value: '8,900' },
               ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 relative group h-full">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none z-10 font-mono shadow-md">
                      {bar.value} د.ل
                    </div>
                    {/* Bar */}
                    <div className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative ${bar.height} ${bar.color}`}></div>
                  </div>
               ))}
            </div>
            <div className="w-full flex justify-between px-2 mt-3 text-xs font-bold text-slate-400">
              {[
                 { monthAr: 'يناير', monthEn: 'Jan' },
                 { monthAr: 'فبراير', monthEn: 'Feb' },
                 { monthAr: 'مارس', monthEn: 'Mar' },
                 { monthAr: 'أبريل', monthEn: 'Apr' },
                 { monthAr: 'مايو', monthEn: 'May' },
                 { monthAr: 'يونيو', monthEn: 'Jun' },
              ].map((m, i) => (
                <span key={i} className="flex-1 text-center truncate">{isRTL ? m.monthAr : m.monthEn}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModule === 'student_ledgers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fadeIn">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">{isRTL ? 'حسابات الطلاب' : 'Student Ledgers'}</h2>
          </div>
          <div className="overflow-x-auto min-h-[300px]">
            {filteredTransactions.length > 0 ? (
              <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'اسم الطالب' : 'Student Name'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الصف' : 'Grade'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'إجمالي الفواتير' : 'Total Billed'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'إجمالي المدفوع' : 'Total Paid'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-rose-500 uppercase tracking-widest">{isRTL ? 'الرصيد المستحق' : 'Balance Due'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'حالة السداد' : 'Payment Status'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">{isRTL ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={`ledger-${tx.id}`} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${tx.studentNameEn.replace(' ', '+')}&background=9333ea&color=fff&size=128`} alt="student" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">{isRTL ? tx.studentName : tx.studentNameEn}</p>
                            <p className="text-xs text-slate-500 font-medium">{tx.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">{isRTL ? tx.gradeAr : tx.grade}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-slate-800">{(tx.amount + tx.balanceDue).toLocaleString()} د.ل</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-emerald-600">{tx.amount.toLocaleString()} د.ل</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-base font-bold ${tx.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                          {tx.balanceDue.toLocaleString()} د.ل
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-violet-600 bg-violet-50 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                          <Eye size={14} /> {isRTL ? 'كشف الحساب' : 'View Ledger'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{isRTL ? 'لا توجد نتائج' : 'No Results Found'}</h3>
                <p className="text-slate-500 font-medium text-sm max-w-[300px]">{isRTL ? 'لا توجد نتائج تطابق الفلاتر المحددة. جرب تغيير بعض كلمات البحث أو الفلاتر.' : 'No items match your selected filters. Try adjusting your search criteria.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL FOR INSTALLMENT PLANS */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingPlan ? (isRTL ? 'إدارة خطة الأقساط' : 'Manage Installment Plan') : (isRTL ? 'إنشاء خطة جديدة' : 'Create New Plan')}
              </h3>
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{isRTL ? 'اسم الخطة' : 'Plan Name'}</label>
                <input 
                  type="text" 
                  value={modalFormData.name}
                  onChange={e => setModalFormData({...modalFormData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 transition-all font-medium text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{isRTL ? 'إجمالي القيمة المبدئية' : 'Total Value'}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={modalFormData.totalValue}
                    onChange={e => setModalFormData({...modalFormData, totalValue: Number(e.target.value)})}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 transition-all font-mono font-bold text-slate-800`}
                  />
                  <span className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-sm font-bold text-slate-400 pointer-events-none`}>
                    د.ل
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'حالة الخطة' : 'Plan Status'}</label>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${modalFormData.isActive ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}
                  onClick={() => setModalFormData({...modalFormData, isActive: !modalFormData.isActive})}
                >
                  <span className={`text-sm font-bold ${modalFormData.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {modalFormData.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                  </span>
                  
                  {/* Toggle switch */}
                  <div className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${modalFormData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${modalFormData.isActive ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleSavePlan}
                className="flex-[2] bg-violet-600 text-white hover:bg-violet-700 font-bold py-3 rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                {isRTL ? 'حفظ الخطة' : 'Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
