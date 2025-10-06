import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface StockInputProps {
    assetType: 'stock' | 'commodity' | 'index' | 'youtube';
    onAssetTypeChange: (type: 'stock' | 'commodity' | 'index' | 'youtube') => void;
    assetNameValue: string;
    onAssetNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    marketValue: string;
    onMarketChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    topicValue: string;
    onTopicChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    membersOnlyContentValue: string;
    onMembersOnlyContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const StockInput: React.FC<StockInputProps> = ({ 
    assetType, 
    onAssetTypeChange, 
    assetNameValue, 
    onAssetNameChange, 
    marketValue, 
    onMarketChange, 
    topicValue,
    onTopicChange,
    membersOnlyContentValue,
    onMembersOnlyContentChange,
    onSubmit, 
    isLoading 
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoading) {
            onSubmit();
        }
    };

    const commonInputClass = "w-full px-4 py-3 bg-gray-900 border-2 border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const ToggleButton: React.FC<{ type: 'stock' | 'commodity' | 'index' | 'youtube'; children: React.ReactNode }> = ({ type, children }) => (
        <button
            type="button"
            onClick={() => onAssetTypeChange(type)}
            disabled={isLoading}
            className={`w-1/4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 disabled:opacity-50 ${
                assetType === type ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'
            }`}
        >
            {children}
        </button>
    );

    const getLabel = () => {
        if (assetType === 'stock') return 'Stock Symbol';
        if (assetType === 'commodity') return 'Commodity Name';
        if (assetType === 'index') return 'Index Name';
        return 'YouTube Channel Handle';
    };
    
    const getPlaceholder = () => {
        if (assetType === 'stock') return "e.g., AAPL";
        if (assetType === 'commodity') return "e.g., GOLD";
        if (assetType === 'index') return "e.g., NIFTY 50";
        return "e.g., @profgalloway";
    };

    const getAssetName = (value: string) => {
        if (assetType === 'youtube') {
            return value;
        }
        return value.toUpperCase();
    }


    return (
        <form onSubmit={handleSubmit}>
            <div className="flex justify-center mb-4">
                <div className="flex bg-gray-900 border border-gray-600 rounded-lg p-1 w-full max-w-md">
                    <ToggleButton type="stock">Stocks</ToggleButton>
                    <ToggleButton type="commodity">Commodities</ToggleButton>
                    <ToggleButton type="index">Indices</ToggleButton>
                    <ToggleButton type="youtube">YouTube</ToggleButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <div className={assetType === 'stock' || assetType === 'youtube' ? "md:col-span-2" : "md:col-span-4"}>
                    <label htmlFor="asset-name" className="block text-sm font-medium text-gray-300 mb-2">
                        {getLabel()}
                    </label>
                    <input
                        id="asset-name"
                        type="text"
                        value={assetNameValue}
                        onChange={(e) => onAssetNameChange({ ...e, target: { ...e.target, value: getAssetName(e.target.value) } })}
                        placeholder={getPlaceholder()}
                        disabled={isLoading}
                        className={commonInputClass}
                        required
                    />
                </div>

                {assetType === 'stock' && (
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
                )}
                
                 {assetType === 'youtube' && (
                    <div className="md:col-span-2">
                        <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">
                            Topic of Interest <span className="text-gray-500">(Optional)</span>
                        </label>
                        <input
                            id="topic"
                            type="text"
                            value={topicValue}
                            onChange={onTopicChange}
                            placeholder="e.g., Views on AI stocks"
                            disabled={isLoading}
                            className={commonInputClass}
                        />
                    </div>
                )}


                <button
                    type="submit"
                    disabled={isLoading}
                    className="md:col-span-1 w-full flex items-center justify-center px-5 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-800 disabled:cursor-wait disabled:opacity-70"
                >
                    <SearchIcon className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">{isLoading ? 'Researching...' : 'Research'}</span>
                </button>
            </div>
            
            {assetType === 'youtube' && (
                <div className="mt-4 animate-fade-in">
                    <label htmlFor="members-content" className="block text-sm font-medium text-gray-300 mb-2">
                        Analyze Members-Only Content <span className="text-gray-500">(Optional)</span>
                    </label>
                    <textarea
                        id="members-content"
                        value={membersOnlyContentValue}
                        onChange={onMembersOnlyContentChange}
                        placeholder="Paste transcript or text from members-only content here. Do NOT enter passwords or personal info."
                        disabled={isLoading}
                        className={`${commonInputClass} min-h-[120px] resize-y`}
                        aria-describedby="members-content-description"
                    />
                    <p id="members-content-description" className="mt-2 text-xs text-gray-500">
                       This feature allows analysis of text you provide. It does not access private accounts.
                    </p>
                </div>
            )}
        </form>
    );
};

export default StockInput;