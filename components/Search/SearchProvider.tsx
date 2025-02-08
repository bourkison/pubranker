import { ResultType, SearchContext, SearchType } from '@/context/searchContext';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';

type SearchProviderProps = {
    children: JSX.Element;
};

export default function SearchProvider({ children }: SearchProviderProps) {
    const [searchText, setSearchText] = useState('');
    const [lastSearchedText, setLastSearchedText] = useState('');
    const [searchType, setSearchType] = useState<
        'places' | 'users' | 'reviews'
    >('places');
    const [isLoading, setIsLoading] = useState(false);

    const [internalResults, setInternalResults] = useState<ResultType[]>([]);
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const results = useMemo<ResultType[]>(() => {
        if (
            internalResults.length === 0 &&
            searchType === 'places' &&
            !lastSearchedText
        ) {
            return [
                {
                    title: 'Nearby',
                    subtitle: '',
                    type: 'nearby',
                    onPress: () => {
                        console.log('Nearby press');
                    },
                },
            ];
        }

        return internalResults;
    }, [internalResults, searchType, lastSearchedText]);

    const searchUsers = useCallback(async () => {
        const { data, error } = await supabase
            .from('users_public')
            .select('id, name, username')
            .textSearch('username', searchText, {
                config: 'english',
                type: 'websearch',
            });

        if (error) {
            console.error(error);
            setInternalResults([]);
            return;
        }

        console.log('user search', data);

        setInternalResults(
            data.map(d => ({
                title: d.username,
                subtitle: d.name,
                type: 'user',
                onPress: () => {
                    console.log('USER PRESS', d.id);
                },
            })),
        );
    }, [searchText]);

    const searchPlaces = useCallback(async () => {
        const { data, error } = await supabase
            .from('pubs')
            .select('id, name, address')
            .textSearch('name', searchText, {
                config: 'english',
                type: 'websearch',
            });

        if (error) {
            console.error(error);
            setInternalResults([]);
            return;
        }

        console.log('pub search', data);

        setInternalResults(
            data.map(d => ({
                title: d.name,
                subtitle: d.address,
                type: 'pub',
                onPress: () => {
                    navigation.navigate('PubView', { pubId: d.id });
                },
            })),
        );
    }, [searchText, navigation]);

    const searchReviews = useCallback(async () => {}, []);

    const search = useCallback(
        async (type: SearchType) => {
            setIsLoading(true);
            setLastSearchedText(searchText);

            if (type === 'users') {
                await searchUsers();
                setIsLoading(false);
                return;
            }

            if (type === 'places') {
                await searchPlaces();
                setIsLoading(false);
                return;
            }

            if (type === 'reviews') {
                await searchReviews();
                setIsLoading(false);
                return;
            }
        },
        [searchUsers, searchPlaces, searchReviews, searchText],
    );

    const toggleSearchType = useCallback(
        (type: SearchType) => {
            if (type !== searchType) {
                setSearchType(type);
                setInternalResults([]);
                search(type);
            }
        },
        [search, searchType],
    );

    return (
        <SearchContext.Provider
            value={{
                searchText,
                setSearchText,
                searchType,
                toggleSearchType,
                results,
                search,
                isLoading,
            }}>
            {children}
        </SearchContext.Provider>
    );
}
