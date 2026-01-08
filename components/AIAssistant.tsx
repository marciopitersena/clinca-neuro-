
import React, { useState } from 'react';
import { getDiagnosticSuggestions, generatePrescriptionDraft } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'diagnosis' | 'prescription'>('diagnosis');
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResult('');
    
    if (activeMode === 'diagnosis') {
      const suggestions = await getDiagnosticSuggestions(input);
      setResult(suggestions || 'Não foi possível obter sugestões.');
    } else {
      const draft = await generatePrescriptionDraft(input);
      setResult(draft || 'Não foi possível gerar o rascunho.');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
          <span className="p-2 bg-indigo-100 rounded-xl">🤖</span>
          Assistente Médico Gemini
        </h2>
        <p className="text-slate-500 mt-2">Suporte à decisão clínica e automação de tarefas</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        <div className="w-full md:w-1/3 bg-slate-50 p-6 border-r border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider">Ferramentas</h3>
          <button
            onClick={() => { setActiveMode('diagnosis'); setResult(''); setInput(''); }}
            className={`w-full flex flex-col items-start p-4 rounded-2xl transition-all ${
              activeMode === 'diagnosis' ? 'bg-white shadow-md border-indigo-200 border-2' : 'hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl mb-2">🔍</span>
            <span className="font-bold text-slate-800">Apoio Diagnóstico</span>
            <span className="text-xs text-slate-500 mt-1">Análise de sintomas e exames</span>
          </button>
          
          <button
            onClick={() => { setActiveMode('prescription'); setResult(''); setInput(''); }}
            className={`w-full flex flex-col items-start p-4 rounded-2xl transition-all ${
              activeMode === 'prescription' ? 'bg-white shadow-md border-indigo-200 border-2' : 'hover:bg-slate-100'
            }`}
          >
            <span className="text-2xl mb-2">📝</span>
            <span className="font-bold text-slate-800">Gerador de Receita</span>
            <span className="text-xs text-slate-500 mt-1">Rascunhos rápidos e precisos</span>
          </button>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="space-y-4">
              <label className="block font-bold text-slate-800">
                {activeMode === 'diagnosis' ? 'Descreva os sintomas:' : 'Qual o diagnóstico/condição?'}
              </label>
              <textarea
                className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none min-h-[120px]"
                placeholder={activeMode === 'diagnosis' ? 'Ex: Paciente com febre alta há 3 dias, tosse seca e dor retro-orbital...' : 'Ex: Amigdalite bacteriana aguda'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !input}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processando com Gemini...
                  </>
                ) : (
                  'Gerar Insights'
                )}
              </button>
            </div>

            {result && (
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 relative">
                <div className="absolute top-4 right-4 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  Resultado AI
                </div>
                <div className="prose prose-indigo max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-indigo-900 text-sm leading-relaxed">
                    {result}
                  </pre>
                </div>
              </div>
            )}
          </div>
          
          <p className="text-[10px] text-slate-400 mt-6 text-center italic">
            Aviso: O ClinicaPro AI utiliza inteligência artificial para auxiliar, mas o julgamento final é sempre responsabilidade do profissional médico.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
