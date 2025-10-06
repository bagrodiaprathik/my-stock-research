import React, { useState, useCallback, useEffect } from 'react';
import StockInput from './components/StockInput';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ExpertOpinions from './components/ExpertOpinions';
import { getAssetAnalysis } from './services/geminiService';
import { getNotesForStock, addNoteForStock, deleteNote } from './services/notesService';
import { AnyFullAnalysis, ExpertNote } from './types';

const App: React.FC = () => {
    const [assetType, setAssetType] = useState<'stock' | 'commodity' | 'index' | 'youtube'>('stock');
    const [assetName, setAssetName] = useState<string>('RELIANCE');
    const [market, setMarket] = useState<string>('NSE');
    const [topicOfInterest, setTopicOfInterest] = useState<string>('');
    const [membersOnlyContent, setMembersOnlyContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [analysisResult, setAnalysisResult] = useState<AnyFullAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expertNotes, setExpertNotes] = useState<ExpertNote[]>([]);
    
    useEffect(() => {
        if (analysisResult) {
            const fetchNotes = async () => {
                try {
                    setError(null);
                    let symbol: string;
                    let currentMarket: string = '';

                    if ('symbol' in analysisResult.analysis) { // Asset Analysis
                        symbol = analysisResult.analysis.symbol;
                        currentMarket = assetType === 'stock' ? market : '';
                    } else { // YouTube Analysis
                        symbol = analysisResult.analysis.channelName;
                    }

                    const notes = await getNotesForStock(symbol, currentMarket);
                    setExpertNotes(notes);
                } catch (e) {
                    if (e instanceof Error) {
                        setError(`Failed to load notes: ${e.message}. Ensure your backend is running.`);
                    } else {
                        setError("An unknown error occurred while fetching notes.");
                    }
                    setExpertNotes([]);
                }
            };
            fetchNotes();
        }
    }, [analysisResult, market, assetType]);

    const handleResearch = useCallback(async () => {
        if (!assetName.trim()) {
            setError("Please enter a value for the selected research type.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setExpertNotes([]);

        try {
            const marketOrTopic = assetType === 'youtube' ? topicOfInterest : market;
            const result = await getAssetAnalysis(assetType, assetName, marketOrTopic, membersOnlyContent);
            setAnalysisResult(result);
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [assetType, assetName, market, topicOfInterest, membersOnlyContent]);
    
    const handleAddNote = async (person: string, opinion: string) => {
        if (!analysisResult) return;
        try {
            setError(null);
            let symbol: string;
            let currentMarket: string = '';

            if ('symbol' in analysisResult.analysis) { // Asset Analysis
                symbol = analysisResult.analysis.symbol;
                currentMarket = assetType === 'stock' ? market : '';
            } else { // YouTube Analysis
                symbol = analysisResult.analysis.channelName;
            }

            const newNote = await addNoteForStock({
                symbol: symbol,
                market: currentMarket,
                person,
                opinion,
            });
            setExpertNotes(prevNotes => [...prevNotes, newNote]);
        } catch (e) {
             if (e instanceof Error) {
                setError(`Failed to save note: ${e.message}`);
            } else {
                setError("An unknown error occurred while saving the note.");
            }
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        if (!analysisResult) return;
        try {
            setError(null);
            await deleteNote(noteId);
            setExpertNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        } catch (e) {
            if (e instanceof Error) {
                setError(`Failed to delete note: ${e.message}`);
            } else {
                setError("An unknown error occurred while deleting the note.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                        Market Research AI
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Get AI-powered investment insights backed by real-time web data.
                    </p>
                </header>

                <main>
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
                         <StockInput 
                            assetType={assetType}
                            onAssetTypeChange={(type) => {
                                setAssetType(type);
                                setAssetName('');
                                setMarket('');
                                setTopicOfInterest('');
                                setMembersOnlyContent('');
                            }}
                            assetNameValue={assetName}
                            onAssetNameChange={(e) => setAssetName(e.target.value)}
                            marketValue={market}
                            onMarketChange={(e) => setMarket(e.target.value.toUpperCase())}
                            topicValue={topicOfInterest}
                            onTopicChange={(e) => setTopicOfInterest(e.target.value)}
                            membersOnlyContentValue={membersOnlyContent}
                            onMembersOnlyContentChange={(e) => setMembersOnlyContent(e.target.value)}
                            onSubmit={handleResearch}
                            isLoading={isLoading}
                        />
                    </div>
                    
                    <div className="mt-8 space-y-8">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                                <LoadingSpinner />
                                <p className="mt-4 text-gray-300 animate-pulse-fast">Analyzing market data...</p>
                            </div>
                        )}
                        {analysisResult && <ResultDisplay result={analysisResult} />}
                        
                        {error && !isLoading && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-xl" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {analysisResult && !isLoading && (
                            <ExpertOpinions 
                                notes={expertNotes}
                                onAddNote={handleAddNote}
                                onDeleteNote={handleDeleteNote}
                            />
                        )}
                    </div>
                </main>
                <footer className="text-center mt-12 text-gray-500 text-sm">
                    <p>Powered by Gemini. For informational purposes only. Not financial advice.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;