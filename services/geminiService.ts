import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AnyFullAnalysis, AnalysisResult, GroundingChunk, YoutubeAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function cleanJsonString(text: string): string {
    const match = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
        return match[1].trim();
    }
    return text.trim();
}

export const getAssetAnalysis = async (
    assetType: 'stock' | 'commodity' | 'index' | 'youtube', 
    assetName: string, 
    marketOrTopic: string,
    membersOnlyContent?: string
): Promise<AnyFullAnalysis> => {
    if (!assetName) {
        throw new Error("Asset name or symbol cannot be empty.");
    }

    const assetIdentifier = assetName.toUpperCase();
    let prompt = '';

    if (assetType === 'stock') {
        const marketInfo = marketOrTopic.trim() ? ` trading on the "${marketOrTopic.toUpperCase()}" exchange/market` : '';
        prompt = `
            You are an expert financial analyst. Conduct deep research on the stock with the symbol "${assetIdentifier}"${marketInfo} using real-time internet data.
            Provide a concise, data-driven investment analysis. Your analysis must include both fundamental rationale and a technical analysis of recent chart patterns.
            Your response MUST be in a valid JSON format.
            
            The JSON object should have the following structure:
            {
              "symbol": "${assetIdentifier}",
              "suggestion": "A clear, brief suggestion like 'Strong Buy', 'Hold', 'Consider Selling', or 'High Risk'",
              "rationale": [
                "A bullet point explaining the first key reason based on fundamentals.",
                "A bullet point for the second fundamental reason.",
                "Another important fundamental rationale point."
              ],
              "technicalAnalysis": {
                "summary": "A brief summary of the overall technical outlook based on chart patterns and indicators.",
                "patterns": [
                  {
                    "name": "Identified Pattern (e.g., 'Head and Shoulders', 'Golden Cross')",
                    "description": "A short explanation of what this pattern indicates for the stock."
                  }
                ]
              }
            }

            Do not include any text, greetings, or explanations outside of the JSON object.
        `;
    } else if (assetType === 'commodity') {
        prompt = `
            You are an expert financial analyst. Conduct deep research on the commodity "${assetIdentifier}" using real-time internet data.
            Provide a concise, data-driven investment analysis based on the latest news, supply/demand, macroeconomic trends, and technical chart patterns.
            Your response MUST be in a valid JSON format.
            
            The JSON object should have the following structure:
            {
              "symbol": "${assetIdentifier}",
              "suggestion": "A clear, brief suggestion like 'Bullish', 'Bearish', 'Neutral', or 'Volatile'",
              "rationale": [
                "A bullet point explaining the first key reason based on macro trends.",
                "A bullet point for the second reason.",
                "Another important rationale point."
              ],
              "technicalAnalysis": {
                "summary": "A brief summary of the overall technical outlook based on chart patterns and indicators.",
                "patterns": [
                  {
                    "name": "Identified Pattern (e.g., 'Double Bottom', 'Flag')",
                    "description": "A short explanation of what this pattern indicates for the commodity."
                  }
                ]
              }
            }

            Do not include any text, greetings, or explanations outside of the JSON object.
        `;
    } else if (assetType === 'index') {
        prompt = `
            You are an expert financial analyst. Conduct deep research on the market index "${assetIdentifier}" using real-time internet data.
            Provide a concise, data-driven investment analysis based on its recent performance, overall market sentiment, key driving sectors, and macroeconomic factors.
            Your analysis must include both a fundamental rationale (based on market/economic factors) and a technical analysis of recent chart patterns.
            Your response MUST be in a valid JSON format.
            
            The JSON object should have the following structure:
            {
              "symbol": "${assetIdentifier}",
              "suggestion": "A clear, brief suggestion for the index's outlook like 'Bullish Outlook', 'Bearish Outlook', 'Neutral', or 'Consolidating'",
              "rationale": [
                "A bullet point explaining the first key reason based on market or economic factors.",
                "A bullet point for the second key reason.",
                "Another important rationale point."
              ],
              "technicalAnalysis": {
                "summary": "A brief summary of the overall technical outlook based on the index's chart patterns and indicators.",
                "patterns": [
                  {
                    "name": "Identified Pattern (e.g., 'Ascending Triangle', 'Death Cross')",
                    "description": "A short explanation of what this pattern indicates for the index."
                  }
                ]
              }
            }

            Do not include any text, greetings, or explanations outside of the JSON object.
        `;
    } else if (assetType === 'youtube') {
         const topicInfo = marketOrTopic.trim() ? ` focusing on their views on "${marketOrTopic}"` : '';
         const membersContentInfo = membersOnlyContent?.trim()
            ? `\n\nAdditionally, consider the following user-provided text from a members-only content for a more complete analysis:\n---START OF MEMBERS-ONLY CONTENT---\n${membersOnlyContent.trim()}\n---END OF MEMBERS-ONLY CONTENT---`
            : '';

         prompt = `
            You are an expert financial and media analyst. Using real-time internet data, research the YouTube channel with the handle "${assetName}"${topicInfo}.
            Analyze the creator's videos and content published within the last one year to provide a summary of their financial perspective.${membersContentInfo}
            Your response MUST be in a valid JSON format.

            The JSON object should have the following structure:
            {
                "channelName": "The creator's channel name",
                "overallStance": "A summary of the creator's general market sentiment (e.g., 'Bullish on Tech', 'Cautious Bear', 'Data-Driven Neutral')",
                "keyThemes": [
                    "A key theme or recurring topic the creator focuses on, considering content from the last year.",
                    "Another prominent viewpoint or analytical focus from the last year.",
                    "A third major theme from their recent content."
                ],
                "recentVideosSummary": [
                    {
                        "title": "Title of a recent relevant video from the last year",
                        "summary": "A brief summary of the video's main points and the creator's conclusion."
                    },
                    {
                        "title": "Title of another recent relevant video from the last year",
                        "summary": "Summary of this video's content and viewpoint."
                    }
                ]
            }

            Do not include any text, greetings, or explanations outside of the JSON object.
         `;
    }


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

        let parsedAnalysis: AnalysisResult | YoutubeAnalysis;
        try {
             parsedAnalysis = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse JSON response from Gemini:", cleanedText);
            throw new Error("The AI returned a response in an unexpected format. Please try again.");
        }
       
        const sources: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        const filteredSources = sources.filter(source => source.web && source.web.uri);

        // Fix: Explicitly cast the analysis object based on assetType to satisfy the AnyFullAnalysis union type.
        // TypeScript cannot automatically infer that `parsedAnalysis` matches one of the union types
        // for the `analysis` property within the return object.
        if (assetType === 'youtube') {
            return {
                analysis: parsedAnalysis as YoutubeAnalysis,
                sources: filteredSources,
            };
        }

        return {
            analysis: parsedAnalysis as AnalysisResult,
            sources: filteredSources,
        };

    } catch (error) {
        console.error("Error fetching asset analysis from Gemini API:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to get asset analysis: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching asset analysis.");
    }
};