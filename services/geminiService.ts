
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FullAnalysis, AnalysisResult, GroundingChunk } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function cleanJsonString(text: string): string {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1].trim();
    }
    return text.trim();
}

export const getStockAnalysis = async (stockSymbol: string): Promise<FullAnalysis> => {
    if (!stockSymbol) {
        throw new Error("Stock symbol cannot be empty.");
    }

    const prompt = `
        You are an expert financial analyst. Conduct deep research on the stock with the symbol "${stockSymbol.toUpperCase()}" using real-time internet data.
        Provide a concise, data-driven investment analysis based on the latest news, financial performance, and market trends. 
        Your response MUST be in a valid JSON format.
        
        The JSON object should have the following structure:
        {
          "symbol": "${stockSymbol.toUpperCase()}",
          "suggestion": "A clear, brief suggestion like 'Strong Buy', 'Hold', 'Consider Selling', or 'High Risk'",
          "rationale": [
            "A bullet point explaining the first key reason.",
            "A bullet point for the second reason.",
            "Another important rationale point."
          ]
        }

        Do not include any text, greetings, or explanations outside of the JSON object.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const rawText = response.text;
        const cleanedText = cleanJsonString(rawText);

        let parsedAnalysis: AnalysisResult;
        try {
             parsedAnalysis = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse JSON response from Gemini:", cleanedText);
            throw new Error("The AI returned a response in an unexpected format. Please try again.");
        }
       
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];

        return {
            analysis: parsedAnalysis,
            sources: sources.filter(source => source.web && source.web.uri),
        };

    } catch (error) {
        console.error("Error fetching stock analysis from Gemini API:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to get stock analysis: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching stock analysis.");
    }
};
