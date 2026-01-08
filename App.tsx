
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PatientManager from './components/PatientManager';
import AIAssistant from './components/AIAssistant';
import CalendarManager from './components/CalendarManager';
import RegistrationCenter from './components/RegistrationCenter';
import DoctorManager from './components/DoctorManager';
import InsuranceManager from './components/InsuranceManager';
import ReportManager from './components/ReportManager';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'registration':
        return <RegistrationCenter onSelect={setActiveTab} />;
      case 'patients':
        return <PatientManager />;
      case 'calendar':
        return <CalendarManager />;
      case 'doctors':
        return <DoctorManager />;
      case 'insurances':
        return <InsuranceManager />;
      case 'reports':
        return <ReportManager />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'financial':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center animate-in fade-in duration-500">
             <div className="text-6xl mb-6">💰</div>
            <h3 className="text-2xl font-bold text-slate-800">Módulo Financeiro</h3>
            <p className="text-slate-500 mt-2 max-w-md">Controle de faturamento, TISS e repasses médicos integrado.</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                <img src="https://picsum.photos/seed/doctor/100" alt="Avatar" />
             </div>
             <div>
               <h4 className="font-bold text-slate-800">Dr. Ricardo Oliveira</h4>
               <p className="text-xs text-slate-500 font-medium">Diretor Clínico • CRM-SP 123456</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('registration')}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all text-sm"
            >
              <span>➕</span> Novo Cadastro
            </button>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
              🔔
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
