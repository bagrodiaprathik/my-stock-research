import { ExpertNote } from '../types';

// In a real application, you might use an environment variable for the base URL.
// For this example, we assume the API is served from the same origin.
const API_BASE_URL = '/api';

/**
 * A helper function to handle fetch responses, parsing JSON and throwing errors for non-ok statuses.
 * @param response The fetch Response object.
 * @returns The parsed JSON data.
 */
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // Handle cases like 204 No Content for DELETE requests
    if (response.status === 204) {
        return null;
    }
    return response.json();
};

/**
 * Fetches all expert notes for a given stock symbol and market from the backend API.
 * @param symbol The stock symbol (e.g., 'AAPL').
 * @param market The market/exchange (e.g., 'NASDAQ').
 * @returns A promise that resolves to an array of ExpertNote objects.
 */
export const getNotesForStock = async (symbol: string, market: string): Promise<ExpertNote[]> => {
    const marketQuery = market.trim() ? `&market=${encodeURIComponent(market.trim().toUpperCase())}` : '';
    const symbolQuery = `symbol=${encodeURIComponent(symbol.trim().toUpperCase())}`;
    
    const response = await fetch(`${API_BASE_URL}/notes?${symbolQuery}${marketQuery}`);
    return handleResponse(response);
};

/**
 * Sends a new note to the backend to be saved.
 * @param noteData The data for the new note.
 * @returns A promise that resolves to the newly created ExpertNote object returned by the API.
 */
export const addNoteForStock = async (noteData: {
    symbol: string;
    market: string;
    person: string;
    opinion: string;
}): Promise<ExpertNote> => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData),
    });
    return handleResponse(response);
};

/**
 * Sends a request to delete a specific note by its ID.
 * @param noteId The unique identifier of the note to delete.
 */
export const deleteNote = async (noteId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
};