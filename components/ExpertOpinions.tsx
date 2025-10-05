import React, { useState } from 'react';
import { ExpertNote } from '../types';
import TrashIcon from './icons/TrashIcon';

interface ExpertOpinionsProps {
    notes: ExpertNote[];
    onAddNote: (person: string, opinion: string) => void;
    onDeleteNote: (noteId: string) => void;
}

const ExpertOpinions: React.FC<ExpertOpinionsProps> = ({ notes, onAddNote, onDeleteNote }) => {
    const [person, setPerson] = useState('');
    const [opinion, setOpinion] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleAddClick = () => {
        setIsFormVisible(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (person.trim() && opinion.trim()) {
            onAddNote(person, opinion);
            setPerson('');
            setOpinion('');
            setIsFormVisible(false);
        }
    };

    const inputClass = "w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200";

    return (
        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-gray-200 mb-4">My Research & Expert Opinions</h3>
            
            <div className="space-y-4">
                {notes.length === 0 && !isFormVisible && (
                    <div className="text-center py-4">
                        <p className="text-gray-400 mb-4">No opinions saved for this stock yet.</p>
                         <button
                            onClick={handleAddClick}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300"
                        >
                            + Add First Note
                        </button>
                    </div>
                )}
                
                {notes.map(note => (
                    <div key={note.id} className="group flex items-start p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex-1">
                            <p className="font-bold text-blue-400">{note.person}</p>
                            <p className="text-gray-300 whitespace-pre-wrap">{note.opinion}</p>
                        </div>
                        <button 
                            onClick={() => onDeleteNote(note.id)}
                            className="ml-4 p-2 text-gray-500 rounded-full hover:bg-red-900/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            aria-label="Delete note"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                
                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={person}
                                onChange={(e) => setPerson(e.target.value)}
                                placeholder="Person / Source (e.g., 'Analyst Name')"
                                className={inputClass}
                                required
                            />
                            <textarea
                                value={opinion}
                                onChange={(e) => setOpinion(e.target.value)}
                                placeholder="Their opinion or your note..."
                                className={`${inputClass} min-h-[80px]`}
                                required
                            />
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                            <button type="button" onClick={() => setIsFormVisible(false)} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                Save Note
                            </button>
                        </div>
                    </form>
                )}

                {notes.length > 0 && !isFormVisible && (
                    <div className="pt-4 border-t border-gray-700 text-right">
                         <button
                            onClick={handleAddClick}
                            className="px-4 py-2 bg-blue-600/80 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300"
                        >
                            + Add New Note
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertOpinions;