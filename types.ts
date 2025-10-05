export interface AnalysisResult {
  symbol: string;
  suggestion: string;
  rationale: string[];
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

export interface ExpertNote {
  id: string;
  person: string;
  opinion: string;
  timestamp: string;
}
