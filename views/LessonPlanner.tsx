import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Sparkles, 
  Send,
  Save,
  Download,
  FileText,
  Clock,
  Target,
  List,
  CheckCircle2,
  PenTool,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Plus
} from 'lucide-react';

interface LessonPlannerProps {
  language: Language;
}

const AI_BLOCKS = [
  {
    id: 'ai-1',
    type: 'objectives',
    title: 'الأهداف التعليمية',
    rawHtml: `<ul class="list-disc list-inside space-y-2"><li>أن يتعرف الطالب على مفهوم الجاذبية الأرضية.</li><li>أن يدرك الطالب أثر الجاذبية على الأشياء ذات الأوزان المختلفة.</li><li>أن يستنتج الطالب أهمية الجاذبية في حياتنا اليومية.</li></ul>`
  },
  {
    id: 'ai-2',
    type: 'materials',
    title: 'المواد والأدوات اللازمة',
    rawHtml: `<ul class="list-disc list-inside space-y-2"><li>كرات مختلفة الحجم والوزن (كرة تنس، كرة سلة، كرة بينج بونج)</li><li>ريشة وعملة معدنية</li><li>جهاز عرض (بروجكتور) لعرض فيديو قصير</li><li>أوراق عمل وأقلام تلوين</li></ul>`
  },
  {
    id: 'ai-3',
    type: 'timeline',
    title: 'المسار الزمني للدرس (45 دقيقة)',
    items: [
      { time: '5 دقائق', title: 'التمهيد وإثارة الانتباه', desc: 'طرح سؤال افتتاحي: "ماذا سيحدث إذا رمينا هذا القلم في الهواء؟ ولماذا يسقط للأسفل دائمًا؟"' },
      { time: '15 دقيقة', title: 'الشرح والتجربة العملية', desc: 'عرض مرئي مبسّط لمفهوم الجاذبية. ثم القيام بتجربة سقوط كرات مختلفة الأوزان من نفس الارتفاع لملاحظة أنها تسقط في نفس الوقت.' },
      { time: '15 دقيقة', title: 'نشاط المجموعات (ورقة العمل)', desc: 'تقسيم الطلاب لمجموعات صغيرة لحل ورقة العمل ورسم تخيل لبيئة بدون جاذبية.' },
      { time: '10 دقائق', title: 'التقييم الخاتمي والخلاصة', desc: 'مراجعة سريعة لما تم تعلمه، وتقييم شفهي لبعض المفاهيم، وتلخيص الدرس.' },
    ]
  },
  {
    id: 'ai-4',
    type: 'assessment',
    title: 'التقييم المستمر',
    rawHtml: `<p>توجيه أسئلة سريعة أثناء فترة التجربة للتأكد من استيعاب الطلاب لفكرة أن الوزن ليس هو العامل الوحيد المؤثر في سرعة السقوط، بل مقاومة الهواء (باستخدام الريشة والعملة).</p>`
  }
];

export const LessonPlanner: React.FC<LessonPlannerProps> = ({ language }) => {
  const [grade, setGrade] = useState('الصف الخامس');
  const [subject, setSubject] = useState('العلوم');
  const [topic, setTopic] = useState('الجاذبية الأرضية');
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');

  const [aiBlocks, setAiBlocks] = useState<any[]>(AI_BLOCKS);
  const [manualBlocks, setManualBlocks] = useState<any[]>([]);

  const isRTL = language === Language.AR; 

  const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'الصف السابع', 'الصف الثامن', 'الصف التاسع', 'الصف العاشر', 'الصف الحادي عشر', 'الصف الثاني عشر'];
  const subjects = ['العلوم', 'الرياضيات', 'التاريخ', 'اللغة العربية', 'اللغة الإنجليزية'];

  const getEmptyBlock = (type: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    switch (type) {
      case 'objectives':
        return { id, type, title: 'الأهداف التعليمية', rawHtml: '<ul class="list-disc list-inside"><li>اكتب هدفاً هنا...</li></ul>' };
      case 'materials':
        return { id, type, title: 'المواد والأدوات اللازمة', rawHtml: '<ul class="list-disc list-inside"><li>أضف أداة...</li></ul>' };
      case 'timeline':
        return { id, type, title: 'المسار الزمني للدرس', items: [{ time: 'مدة', title: 'عنوان الفقرة...', desc: 'اكتب وصف النشاط هنا...' }] };
      case 'assessment':
        return { id, type, title: 'التقييم', rawHtml: '<p>اكتب طريقة التقييم هنا...</p>' };
      default:
        return { id, type, title: 'فقرة جديدة', rawHtml: '<p>نص...</p>' };
    }
  };

  const addManualBlock = (type: string) => {
    setManualBlocks(prev => [...prev, getEmptyBlock(type)]);
  };

  const addTimelineItem = (blockId: string) => {
    const updateBlocks = (blocks: any[]) => blocks.map(block => {
      if (block.id === blockId && block.type === 'timeline') {
        return {
          ...block,
          items: [...block.items, { time: 'مدة جديدة', title: 'إجراء جديد...', desc: 'اكتب وصف النشاط هنا...' }]
        };
      }
      return block;
    });

    if (activeTab === 'ai') {
      setAiBlocks(updateBlocks(aiBlocks));
    } else {
      setManualBlocks(updateBlocks(manualBlocks));
    }
  };

  const currentBlocks = activeTab === 'ai' ? aiBlocks : manualBlocks;

  const renderIcon = (type: string) => {
    switch (type) {
      case 'objectives': return <Target size={18} className="text-violet-600" />;
      case 'materials': return <List size={18} className="text-violet-600" />;
      case 'timeline': return <Clock size={18} className="text-violet-600" />;
      case 'assessment': return <CheckCircle2 size={18} className="text-violet-600" />;
      default: return <FileText size={18} className="text-violet-600" />;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto pb-6 h-[calc(100vh-100px)]" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        
        {/* Column 1: Control Panel (Right Side in RTL) lg:col-span-4 */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
          
          {/* Tabs */}
          <div className="flex bg-slate-100 p-1.5 mx-4 mt-4 rounded-xl shrink-0">
            <button 
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'ai' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              المساعد الذكي
            </button>
            <button 
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'manual' ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              إنشاء يدوي
            </button>
          </div>

          {/* Context Selectors - Always Visible */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-white font-medium text-slate-700 hover:border-violet-300 transition-colors"
                  >
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <select 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-sm rounded-xl border border-slate-200 p-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-white font-medium text-slate-700 hover:border-violet-300 transition-colors"
                  >
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <input 
                  type="text" 
                  value={topic} 
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="الموضوع (مثال: الجاذبية الأرضية)" 
                  className="w-full text-sm rounded-xl border border-slate-200 p-2 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-white font-medium text-slate-700 hover:border-violet-300 transition-colors"
                />
              </div>
              {activeTab === 'ai' && (
                <button className="w-full mt-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm text-sm">
                  <Sparkles size={18} />
                  ✨ توليد الخطة آلياً
                </button>
              )}
            </div>
          </div>

          {activeTab === 'ai' && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30 font-medium">
                {/* User Message */}
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tr-sm p-4 text-sm max-w-[85%] leading-relaxed shadow-sm">
                    قم بإنشاء خطة درس تفاعلية عن الجاذبية الأرضية للصف الخامس.
                  </div>
                </div>
                {/* AI Message */}
                <div className="flex justify-end">
                  <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-2xl rounded-tl-sm p-4 text-sm max-w-[90%] shadow-md leading-relaxed">
                    <p className="flex items-center gap-2 mb-2 opacity-90 text-[11px] uppercase tracking-wider font-bold">
                      <Sparkles size={12} /> المساعد الذكي
                    </p>
                    بالتأكيد! جاري إعداد خطة الدرس مع التركيز على التجارب العملية والأنشطة التفاعلية لتناسب مستوى الصف الخامس...
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-100 bg-white shrink-0">
                <div className="rounded-full border border-violet-200 bg-white p-1.5 flex items-center shadow-sm relative focus-within:ring-2 focus-within:ring-violet-500 transition-all">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="تحدث مع المساعد الذكي..."
                    className="flex-1 bg-transparent border-none outline-none text-sm px-4 text-slate-800 placeholder-slate-400 font-medium h-9"
                  />
                  <button className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 transition-colors flex-shrink-0 focus:outline-none shadow-sm mr-2 text-center" dir="ltr">
                    <Send size={15} className="-ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="flex flex-col flex-1 p-6 bg-slate-50/30 overflow-y-auto">
              <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                <PenTool size={20} className="text-violet-600" />
                أدوات بناء الخطة
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => addManualBlock('objectives')} 
                  className="border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50 text-slate-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-sm text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <Target className="text-violet-500 shrink-0" size={20} />
                  + إضافة أهداف تعليمية
                </button>
                <button 
                  onClick={() => addManualBlock('materials')} 
                  className="border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50 text-slate-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-sm text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <List className="text-violet-500 shrink-0" size={20} />
                  + إضافة مواد وأدوات
                </button>
                <button 
                  onClick={() => addManualBlock('timeline')} 
                  className="border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50 text-slate-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-sm text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <Clock className="text-violet-500 shrink-0" size={20} />
                  + إضافة مسار زمني
                </button>
                <button 
                  onClick={() => addManualBlock('assessment')} 
                  className="border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50 text-slate-700 p-4 rounded-xl flex items-center gap-3 transition cursor-pointer shadow-sm text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <CheckCircle2 className="text-violet-500 shrink-0" size={20} />
                  + إضافة تقييم
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Live Document Preview & Library Action (Left Side in RTL) lg:col-span-8 */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-8 h-full flex flex-col relative overflow-hidden">
          
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-slate-100 shrink-0">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-violet-500 shrink-0" size={24} />
                <h2 
                  contentEditable 
                  suppressContentEditableWarning 
                  className="text-2xl font-bold text-slate-900 outline-none focus:bg-slate-50 hover:bg-slate-50 rounded-lg p-1 min-w-[200px] transition-colors"
                >
                  {topic ? `خطة درس: ${topic}` : 'عنوان الدرس...'}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                <span 
                  contentEditable 
                  suppressContentEditableWarning
                  className="bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded border border-violet-100 outline-none focus:ring-2 focus:ring-violet-400"
                >
                  {subject || 'المادة'}
                </span>
                <span className="opacity-50">•</span>
                <span 
                  contentEditable 
                  suppressContentEditableWarning
                  className="outline-none focus:bg-slate-100 px-1 rounded"
                >
                  {grade || 'الصف'}
                </span>
                <span className="opacity-50">•</span>
                <span
                   contentEditable 
                   suppressContentEditableWarning
                   className="outline-none focus:bg-slate-100 px-1 rounded"
                >
                  45 دقيقة
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors focus:outline-none">
                <Download size={20} />
              </button>
              <button className="bg-violet-600 text-white flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-violet-700 hover:shadow-md transition-all focus:outline-none shadow-sm">
                <Save size={18} />
                حفظ في المكتبة
              </button>
            </div>
          </div>

          {/* Formatting Toolbar - Always Visible */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-lg text-slate-500 mb-6 w-fit shrink-0">
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none bg-white shadow-sm text-violet-600"><Bold size={16} /></button>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><Italic size={16} /></button>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><Underline size={16} /></button>
            <div className="w-px h-5 bg-slate-200 mx-1"></div>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><List size={16} /></button>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><ListOrdered size={16} /></button>
            <div className="w-px h-5 bg-slate-200 mx-1"></div>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><AlignRight size={16} /></button>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><AlignCenter size={16} /></button>
            <button className="p-1.5 hover:bg-white hover:text-violet-600 hover:shadow-sm rounded-md transition-all focus:outline-none"><AlignLeft size={16} /></button>
          </div>

          {/* Document Content - Rich Text Editable blocks */}
          <div className="flex-1 overflow-y-auto pr-2 pb-8 text-slate-700 font-medium relative">
            
            {currentBlocks.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-slate-400 text-lg">ابدأ بإضافة بلوك من القائمة اليمنى...</span>
              </div>
            ) : (
              currentBlocks.map((block) => (
                <div key={block.id} className="mb-8 group">
                  <h3 
                    contentEditable 
                    suppressContentEditableWarning
                    className="text-lg font-bold text-violet-900 flex items-center gap-2 mb-4 outline-none focus:bg-violet-50 rounded-lg p-1 -ml-1 transition-colors"
                  >
                    <span contentEditable={false}>{renderIcon(block.type)}</span>
                    {block.title}
                  </h3>

                  {block.type === 'timeline' ? (
                    <div className="space-y-4 pr-2">
                       {block.items.map((item: any, idx: number) => (
                         <div key={idx} className="flex gap-4 p-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-colors group/item">
                           <div 
                             contentEditable 
                             suppressContentEditableWarning 
                             className="w-16 h-8 shrink-0 flex items-center justify-center bg-white rounded-lg border border-slate-200 text-xs font-bold text-slate-500 shadow-sm outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                           >
                              {item.time}
                           </div>
                           <div className="flex-1">
                              <h4 
                                contentEditable 
                                suppressContentEditableWarning 
                                className="font-bold text-slate-900 text-[15px] outline-none hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-violet-400 rounded p-1 -ml-1 transition-all"
                              >
                                {item.title}
                              </h4>
                              <p 
                                contentEditable 
                                suppressContentEditableWarning 
                                className="text-[14px] text-slate-600 mt-1.5 leading-relaxed outline-none hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-violet-400 rounded p-1 -ml-1 transition-all"
                              >
                                {item.desc}
                              </p>
                           </div>
                         </div>
                       ))}
                       <button onClick={() => addTimelineItem(block.id)} className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 mt-2 p-2 hover:bg-violet-50 rounded-lg transition-colors focus:outline-none">
                         <Plus size={16} /> إضافة فقرة زمنية
                       </button>
                    </div>
                  ) : (
                    <div 
                      contentEditable 
                      suppressContentEditableWarning 
                      className="pr-4 text-slate-700 outline-none hover:bg-slate-50 focus:bg-white focus:ring-2 focus:ring-violet-400 rounded-xl p-3 transition-all min-h-[3rem]"
                      dangerouslySetInnerHTML={{ __html: block.rawHtml }} 
                    />
                  )}
                </div>
              ))
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
};
