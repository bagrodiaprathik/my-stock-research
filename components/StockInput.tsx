
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface StockInputProps {
    symbolValue: string;
    onSymbolChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    marketValue: string;
    onMarketChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ symbolValue, onSymbolChange, marketValue, onMarketChange, onSubmit, isLoading }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading) {
            onSubmit();
        }
    };

    const commonInputClass = "w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <div className="md:col-span-2">
                    <label htmlFor="stock-symbol" className="block text-sm font-medium text-gray-300 mb-2">
                        Stock Symbol
                    </label>
                    <input
                        id="stock-symbol"
                        type="text"
                        value={symbolValue}
                        onChange={onSymbolChange}
                        placeholder="e.g., AAPL, RELIANCE"
                        disabled={isLoading}
                        className={commonInputClass}
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="stock-market" className="block text-sm font-medium text-gray-300 mb-2">
                        Exchange / Market <span className="text-gray-500">(Optional)</span>
                    </label>
                    <input
                        id="stock-market"
                        type="text"
                        value={marketValue}
                        onChange={onMarketChange}
                        placeholder="e.g., NASDAQ, NSE"
                        disabled={isLoading}
                        className={commonInputClass}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="md:col-span-1 w-full flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-800 disabled:cursor-wait disabled:opacity-70"
                >
                    <SearchIcon className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">{isLoading ? 'Researching...' : 'Research'}</span>
                </button>
            </div>
        </form>
    );
};

export default StockInput;
