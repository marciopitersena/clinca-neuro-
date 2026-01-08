
import React, { useState } from 'react';
import { MOCK_DOCTORS } from '../constants';
import { Doctor } from '../types';

const DoctorManager: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  // Alterado para true para abrir a opção de cadastro imediatamente
  const [isRegistering, setIsRegistering] = useState(true);
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '', crm: '', specialty: '', phone: '', email: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoctor: Doctor = {
      ...formData as Doctor,
      id: 'd' + Math.random().toString(36).substr(2, 5)
    };
    setDoctors([newDoctor, ...doctors]);
    setIsRegistering(false);
    setFormData({ name: '', crm: '', specialty: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Corpo Clínico</h2>
          <p className="text-slate-500">Gerenciamento de médicos e profissionais da saúde.</p>
        </div>
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isRegistering ? 'bg-slate-200 text-slate-700' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
          }`}
        >
          {isRegistering ? 'Ver Lista de Profissionais' : '➕ Cadastrar Novo Profissional'}
        </button>
      </div>

      {isRegistering ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="text-3xl">🩺</span>
            <h3 className="text-xl font-bold text-slate-800">Cadastro de Profissional</h3>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input required className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CRM / Registro Profissional</label>
              <input required className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Especialidade</label>
              <input required className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefone de Contato</label>
              <input required className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail Profissional</label>
              <input type="email" required className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all transform active:scale-[0.98]">
                Finalizar Cadastro do Profissional
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Profissional</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CRM</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Especialidade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {doctors.map(d => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{d.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{d.crm}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">{d.specialty}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <p className="font-medium">{d.phone}</p>
                    <p className="text-xs opacity-60">{d.email}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorManager;
