
import React from 'react';
import { FullAnalysis } from '../types';
import LinkIcon from './icons/LinkIcon';

interface ResultDisplayProps {
    result: FullAnalysis;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    const { analysis, sources } = result;

    const getSuggestionClass = (suggestion: string) => {
        const lowerSuggestion = suggestion.toLowerCase();
        if (lowerSuggestion.includes('buy') || lowerSuggestion.includes('invest')) {
            return 'bg-green-500/10 text-green-300 border-green-500/30';
        }
        if (lowerSuggestion.includes('sell') || lowerSuggestion.includes('avoid')) {
            return 'bg-red-500/10 text-red-300 border-red-500/30';
        }
        if (lowerSuggestion.includes('hold') || lowerSuggestion.includes('caution')) {
            return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
        }
        return 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    };
    
    return (
        <div className="space-y-6 bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
            <div>
                <h2 className="text-3xl font-bold text-white">
                    Analysis for <span className="text-blue-400">{analysis.symbol}</span>
                </h2>
                <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-lg font-semibold border ${getSuggestionClass(analysis.suggestion)}`}>
                    {analysis.suggestion}
                </div>
            </div>

            <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Rationale</h3>
                <ul className="space-y-3 list-disc list-inside text-gray-300">
                    {analysis.rationale.map((point, index) => (
                        <li key={index} className="pl-2 leading-relaxed">{point}</li>
                    ))}
                </ul>
            </div>
            
            {sources.length > 0 && (
                 <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">Sources</h3>
                    <div className="space-y-3">
                         {sources.map((source, index) => (
                            source.web && (
                                <a 
                                    key={index}
                                    href={source.web.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 group"
                                >
                                    <LinkIcon className="w-4 h-4 mt-1 mr-3 text-gray-500 flex-shrink-0 group-hover:text-blue-400" />
                                    <div>
                                        <p className="font-medium text-blue-400 group-hover:underline">
                                            {source.web.title || "Untitled Source"}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{source.web.uri}</p>
                                    </div>
                                </a>
                            )
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultDisplay;
