
import React, { useState, useEffect } from 'react';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS, MOCK_DOCTORS } from '../constants';
import { Appointment } from '../types';

const CalendarManager: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<Partial<Appointment>>({
    date: selectedDate,
    time: '08:00',
    doctorName: 'Dr. Daniel Souza',
    type: 'Consulta'
  });

  // Gera slots de 30 em 30 minutos das 08:00 as 18:00
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const min = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${min}`;
  });

  const handleDateChange = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedAppId) {
      setAppointments(appointments.map(a => a.id === selectedAppId ? { ...a, ...formData } as Appointment : a));
    } else {
      const newApp: Appointment = {
        ...formData as Appointment,
        id: Math.random().toString(36).substr(2, 9),
        status: 'Agendado'
      };
      setAppointments([...appointments, newApp]);
    }
    setIsFormOpen(false);
    setIsEditing(false);
    setSelectedAppId(null);
  };

  const handleEdit = () => {
    const app = appointments.find(a => a.id === selectedAppId);
    if (app) {
      setFormData(app);
      setIsEditing(true);
      setIsFormOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedAppId && confirm("Deseja realmente excluir este agendamento?")) {
      setAppointments(appointments.filter(a => a.id !== selectedAppId));
      setSelectedAppId(null);
    }
  };

  const getAppointmentForSlot = (time: string) => {
    return appointments.find(a => a.time === time && a.date === selectedDate);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] border border-slate-400 font-sans text-xs select-none">
      
      {/* Top Header Label */}
      <div className="bg-[#a5c3eb] p-1 text-center border-b border-slate-400 font-bold text-slate-800 text-[10px]">
        Cardio - Agenda Médica [Dr. Daniel Souza / Cardiologia]
      </div>

      {/* Ribbon / Toolbar */}
      <div className="bg-gradient-to-b from-[#e3eefc] to-[#cbdff7] p-1 flex items-center border-b border-slate-400 gap-0.5">
        <div className="flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded" onClick={() => handleDateChange(-1)}>
          <span className="text-xl">⬅️</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Anterior</span>
        </div>
        <div className="flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded" onClick={() => handleDateChange(1)}>
          <span className="text-xl">➡️</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Próximo</span>
        </div>
        <div className="w-[1px] h-10 bg-slate-400 mx-1"></div>
        <div className="flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
          <span className="text-xl">📅</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Hoje</span>
        </div>
        <div className="w-[1px] h-10 bg-slate-400 mx-1"></div>
        <div 
          className="flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded"
          onClick={() => { setIsFormOpen(true); setIsEditing(false); setFormData({ ...formData, date: selectedDate }); }}
        >
          <span className="text-xl">➕</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Marcar</span>
        </div>
        <div 
          className={`flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded ${!selectedAppId ? 'opacity-50' : ''}`}
          onClick={handleEdit}
        >
          <span className="text-xl">✏️</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Alterar</span>
        </div>
        <div 
          className={`flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded ${!selectedAppId ? 'opacity-50' : ''}`}
          onClick={handleDelete}
        >
          <span className="text-xl">🗑️</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Desmarcar</span>
        </div>
        <div className="w-[1px] h-10 bg-slate-400 mx-1"></div>
        <div className="flex flex-col items-center px-3 py-1 hover:bg-white/50 cursor-pointer border border-transparent hover:border-slate-300 rounded">
          <span className="text-xl">🖨️</span>
          <span className="text-[9px] font-bold text-blue-900 uppercase">Imprimir</span>
        </div>
        <div className="flex-1"></div>
        <div className="flex flex-col items-center px-4 py-1 hover:bg-red-500 hover:text-white cursor-pointer rounded transition-colors group">
          <span className="text-xl">🚪</span>
          <span className="text-[9px] font-bold text-blue-900 group-hover:text-white uppercase">Sair</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Agenda Grid */}
        <div className="flex-1 overflow-y-auto bg-white border-r border-slate-300">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#e0eaf7] shadow-sm">
              <tr className="text-[#3b5998] font-bold">
                <th className="border border-slate-300 p-1 w-12">Hora</th>
                <th className="border border-slate-300 p-1 text-left">Paciente</th>
                <th className="border border-slate-300 p-1 w-32">Telefone</th>
                <th className="border border-slate-300 p-1 w-24">Categoria</th>
                <th className="border border-slate-300 p-1 w-16">Tipo</th>
                <th className="border border-slate-300 p-1 w-8">F</th>
                <th className="border border-slate-300 p-1 w-12">Chegou</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => {
                const app = getAppointmentForSlot(time);
                const isSelected = app?.id === selectedAppId;
                
                return (
                  <tr 
                    key={time} 
                    onClick={() => app && setSelectedAppId(app.id)}
                    className={`h-8 group cursor-pointer border-b border-slate-200 ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-50'}`}
                  >
                    <td className={`border-r border-slate-200 text-center font-bold ${isSelected ? 'text-white' : 'text-slate-600 bg-slate-50'}`}>
                      {time}
                    </td>
                    <td className="px-2 font-medium">
                      {app ? (
                        <div className="flex flex-col">
                          <span className="uppercase font-bold">{app.patientName}</span>
                          {app.type === 'Exame' && <span className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>AVISO: Jejum de 6 horas</span>}
                        </div>
                      ) : (
                        <span className="text-slate-200 text-[10px] italic">--- DISPONÍVEL ---</span>
                      )}
                    </td>
                    <td className="px-2 text-center text-blue-700 font-mono text-[10px]">{app?.phone}</td>
                    <td className="px-2 text-center text-purple-700 font-bold">{app ? 'Unimed' : ''}</td>
                    <td className="px-2 text-center font-bold text-slate-500">{app?.type === 'Consulta' ? 'C' : app?.type === 'Exame' ? 'EX' : ''}</td>
                    <td className="px-2 text-center">{app ? 'S' : ''}</td>
                    <td className="px-2 text-center text-emerald-600 font-bold">{app ? '10:05' : ''}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Sidebar Rights */}
        <div className="w-64 bg-[#f8f9fb] p-2 flex flex-col gap-4 border-l border-slate-300 shadow-inner">
          
          {/* Mini Calendar 1 */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-[#e0eaf7] p-1 text-center font-bold text-blue-900 text-[9px] uppercase border-b border-slate-300">
              Julho, 2024
            </div>
            <div className="p-1 grid grid-cols-7 gap-1 text-center font-bold text-[9px]">
               <span className="text-red-500">D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
               {Array.from({length: 31}, (_, i) => (
                 <span key={i} className={`p-1 rounded cursor-pointer ${i+1 === parseInt(selectedDate.split('-')[2]) ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}>
                   {i + 1}
                 </span>
               ))}
            </div>
          </div>

          {/* Mini Calendar 2 */}
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="bg-[#e0eaf7] p-1 text-center font-bold text-blue-900 text-[9px] uppercase border-b border-slate-300">
              Agosto, 2024
            </div>
            <div className="p-1 grid grid-cols-7 gap-1 text-center font-bold text-[9px]">
               <span className="text-red-500">D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
               {Array.from({length: 31}, (_, i) => (
                 <span key={i} className="p-1 hover:bg-blue-100 rounded cursor-pointer">{i + 1}</span>
               ))}
            </div>
          </div>

          {/* Waitlist Section */}
          <div className="bg-white border border-slate-300 rounded flex-1 flex flex-col shadow-sm">
            <div className="bg-[#e0eaf7] p-1 flex justify-between items-center px-2 border-b border-slate-300">
              <span className="font-bold text-blue-900 text-[9px] uppercase">Lista de Espera</span>
              <button className="text-[8px] font-bold text-blue-700">VER TODAS</button>
            </div>
            <div className="flex-1 p-2 flex items-center justify-center text-slate-300 italic text-[10px]">
              Vazia
            </div>
          </div>

          {/* Stats / Free Slots */}
          <div className="bg-[#fff9e6] border border-orange-200 p-2 rounded text-[9px] space-y-1">
             <div className="font-bold text-orange-800 uppercase flex justify-between">
                <span>Horários Livres</span>
                <span className="bg-orange-500 text-white px-1 rounded">20</span>
             </div>
             <p className="text-orange-700 leading-tight">08:00, 08:30, 09:00, 11:30, 12:00, 15:30, 16:30...</p>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#f0f0f0] border-t border-slate-400 p-1 px-4 flex justify-between text-[10px] font-bold text-slate-600">
        <div className="flex gap-4">
          <span>📅 {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          <span className="text-blue-700">MÉDICO: DR. DANIEL SOUZA (CARDIOLOGIA)</span>
        </div>
        <div className="flex gap-4 italic">
          <span className="text-red-600">SEM ENCAIXES NO MOMENTO</span>
          <span>VERSÃO: 3.2.1-WEB</span>
        </div>
      </div>

      {/* Scheduling Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-[#f0f0f0] border-2 border-slate-500 w-[400px] shadow-2xl p-4 rounded-lg animate-in zoom-in-95">
            <div className="bg-[#3b5998] text-white p-2 -m-4 mb-4 rounded-t flex justify-between items-center font-bold uppercase text-[10px]">
              <span>{isEditing ? 'Alterar Agendamento' : 'Novo Agendamento'}</span>
              <button onClick={() => setIsFormOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-blue-800 uppercase">Paciente:</label>
                <select 
                  className="w-full border border-slate-300 rounded p-1.5 text-xs font-bold outline-none"
                  onChange={(e) => {
                    const p = MOCK_PATIENTS.find(p => p.id === e.target.value);
                    if (p) setFormData({ ...formData, patientId: p.id, patientName: p.name, phone: p.phone });
                  }}
                  value={formData.patientId || ''}
                  required
                >
                  <option value="">-- SELECIONE O PACIENTE --</option>
                  {MOCK_PATIENTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-800 uppercase">Data:</label>
                  <input type="date" className="w-full border border-slate-300 rounded p-1.5 text-xs outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-blue-800 uppercase">Hora:</label>
                  <select className="w-full border border-slate-300 rounded p-1.5 text-xs outline-none font-bold" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})}>
                    {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-blue-800 uppercase">Tipo:</label>
                <select className="w-full border border-slate-300 rounded p-1.5 text-xs outline-none" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                  <option value="Consulta">Consulta</option>
                  <option value="Retorno">Retorno</option>
                  <option value="Exame">Exame (Requer Jejum)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 bg-blue-700 text-white font-bold py-2 rounded text-[10px] uppercase shadow-md hover:bg-blue-800">
                  {isEditing ? 'Atualizar' : 'Gravar'}
                </button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-slate-300 text-slate-700 font-bold py-2 rounded text-[10px] uppercase hover:bg-slate-400">
                  Sair
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarManager;
