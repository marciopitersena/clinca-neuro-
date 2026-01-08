
import React, { useState, useMemo } from 'react';
import { MOCK_PATIENTS, MOCK_INSURANCES } from '../constants';
import { Patient } from '../types';

const BLANK_PATIENT: Patient = {
  id: '',
  name: '',
  socialName: '',
  email: '',
  phone: '',
  birthDate: '',
  sex: 'F',
  color: 'Branca',
  maritalStatus: 'Solteiro(a)',
  birthPlace: '',
  address: '',
  city: '',
  state: '',
  cep: '',
  profession: '',
  cpf: '',
  rg: '',
  fatherName: '',
  motherName: '',
  spouseName: '',
  indication: '',
  insuranceId: 'i1',
  medicalHistory: []
};

const PatientManager: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(BLANK_PATIENT);
  const [isEditing, setIsEditing] = useState(true);
  const [isInserting, setIsInserting] = useState(true);
  
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 0;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSelect = (id: string) => {
    if (!id) {
      handleInsert();
      return;
    }
    const p = patients.find(p => p.id === id);
    if (p) {
      setSelectedPatient(p);
      setIsEditing(true); 
      setIsInserting(false);
      setIsSearchModalOpen(false);
      setSearchTerm('');
    }
  };

  const handleFieldChange = (field: keyof Patient, value: any) => {
    setSelectedPatient(prev => ({ ...prev, [field]: value }));
  };

  const handleInsert = () => {
    setSelectedPatient({ ...BLANK_PATIENT, id: 'TEMP_' + Date.now() });
    setIsInserting(true);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedPatient.name) {
      alert("Por favor, insira ao menos o nome do paciente.");
      return;
    }

    if (isInserting) {
      const newId = String(patients.length + 1);
      const newPatient = { ...selectedPatient, id: newId };
      setPatients([...patients, newPatient]);
      setSelectedPatient(newPatient);
      setIsInserting(false);
    } else {
      setPatients(patients.map(p => p.id === selectedPatient.id ? selectedPatient : p));
    }
    setIsEditing(true);
    alert("Dados gravados com sucesso!");
  };

  const handleDelete = () => {
    if (isInserting || !selectedPatient.id || selectedPatient.id.includes('TEMP')) {
      alert("Não é possível apagar um registro que ainda não foi salvo.");
      return;
    }

    const confirmDelete = window.confirm("Tem certeza que quer apagar o paciente?");
    if (confirmDelete) {
      const updatedPatients = patients.filter(p => p.id !== selectedPatient.id);
      setPatients(updatedPatients);
      setSelectedPatient(BLANK_PATIENT);
      setIsInserting(true);
      setIsEditing(true);
      alert("Paciente excluído com sucesso!");
    }
  };

  const handleCancel = () => {
    if (isInserting) {
      if (patients.length > 0) {
        handleSelect(patients[0].id);
      } else {
        setSelectedPatient(BLANK_PATIENT);
      }
    } else {
      const original = patients.find(p => p.id === selectedPatient.id);
      if (original) setSelectedPatient(original);
      setIsEditing(false);
    }
  };

  const currentIndex = useMemo(() => {
    return patients.findIndex(p => p.id === selectedPatient.id);
  }, [patients, selectedPatient.id]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (patients.length === 0) return;
    let nextIdx = 0;
    if (direction === 'prev') {
      nextIdx = currentIndex > 0 ? currentIndex - 1 : 0;
    } else {
      nextIdx = currentIndex < patients.length - 1 ? currentIndex + 1 : patients.length - 1;
    }
    handleSelect(patients[nextIdx].id);
  };

  const filteredSearch = useMemo(() => {
    return patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [patients, searchTerm]);

  const InputField = ({ label, field, className = "", type = "text", placeholder = "" }: { label: string, field: keyof Patient, className?: string, type?: string, placeholder?: string }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={selectedPatient[field] as string || ''}
        readOnly={!isEditing}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        className={`w-full px-3 py-2 text-sm rounded-xl border transition-all outline-none ${
          !isEditing 
          ? 'bg-slate-50 border-slate-100 text-slate-600' 
          : 'bg-white border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 shadow-sm'
        }`}
      />
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Cabeçalho de Ações Principal */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleInsert}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
          >
            <span className="text-xl text-indigo-500">📄</span> Insere
          </button>
          
          <button 
            onClick={handleSave} 
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95"
          >
            <span className="text-xl">💾</span> Grava
          </button>

          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              !isEditing ? 'text-slate-600 hover:bg-slate-50' : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}
          >
            <span className="text-xl">✏️</span> Altera
          </button>

          <button 
            onClick={handleCancel}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
          >
            <span className="text-xl">🔙</span> Cancela
          </button>

          <button 
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-slate-600 hover:bg-slate-50 font-bold text-sm transition-all"
          >
            <span className="text-xl text-blue-500">🔍</span> Procura
          </button>

          <div className="w-px h-8 bg-slate-100 mx-2"></div>

          <button 
            onClick={handleDelete}
            disabled={isInserting || !selectedPatient.id || selectedPatient.id.includes('TEMP')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-sm transition-all ${
              isInserting || !selectedPatient.id || selectedPatient.id.includes('TEMP') 
              ? 'opacity-30 grayscale cursor-not-allowed' 
              : 'text-red-500 hover:bg-red-50'
            }`}
          >
            <span className="text-xl">❌</span> Apaga
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${
            isInserting ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
            isEditing ? 'bg-amber-50 text-amber-600 border-amber-100' : 
            'bg-indigo-50 text-indigo-600 border-indigo-100'
          }`}>
            {isInserting ? 'Novo Registro' : isEditing ? 'Editando Ficha' : 'Visualizando'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Painel Lateral: Foto e Dados Básicos */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4">
            <div className="w-full aspect-[3/4] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden relative group">
               <img 
                 src={isInserting || !selectedPatient.id || selectedPatient.id.includes('TEMP') 
                   ? 'https://via.placeholder.com/300x400?text=FOTO+PACIENTE' 
                   : `https://picsum.photos/seed/${selectedPatient.id}/300/400`} 
                 alt="Paciente" 
                 className="w-full h-full object-cover transition-transform group-hover:scale-105" 
               />
               {isEditing && (
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <span className="text-white font-bold text-xs uppercase">Alterar Foto</span>
                 </div>
               )}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-800 uppercase text-sm leading-tight truncate w-full px-2">
                {selectedPatient.name || 'Novo Paciente'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">ID: {selectedPatient.id || '---'}</p>
            </div>
            <div className="w-full pt-4 border-t border-slate-50 space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Idade:</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">
                    {calculateAge(selectedPatient.birthDate)} anos
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Gênero:</span>
                  <span className="text-xs font-bold text-slate-700">{selectedPatient.sex === 'F' ? 'Feminino' : 'Masculino'}</span>
               </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💳</span>
                <span className="text-xs font-black uppercase tracking-widest opacity-80">Financeiro</span>
             </div>
             <div>
                <p className="text-[10px] uppercase font-bold opacity-60">Status de Pagamento</p>
                <p className="text-lg font-black">R$ 0,00 <span className="text-xs font-normal opacity-70">em aberto</span></p>
             </div>
             <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all">
                Ver Extrato Completo
             </button>
          </div>
        </div>

        {/* Formulário Principal */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Card: Dados Pessoais */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
               <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
               <h4 className="font-black text-slate-800 uppercase tracking-tight">Informações Pessoais</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <InputField label="Nome Completo" field="name" className="md:col-span-8" placeholder="Ex: Maria da Silva" />
              <InputField label="Data de Nascimento" field="birthDate" type="date" className="md:col-span-4" />
              
              <InputField label="Nome Social" field="socialName" className="md:col-span-5" />
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sexo</label>
                <select 
                  disabled={!isEditing}
                  value={selectedPatient.sex}
                  onChange={(e) => handleFieldChange('sex', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500 disabled:bg-slate-50"
                >
                  <option value="F">Feminino</option>
                  <option value="M">Masculino</option>
                </select>
              </div>
              <InputField label="Cor / Etnia" field="color" className="md:col-span-4" />

              <InputField label="CPF" field="cpf" className="md:col-span-4" placeholder="000.000.000-00" />
              <InputField label="R.G." field="rg" className="md:col-span-4" />
              <InputField label="Estado Civil" field="maritalStatus" className="md:col-span-4" />
            </div>
          </div>

          {/* Card: Contato e Endereço */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
               <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
               <h4 className="font-black text-slate-800 uppercase tracking-tight">Contato e Localização</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <InputField label="E-mail Principal" field="email" className="md:col-span-7" placeholder="paciente@exemplo.com" />
              <InputField label="Telefone / WhatsApp" field="phone" className="md:col-span-5" placeholder="(00) 00000-0000" />
              
              <InputField label="Endereço Residencial" field="address" className="md:col-span-9" />
              <InputField label="CEP" field="cep" className="md:col-span-3" />

              <InputField label="Cidade" field="city" className="md:col-span-6" />
              <InputField label="Estado (UF)" field="state" className="md:col-span-2" />
              <InputField label="Profissão" field="profession" className="md:col-span-4" />
            </div>
          </div>

          {/* Card: Convênio */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-50">
               <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
               <h4 className="font-black text-slate-800 uppercase tracking-tight">Plano de Saúde</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Operadora</label>
                <select 
                  disabled={!isEditing}
                  value={selectedPatient.insuranceId}
                  onChange={(e) => handleFieldChange('insuranceId', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-indigo-500 disabled:bg-slate-50 font-bold uppercase"
                >
                  {MOCK_INSURANCES.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <InputField label="Matrícula do Convênio" field="id" className="md:col-span-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé de Navegação */}
      <div className="fixed bottom-6 left-72 right-12 z-40 flex justify-center">
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-2 rounded-2xl shadow-2xl flex items-center gap-4">
           <button 
            disabled={currentIndex <= 0}
            onClick={() => handleNavigate('prev')}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20"
           >
            ◀
           </button>
           
           <div className="px-6 border-x border-slate-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">Navegação</span>
              <span className="text-xs font-bold text-slate-700">
                {currentIndex + 1} de {patients.length} pacientes
              </span>
           </div>

           <button 
            disabled={currentIndex >= patients.length - 1 || patients.length === 0}
            onClick={() => handleNavigate('next')}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-20"
           >
            ▶
           </button>
        </div>
      </div>

      {/* Modal de Busca Moderno */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-start justify-center pt-24 p-4">
          <div className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-top-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center gap-4">
               <span className="text-2xl opacity-40">🔍</span>
               <input 
                type="text" 
                placeholder="Pesquisar paciente por nome..." 
                autoFocus
                className="flex-1 bg-transparent text-lg outline-none font-medium placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={() => setIsSearchModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">ESC</button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredSearch.length > 0 ? (
                <div className="p-2">
                  {filteredSearch.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleSelect(p.id)}
                      className="p-4 rounded-2xl hover:bg-indigo-50 cursor-pointer flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                            <img src={`https://picsum.photos/seed/${p.id}/100`} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <p className="font-bold text-slate-800 uppercase text-sm group-hover:text-indigo-600 transition-colors">{p.name}</p>
                            <p className="text-xs text-slate-400 font-medium italic">CPF: {p.cpf}</p>
                         </div>
                      </div>
                      <span className="text-indigo-200 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all font-bold text-xs uppercase">Abrir Ficha →</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <span className="text-4xl grayscale">😶</span>
                  <p className="text-slate-400 italic text-sm">Nenhum paciente encontrado com "{searchTerm}"</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-50 flex justify-between items-center px-8">
               <p className="text-[10px] font-bold text-slate-400 uppercase">DICA: Selecione um paciente para carregar os dados</p>
               <button 
                onClick={() => setIsSearchModalOpen(false)}
                className="px-6 py-2 bg-white border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientManager;
