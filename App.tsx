import React, { useState } from 'react';
import { UserRole, Language, User, NavItem } from './types';
import { Header } from './components/Header';
import { Dashboard } from './views/Dashboard';
import { LessonPlanner } from './views/LessonPlanner';
import { LessonPlanLibrary } from './views/LessonPlanLibrary';
import { UserManagement } from './views/Students';
import { Curriculum } from './views/Curriculum';
import { CurriculumHub } from './views/CurriculumHub';
import { Gradebook } from './views/Gradebook';
import { ClassManagement } from './views/ClassManagement';
import { Attendance } from './views/Attendance';
import { Analytics } from './views/Analytics';
import { Settings } from './views/Settings';
import { EditStudentProfile } from './views/EditStudentProfile';
import { MOEDashboardView } from './views/MOEDashboardView';
import { FinancialManagement } from './views/FinancialManagement';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  LibraryBig, 
  BarChart3, 
  Settings as SettingsIcon, 
  School,
  Activity,
  Menu,
  X,
  FileSpreadsheet,
  Users,
  Calendar,
  Landmark,
  ChevronDown,
  ChevronUp,
  CreditCard
} from 'lucide-react';
import taliaLogo from './assets/talia-360-logo.png';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.AR);
  const [activeView, setActiveView] = useState('moe-dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState<Record<string, boolean>>({
    'moe-dashboard': true
  });
  
  // Mock User State
  const [user, setUser] = useState<User>({
    id: 'u1',
    name: 'Sarah Al-Majed',
    role: UserRole.ADMIN,
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  });

  const toggleLanguage = () => {
    setLanguage(prev => prev === Language.AR ? Language.EN : Language.AR);
  };

  const isRTL = language === Language.AR;

  // Navigation Config
  const navItems: NavItem[] = [
    { 
      id: 'moe-dashboard', 
      labelEn: 'MOE Command Center', 
      labelAr: 'مركز القيادة', 
      icon: <Landmark size={20} />, 
      view: 'moe-dashboard',
      subItems: [
        { id: 'moe-overview', labelAr: 'النظرة العامة', labelEn: 'Overview', view: 'moe-overview' },
        { id: 'moe-academies', labelAr: 'الاكاديميات و الطلاب', labelEn: 'Academies & Students', view: 'moe-academies' },
        { id: 'moe-hr', labelAr: 'الموارد البشريه و المعلمون', labelEn: 'HR & Teachers', view: 'moe-hr' },
        { id: 'moe-infra', labelAr: 'البنية التحتية و المدارس', labelEn: 'Infrastructure & Schools', view: 'moe-infra' },
        { id: 'moe-finance', labelAr: 'الماليه', labelEn: 'Finance', view: 'moe-finance' }
      ]
    },
    { 
      id: 'dashboard', 
      labelEn: 'Dashboard', 
      labelAr: 'الرئيسية', 
      icon: <LayoutDashboard size={20} />, 
      view: 'dashboard',
      subItems: [
        { id: 'dash-all', labelAr: 'المدرسة بأكملها', labelEn: 'Whole School', view: 'dash-all' },
        { id: 'dash-elem', labelAr: 'المرحلة الابتدائية', labelEn: 'Primary School', view: 'dash-elem' },
        { id: 'dash-mid', labelAr: 'المرحلة الاعدادية', labelEn: 'Middle School', view: 'dash-mid' },
        { id: 'dash-high', labelAr: 'المرحلة الثانوية', labelEn: 'High School', view: 'dash-high' }
      ]
    },
    { 
      id: 'users', 
      labelEn: 'People', 
      labelAr: 'المستخدمين', 
      icon: <Users size={20} />, 
      view: 'users',
      subItems: [
        { id: 'users-admin', labelAr: 'الادارة', labelEn: 'Administration', view: 'users-admin' },
        { id: 'users-teachers', labelAr: 'المعلمون', labelEn: 'Teachers', view: 'users-teachers' },
        { id: 'users-parents', labelAr: 'أولياء الأمور', labelEn: 'Parents', view: 'users-parents' },
        { id: 'users-students', labelAr: 'الطلاب', labelEn: 'Students', view: 'users-students' },
      ]
    },
    { 
      id: 'curriculum', 
      labelEn: 'Courses', 
      labelAr: 'المنهج الدراسي', 
      icon: <LibraryBig size={20} />, 
      view: 'curriculum',
      subItems: [
        { id: 'curr-setup', labelAr: 'إعداد المنهج', labelEn: 'Curriculum Setup', view: 'curr-setup' },
        { id: 'lessons-planner', labelAr: 'مخطط الدروس', labelEn: 'Lesson Planner', view: 'lessons-planner' },
        { id: 'lessons-library', labelAr: 'مكتبة خطط الدروس', labelEn: 'Lesson Plan Library', view: 'lessons-library' }
      ]
    },
    { id: 'classes', labelEn: 'Classes', labelAr: 'الفصول', icon: <School size={20} />, view: 'classes' },
    { id: 'attendance', labelEn: 'Attendance', labelAr: 'الحضور', icon: <Calendar size={20} />, view: 'attendance' },
    { id: 'gradebook', labelEn: 'Gradebook', labelAr: 'سجل الدرجات', icon: <FileSpreadsheet size={20} />, view: 'gradebook' },
    { id: 'finance', labelEn: 'Finance', labelAr: 'إدارة المدفوعات', icon: <CreditCard size={20} />, view: 'finance' },
    { id: 'settings', labelEn: 'Settings', labelAr: 'الإعدادات', icon: <SettingsIcon size={20} />, view: 'settings' },
  ];

  React.useEffect(() => {
    // Automatically expand the parent section when a child view becomes active
    const activeItem = navItems.find(item => 
      item.view === activeView || item.subItems?.some(s => s.view === activeView)
    );
    if (activeItem && activeItem.subItems && !expandedNav[activeItem.id]) {
      setExpandedNav(prev => ({ ...prev, [activeItem.id]: true }));
    }
  }, [activeView]);

  const renderContent = () => {
    switch (activeView) {
      case 'moe-dashboard':
      case 'moe-overview':
      case 'moe-academies':
      case 'moe-hr':
      case 'moe-infra':
      case 'moe-finance': {
        const tabMap: Record<string, string> = {
          'moe-dashboard': 'overview',
          'moe-overview': 'overview',
          'moe-academies': 'academics',
          'moe-hr': 'hr',
          'moe-infra': 'infrastructure',
          'moe-finance': 'financials',
        };
        return <MOEDashboardView language={language} activeTabProp={tabMap[activeView] || 'overview'} onTabChange={(tab) => {
          const viewMap: Record<string, string> = {
             'overview': 'moe-overview',
             'academics': 'moe-academies',
             'hr': 'moe-hr',
             'infrastructure': 'moe-infra',
             'financials': 'moe-finance'
          };
          if (viewMap[tab] && viewMap[tab] !== activeView) setActiveView(viewMap[tab]);
        }} />;
      }
      case 'finance':
        return <FinancialManagement language={language} />;
      case 'dashboard':
      case 'dash-all':
      case 'dash-elem':
      case 'dash-mid':
      case 'dash-high': {
        const filterMap: Record<string, string> = {
          'dashboard': isRTL ? 'المدرسة بأكملها' : 'All School',
          'dash-all': isRTL ? 'المدرسة بأكملها' : 'All School',
          'dash-elem': isRTL ? 'الابتدائية' : 'Elementary',
          'dash-mid': isRTL ? 'المتوسطة' : 'Middle School',
          'dash-high': isRTL ? 'الثانوية' : 'High School'
        };
        const mappedFilter = filterMap[activeView] || (isRTL ? 'المدرسة بأكملها' : 'All School');
        return <Dashboard role={user.role} language={language} activeFilterProp={mappedFilter} onFilterChange={(filter) => {
          const viewMap: Record<string, string> = {
            'المدرسة بأكملها': 'dash-all',
            'All School': 'dash-all',
            'الابتدائية': 'dash-elem',
            'Elementary': 'dash-elem',
            'المتوسطة': 'dash-mid',
            'Middle School': 'dash-mid',
            'الثانوية': 'dash-high',
            'High School': 'dash-high'
          };
          if (viewMap[filter] && viewMap[filter] !== activeView) setActiveView(viewMap[filter]);
        }} />;
      }
      case 'classes':
        return <ClassManagement role={user.role} language={language} user={user} />;
      case 'attendance':
        return <Attendance role={user.role} language={language} user={user} />;
      case 'lessons-planner':
        return <LessonPlanner language={language} />;
      case 'lessons-library':
        return <LessonPlanLibrary language={language} />;
      case 'users':
      case 'users-admin':
      case 'users-teachers':
      case 'users-parents':
      case 'users-students': {
        const tabMap: Record<string, string> = {
          'users': 'students', // default
          'users-admin': 'admins',
          'users-teachers': 'teachers',
          'users-parents': 'parents',
          'users-students': 'students',
        };
        const activeTabStr = tabMap[activeView] as 'students' | 'parents' | 'teachers' | 'admins';
        return <UserManagement language={language} role={user.role} onEditProfile={() => setActiveView('edit-profile')} activeTabProp={activeTabStr} onTabChange={(tab) => {
          const viewMap: Record<string, string> = {
            'students': 'users-students',
            'parents': 'users-parents',
            'teachers': 'users-teachers',
            'admins': 'users-admin'
          };
          if (viewMap[tab] && viewMap[tab] !== activeView) setActiveView(viewMap[tab]);
        }} />;
      }
      case 'curriculum':
        return <CurriculumHub language={language} onNavigate={setActiveView} />;
      case 'curr-setup':
        return <Curriculum language={language} />;
      case 'gradebook':
        return <Gradebook role={user.role} language={language} />;
      case 'analytics':
        return <Analytics role={user.role} language={language} />;
      case 'settings':
        return <Settings role={user.role} language={language} />;
      case 'edit-profile':
        return <EditStudentProfile onBack={() => setActiveView('users')} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <span className="text-6xl mb-6 opacity-30">
              <SettingsIcon size={64} />
            </span>
            <p className="text-xl font-medium">Feature coming soon</p>
          </div>
        );
    }
  };

  const getActiveTitle = () => {
    let title = isRTL ? 'لوحة القيادة' : 'Dashboard';
    for (const item of navItems) {
      if (item.view === activeView) {
        title = isRTL ? item.labelAr : item.labelEn;
        break;
      }
      if (item.subItems) {
        const sub = item.subItems.find(s => s.view === activeView);
        if (sub) {
          title = isRTL ? sub.labelAr : sub.labelEn;
          break;
        }
      }
    }
    return title;
  };

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[#fafafa] flex text-gray-900 font-sans relative">
      
      {/* Mobile Menu Toggle */}
      {activeView !== 'edit-profile' && (
        <div className={`lg:hidden fixed top-0 ${isRTL ? 'right-0' : 'left-0'} z-50 p-4`}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      )}

      {/* M3 Navigation Drawer */}
      {activeView !== 'edit-profile' && (
        <aside className={`
          bg-[#f8f9fa] flex-shrink-0 flex flex-col fixed top-0 h-full z-40 transition-all duration-300 border-gray-100 overflow-hidden
          ${isRTL ? 'right-0 border-l' : 'left-0 border-r'}
          ${isMobileMenuOpen ? 'translate-x-0 w-[280px]' : (isRTL ? 'translate-x-full w-[280px]' : '-translate-x-full w-[280px]')}
          lg:translate-x-0 lg:w-[280px]
        `}>
        <div className="w-full p-6 border-b border-slate-100 flex items-center justify-center">
          <img 
            src={taliaLogo} 
            alt="Talia 360" 
            className="w-40 max-w-[180px] object-contain block"
            onError={(e) => console.error("Logo failed to load:", e.currentTarget.src)}
          />
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 min-w-[280px]">
          {navItems.map((item) => {
            const isActive = activeView === item.view || item.subItems?.some(s => s.view === activeView);
            const isExactActive = activeView === item.view;
            const isExpanded = expandedNav[item.id];

            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => {
                    setActiveView(item.view);
                    if (item.subItems) {
                      setExpandedNav(prev => ({ ...prev, [item.id]: !prev[item.id] }));
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                    isExactActive 
                      ? 'bg-violet-100 text-violet-800' 
                      : isActive
                      ? 'bg-slate-100 text-slate-800'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center w-6">
                      {item.icon}
                    </div>
                    <span className="transition-opacity duration-300 whitespace-nowrap">{isRTL ? item.labelAr : item.labelEn}</span>
                  </div>
                  {item.subItems && (
                    <div className="flex-shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  )}
                </button>
                {item.subItems && isExpanded && (
                  <div className={`${isRTL ? 'pr-12' : 'pl-12'} space-y-1 mt-1`}>
                    {item.subItems.map(sub => {
                      const isSubActive = activeView === sub.view;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveView(sub.view);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                            isSubActive
                              ? 'bg-violet-100 text-violet-800'
                              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className="whitespace-nowrap">{isRTL ? sub.labelAr : sub.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="p-4 min-w-[280px]">
          <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100 flex items-center gap-3">
             <div className="flex-shrink-0 flex items-center justify-center w-6 text-violet-700">
                <Activity size={20} className="animate-pulse" />
             </div>
             <div className="transition-opacity duration-300 whitespace-nowrap overflow-hidden">
               <span className="text-xs font-bold uppercase tracking-wider text-violet-700 block mb-1">System Live</span>
               <p className="text-[10px] text-violet-600 font-medium">v2.4.0 • Gemini 3.0</p>
             </div>
          </div>
        </div>
      </aside>
      )}

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all w-full lg:w-auto ${activeView === 'edit-profile' ? '' : (isRTL ? 'lg:mr-[280px]' : 'lg:ml-[280px]')}`}>
        {activeView !== 'edit-profile' && (
          <Header 
            user={user} 
            language={language} 
            toggleLanguage={toggleLanguage}
            activeTitle={getActiveTitle()}
          />
        )}
        
        <main className={`flex-1 overflow-y-auto ${activeView === 'settings' || activeView === 'edit-profile' ? 'p-0' : 'p-4 md:p-8'}`}>
          <div className={`${activeView === 'settings' || activeView === 'edit-profile' ? 'w-full' : 'max-w-7xl mx-auto'} h-full`}>
            {renderContent()}
          </div>
        </main>
      </div>
      
    </div>
  );
};

export default App;