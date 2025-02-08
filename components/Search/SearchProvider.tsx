import { SearchContext } from '@/context/searchContext';
import React, { useState } from 'react';

type SearchProviderProps = {
    children: JSX.Element;
};

export default function SearchProvider({ children }: SearchProviderProps) {
    const [searchText, setSearchText] = useState('');

    return (
        <SearchContext.Provider value={{ searchText, setSearchText }}>
            {children}
        </SearchContext.Provider>
    );
}
