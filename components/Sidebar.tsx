
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'registration', icon: '📝', label: 'Cadastros' },
    { id: 'calendar', icon: '📅', label: 'Agenda' },
    { id: 'patients', icon: '👥', label: 'Pacientes' },
    { id: 'doctors', icon: '👨‍⚕️', label: 'Médicos' },
    { id: 'insurances', icon: '🏥', label: 'Convênios' },
    { id: 'reports', icon: '📄', label: 'Laudos' },
    { id: 'financial', icon: '💰', label: 'Financeiro' },
    { id: 'ai-assistant', icon: '🤖', label: 'Assistente AI' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
            C+
          </div>
          <h1 className="text-xl font-bold text-slate-800">ClinicaPro</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm shadow-indigo-100'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Inteligência Médica</p>
          <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Gemini 3 Pro Ativo
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
