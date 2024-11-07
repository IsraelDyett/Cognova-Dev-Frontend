import fastApi from '@/lib/fastapi';
import { debug } from '@/lib/utils';
import { create } from 'zustand';

export type ScrapeType = 'single' | 'nested' | '';

interface ScraperState {
    step: number;
    urls: string[];
    loading: boolean;
    selectedUrls: string[];
    error: string | null;
}

interface ScraperActions {
    setStep: (step: number) => void;
    setUrls: (urls: string[]) => void;
    setLoading: (loading: boolean) => void;
    setSelectedUrls: (urls: string[]) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

type ScraperStore = ScraperState & ScraperActions;

const initialState: ScraperState = {
    step: 1,
    urls: [],
    loading: false,
    selectedUrls: [],
    error: null,
};

export const useScraperStore = create<ScraperStore>((set) => ({
    ...initialState,
    
    setStep: (step) => set({ step }),
    setUrls: (urls) => set({ urls }),
    setLoading: (loading) => set({ loading }),
    setSelectedUrls: (urls) => set({ selectedUrls: urls }),
    setError: (error) => set({ error }),
    reset: () => set(initialState),
}));

class ScraperError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'ScraperError';
    }
}

export const scraperApi = {
    async fetchUrls(url: string): Promise<string[]> {
        debug("[API-STORE] {SCRAPER-API} FETCH URLS")
        try {
            const data = await fastApi.sources.scrapeUrls(url)
            if (data.status !== "success") {
                throw new ScraperError('Failed to fetch URLs');
            }

            const urlSet = new Set(data.data);
            urlSet.add(url)
            return Array.from(urlSet)
        } catch (error) {
            console.error('Error fetching URLs:', error);
            throw error instanceof ScraperError 
                ? error 
                : new ScraperError('Failed to fetch URLs');
        }
    },

    async scrapeURLs(urls: string[]): Promise<any> {
        debug("[API-STORE] {SCRAPER-API} SCRAPE URL")
        try {
            const scrapeResults = await fastApi.sources.addSource("website", urls)
            return scrapeResults
        } catch (error) {
            console.error('Error scraping content:', error);
            throw error instanceof ScraperError
                ? error
                : new ScraperError('Failed to scrape content');
        }
    }
};