
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMedicalSummary = async (patientName: string, history: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Resuma o histórico médico do paciente ${patientName}. Histórico: ${history.join(', ')}. Seja breve e profissional.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar resumo médico:", error);
    return "Não foi possível gerar o resumo automático.";
  }
};

export const getDiagnosticSuggestions = async (symptoms: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Como assistente de apoio à decisão médica, analise os seguintes sintomas: "${symptoms}". Forneça 3 possíveis causas diagnósticas e recomendações de exames. IMPORTANTE: Adicione um aviso de que isso não substitui o julgamento clínico. Responda em Português do Brasil.`,
      config: {
        temperature: 0.4,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro na assistência diagnóstica:", error);
    return "Erro ao processar sintomas.";
  }
};

export const generatePrescriptionDraft = async (diagnosis: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um rascunho de prescrição médica formatado para o diagnóstico: ${diagnosis}. Inclua dosagem e orientações básicas de uso.`,
      config: {
        temperature: 0.5,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar prescrição:", error);
    return "Erro ao gerar rascunho.";
  }
};
