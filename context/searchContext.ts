import { createContext, useContext } from 'react';

type SearchContextType = {
    searchText: string;
    setSearchText: (searchText: string) => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSharedSearchContext = () => {
    const context = useContext(SearchContext);

    if (!context) {
        throw "'useSharedSearchContext' must be used within SearchContext";
    }

    return context;
};
