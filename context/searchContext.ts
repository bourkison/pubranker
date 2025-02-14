import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export type ResultType = {
    title: string;
    subtitle: string;
    type:
        | 'pub'
        | 'park'
        | 'region'
        | 'user'
        | 'review'
        | 'nearby'
        | 'station'
        | 'landmark';
    onPress: () => void;
};

export type SearchType = 'places' | 'users' | 'reviews' | 'collections';

type SearchContextType = {
    searchText: string;
    setSearchText: Dispatch<SetStateAction<string>>;
    searchType: SearchType;
    toggleSearchType: (searchType: SearchType) => void;
    results: ResultType[];
    search: (type: SearchType) => void;
    isLoading: boolean;
};

export const SearchContext = createContext<SearchContextType | null>(null);

export const useSharedSearchContext = () => {
    const context = useContext(SearchContext);

    if (!context) {
        throw "'useSharedSearchContext' must be used within SearchContext";
    }

    return context;
};
