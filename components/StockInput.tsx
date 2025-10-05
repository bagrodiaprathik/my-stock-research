
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface StockInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading) {
            onSubmit();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="stock-symbol" className="block text-sm font-medium text-gray-300 mb-2">
                Enter Stock Symbol (e.g., AAPL, TSLA)
            </label>
            <div className="flex items-center space-x-2">
                <input
                    id="stock-symbol"
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder="GOOGL"
                    disabled={isLoading}
                    className="flex-grow w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-800 disabled:cursor-wait disabled:opacity-70"
                >
                    <SearchIcon className="h-5 w-5 mr-2" />
                    <span>{isLoading ? 'Researching...' : 'Research'}</span>
                </button>
            </div>
        </form>
    );
};

export default StockInput;
