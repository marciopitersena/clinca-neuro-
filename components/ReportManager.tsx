
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_REPORTS, MOCK_PATIENTS, MOCK_DOCTORS } from '../constants';
import { MedicalReport } from '../types';
import { generateMedicalSummary } from '../services/geminiService';

const ReportManager: React.FC = () => {
  const [reports, setReports] = useState<MedicalReport[]>(MOCK_REPORTS);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<MedicalReport>>({
    title: '', 
    content: '', 
    date: new Date().toISOString().split('T')[0],
    examName: '',
    examDate: '',
    examResult: ''
  });

  // Estados para o seletor de médico pesquisável
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const doctorDropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(event.target as Node)) {
        setIsDoctorDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDoctors = MOCK_DOCTORS.filter(doc => 
    doc.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(doctorSearchTerm.toLowerCase())
  );

  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === formData.doctorId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.doctorId) {
      alert("Por favor, selecione o paciente e o médico.");
      return;
    }
    const newReport: MedicalReport = {
      ...formData as MedicalReport,
      id: 'r' + Math.random().toString(36).substr(2, 5)
    };
    setReports([newReport, ...reports]);
    setIsRegistering(false);
    setFormData({ 
      title: '', 
      content: '', 
      date: new Date().toISOString().split('T')[0],
      examName: '',
      examDate: '',
      examResult: ''
    });

    // Feedback de sucesso por 3 segundos
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleGenerateSummary = async () => {
    if (!formData.patientId) {
      alert("Selecione um paciente primeiro para gerar o resumo.");
      return;
    }

    const patient = MOCK_PATIENTS.find(p => p.id === formData.patientId);
    if (!patient) return;

    setLoadingSummary(true);
    const summary = await generateMedicalSummary(patient.name, patient.medicalHistory);
    
    setFormData(prev => ({
      ...prev,
      content: prev.content 
        ? `${prev.content}\n\n--- Resumo do Histórico (AI) ---\n${summary}`
        : summary
    }));
    setLoadingSummary(false);
  };

  const getPatientName = (id: string) => MOCK_PATIENTS.find(p => p.id === id)?.name || 'Paciente Externo';
  const getDoctorName = (id: string) => MOCK_DOCTORS.find(d => d.id === id)?.name || 'Médico Externo';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Prontuário e Laudos</h2>
          <p className="text-slate-500 text-sm">Histórico clínico e resultados de exames complementares.</p>
        </div>
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${
            isRegistering ? 'bg-slate-200 text-slate-700' : 'bg-purple-600 text-white shadow-lg shadow-purple-100'
          }`}
        >
          {isRegistering ? 'Voltar para Lista' : '➕ Novo Laudo / Exame'}
        </button>
      </div>

      {showSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-3 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <span className="text-xl">✅</span>
          <span className="font-bold text-sm tracking-tight uppercase">Laudo registrado com sucesso!</span>
        </div>
      )}

      {isRegistering ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
            <span className="text-3xl">📝</span>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Registro Clínico Detalhado</h3>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Paciente</label>
                <select required className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  value={formData.patientId || ''}
                  onChange={e => setFormData({...formData, patientId: e.target.value})}>
                  <option value="">Selecione o paciente...</option>
                  {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>

              {/* Seletor de Médico Pesquisável */}
              <div className="space-y-1 relative" ref={doctorDropdownRef}>
                <label className="text-[10px] font-black text-slate-400 uppercase">Médico Solicitante/Responsável</label>
                <div 
                  onClick={() => setIsDoctorDropdownOpen(!isDoctorDropdownOpen)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm cursor-pointer flex justify-between items-center hover:bg-slate-100 transition-colors"
                >
                  <span className={selectedDoctor ? "text-slate-800 font-medium" : "text-slate-400"}>
                    {selectedDoctor ? `${selectedDoctor.name} (${selectedDoctor.specialty})` : "Selecione o médico..."}
                  </span>
                  <span className="text-slate-400 text-xs">{isDoctorDropdownOpen ? '▲' : '▼'}</span>
                </div>

                {isDoctorDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="p-2 border-b border-slate-100 bg-slate-50">
                      <input 
                        type="text"
                        autoFocus
                        placeholder="Pesquisar por nome ou especialidade..."
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                        value={doctorSearchTerm}
                        onChange={(e) => setDoctorSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doc => (
                          <div 
                            key={doc.id}
                            className={`p-3 text-sm cursor-pointer hover:bg-purple-50 flex flex-col ${formData.doctorId === doc.id ? 'bg-purple-100' : ''}`}
                            onClick={() => {
                              setFormData({...formData, doctorId: doc.id});
                              setIsDoctorDropdownOpen(false);
                              setDoctorSearchTerm('');
                            }}
                          >
                            <span className="font-bold text-slate-800">{doc.name}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-bold">{doc.specialty} • CRM {doc.crm}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 italic">
                          Nenhum médico encontrado.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Título do Documento</label>
              <input required placeholder="Ex: Laudo de Ressonância Magnética, Evolução Clínica..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            {/* Seção de Exame Integrada */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-3 bg-purple-400 rounded-full"></span>
                Dados do Exame (Opcional)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Nome do Exame</label>
                  <input placeholder="Ex: Glicemia" className="w-full p-2 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-purple-500" 
                    value={formData.examName} onChange={e => setFormData({...formData, examName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Data do Exame</label>
                  <input type="date" className="w-full p-2 bg-white border border-slate-200 rounded text-xs outline-none" 
                    value={formData.examDate} onChange={e => setFormData({...formData, examDate: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Resultado / Valor</label>
                  <input placeholder="Ex: 95 mg/dL" className="w-full p-2 bg-white border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-purple-500" 
                    value={formData.examResult} onChange={e => setFormData({...formData, examResult: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Laudo Clínico / Observações</label>
                <button 
                  type="button"
                  onClick={handleGenerateSummary}
                  disabled={loadingSummary || !formData.patientId}
                  className="text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  {loadingSummary ? (
                    <>
                      <div className="w-2.5 h-2.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      Analisando histórico...
                    </>
                  ) : (
                    <>🤖 Gerar resumo do histórico</>
                  )}
                </button>
              </div>
              <textarea required rows={5} placeholder="Descreva detalhadamente as conclusões médicas..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" 
                value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              <p className="text-[9px] text-slate-400 mt-1 italic">
                * O botão acima usa IA para resumir as condições prévias do paciente cadastradas no histórico.
              </p>
            </div>

            <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-purple-700 transition-all transform active:scale-[0.99]">
              Gravar no Prontuário Eletrônico
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-400">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-24">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-1/4">Paciente</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Documento / Exame</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest w-1/4">Médico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {reports.map(r => (
                <tr key={r.id} className="hover:bg-purple-50/30 transition-colors cursor-default">
                  <td className="px-6 py-4">
                    <div className="font-mono text-xs text-slate-400">{r.date.split('-').reverse().join('/')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{getPatientName(r.patientId).toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-700">{r.title}</div>
                    {r.examName && (
                      <div className="mt-1 flex gap-2 items-center">
                        <span className="px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded text-[9px] font-black uppercase">Exame</span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {r.examName}: <span className="text-purple-700 font-bold">{r.examResult}</span>
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-500 italic flex items-center gap-1">
                      <span className="text-xs">🩺</span> {getDoctorName(r.doctorId)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="py-20 text-center text-slate-400 italic">
              Nenhum documento clínico registrado.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportManager;
