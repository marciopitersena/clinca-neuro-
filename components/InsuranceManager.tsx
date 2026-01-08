
import React, { useState } from 'react';
import { MOCK_INSURANCES } from '../constants';
import { Insurance } from '../types';

const InsuranceManager: React.FC = () => {
  const [insurances, setInsurances] = useState<Insurance[]>(MOCK_INSURANCES);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<Partial<Insurance>>({ name: '', ansCode: '', status: 'Ativo' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsurance: Insurance = {
      ...formData as Insurance,
      id: 'i' + Math.random().toString(36).substr(2, 5)
    };
    setInsurances([...insurances, newInsurance]);
    setIsRegistering(false);
    setFormData({ name: '', ansCode: '', status: 'Ativo' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Convênios e Planos</h2>
          <p className="text-slate-500">Operadoras de saúde parceiras da clínica.</p>
        </div>
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isRegistering ? 'bg-slate-200 text-slate-700' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100'
          }`}
        >
          {isRegistering ? 'Voltar para Lista' : '➕ Novo Convênio'}
        </button>
      </div>

      {isRegistering ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Cadastro de Convênio</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Operadora</label>
              <input required className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código Registro ANS</label>
              <input className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200 font-mono" 
                value={formData.ansCode} onChange={e => setFormData({...formData, ansCode: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
              <select className="w-full p-2.5 bg-slate-50 rounded-lg border-none ring-1 ring-slate-200"
                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg mt-4">
              Salvar Convênio
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Operadora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Registro ANS</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {insurances.map(i => (
                <tr key={i.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{i.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{i.ansCode || '---'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      i.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {i.status}
                    </span>
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

export default InsuranceManager;
