
import React from 'react';

interface RegistrationCenterProps {
  onSelect: (tab: string) => void;
}

const RegistrationCenter: React.FC<RegistrationCenterProps> = ({ onSelect }) => {
  const options = [
    { id: 'patients', title: 'Paciente', icon: '👤', desc: 'Dados pessoais, CPF, RG e filiação.' },
    { id: 'doctors', title: 'Médico', icon: '🩺', desc: 'Registro de profissionais e CRM.' },
    { id: 'insurances', title: 'Convênio', icon: '🏥', desc: 'Planos de saúde e operadoras.' },
    { id: 'calendar', title: 'Agendamento', icon: '📅', desc: 'Vincular paciente a médico e hora.' },
    { id: 'reports', title: 'Laudo/Anamnese', icon: '📄', desc: 'Documentação clínica do paciente.' },
  ];

  return (
    <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Centro de Cadastros</h2>
        <p className="text-slate-500">Selecione o que deseja cadastrar no sistema.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="flex flex-col items-start p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left group"
          >
            <span className="text-4xl mb-4 bg-slate-50 p-4 rounded-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Cadastrar {opt.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{opt.desc}</p>
            <div className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm">
              Acessar formulário <span className="text-lg">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegistrationCenter;
