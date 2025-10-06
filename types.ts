export interface TechnicalPattern {
    name: string;
    description: string;
}

export interface TechnicalAnalysis {
    summary: string;
    patterns: TechnicalPattern[];
}

export interface AnalysisResult {
  symbol: string;
  suggestion: string;
  rationale: string[];
  technicalAnalysis: TechnicalAnalysis;
}

export interface YoutubeVideoSummary {
    title: string;
    summary: string;
}

export interface YoutubeAnalysis {
    channelName: string;
    overallStance: string;
    keyThemes: string[];
    recentVideosSummary: YoutubeVideoSummary[];
}

export interface GroundingChunk {
    web?: {
        uri: string;
        title: string;
    }
}

export interface FullAnalysis {
    analysis: AnalysisResult;
    sources: GroundingChunk[];
}

export interface FullYoutubeAnalysis {
    analysis: YoutubeAnalysis;
    sources: GroundingChunk[];
}

export type AnyAnalysis = AnalysisResult | YoutubeAnalysis;
export type AnyFullAnalysis = FullAnalysis | FullYoutubeAnalysis;


export interface ExpertNote {
  id: string;
  person: string;
  opinion: string;
  timestamp: string;
}