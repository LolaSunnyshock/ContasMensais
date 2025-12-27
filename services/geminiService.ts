import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for parsing a new transaction from natural text
const transactionSchema = {
  type: Type.OBJECT,
  properties: {
    description: { type: Type.STRING, description: "The short description of the expense or income." },
    amount: { type: Type.NUMBER, description: "The monetary value." },
    category: { type: Type.STRING, description: "A category like Casa, Alimentação, Lazer, Transporte, etc." },
    type: { type: Type.STRING, enum: ["FIXED", "VARIABLE", "INCOME"], description: "Whether it is a fixed expense, variable expense, or income." },
    paymentMethod: { type: Type.STRING, description: "Method like Pix, Cartão de Crédito, Boleto, etc." }
  },
  required: ["description", "amount", "category", "type"]
};

export const parseTransactionWithAI = async (text: string): Promise<any> => {
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract transaction details from this text: "${text}". If information is missing, infer reasonable defaults based on context.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: transactionSchema
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error parsing transaction:", error);
    return null;
  }
};

export const getFinancialAdvice = async (transactions: Transaction[], monthName: string): Promise<string> => {
  if (!apiKey) return "Configure sua API Key para receber insights inteligentes.";

  const prompt = `
    Analyze the following financial data for the month of ${monthName}.
    Provide a concise summary in Portuguese (Markdown format).
    Highlight:
    1. Top spending category.
    2. Suggestion for saving.
    3. A brief motivational comment.
    
    Data: ${JSON.stringify(transactions.map(t => ({ d: t.description, a: t.amount, c: t.category, t: t.type })))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar análise no momento.";
  } catch (error) {
    console.error("Error getting advice:", error);
    return "Erro ao conectar com a IA.";
  }
};