
import { GoogleGenAI, Type } from "@google/genai";

export async function askAITutor(question: string, ageGroup: 'child' | 'adult') {
  // Fix: Create the GoogleGenAI instance right before the API call to ensure it uses the latest process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = ageGroup === 'child' 
    ? "Você é o 'Neo', um robô amigável e futurista que explica conceitos de IA para crianças de 7 a 10 anos. Use analogias simples (como LEGO, super-poderes ou culinária). Seja entusiasta e curto nas respostas."
    : "Você é o 'Neo', um consultor especialista em tecnologia. Explique conceitos de IA para adultos leigos de forma clara, profissional, mas acessível, evitando jargões técnicos excessivos.";

  try {
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Fix: Access response.text directly as a property (not a method) as per @google/genai guidelines
    return response.text || "Desculpe, meu processador falhou. Pode perguntar de novo?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Ops! Tive um problema de conexão com a Matrix. Tente novamente!";
  }
}
