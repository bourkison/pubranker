import { ResultType, SearchContext, SearchType } from '@/context/searchContext';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';

type SearchProviderProps = {
    children: JSX.Element;
};

export default function SearchProvider({ children }: SearchProviderProps) {
    const [searchText, setSearchText] = useState('');
    const [lastSearchedText, setLastSearchedText] = useState('');
    const [searchType, setSearchType] = useState<
        'places' | 'users' | 'reviews' | 'collections'
    >('places');
    const [isLoading, setIsLoading] = useState(false);

    const [internalResults, setInternalResults] = useState<ResultType[]>([]);
    const navigation = useNavigation();

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

        setInternalResults(
            data.map(d => ({
                title: d.username,
                subtitle: d.name,
                type: 'user',
                onPress: () => {
                    navigation.navigate('Profile', { userId: d.id });
                },
            })),
        );
    }, [searchText, navigation]);

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

        setInternalResults(
            data.map(d => ({
                title: d.name,
                subtitle: d.address,
                type: 'pub',
                onPress: () => {
                    navigation.navigate('PubHome', {
                        screen: 'PubView',
                        params: { pubId: d.id },
                    });
                },
            })),
        );
    }, [searchText, navigation]);

    const searchCollections = useCallback(async () => {
        const { data, error } = await supabase
            .from('collections')
            .select(
                'id, name, users_public!collections_user_id_fkey1(username)',
            )
            .textSearch('name', searchText, {
                config: 'english',
                type: 'websearch',
            });

        if (error) {
            console.error(error);
            setInternalResults([]);
            return;
        }

        setInternalResults(
            data.map(d => ({
                title: d.name,
                subtitle: d.users_public.username,
                type: 'region',
                onPress: () => {
                    navigation.navigate('UserCollectionView', {
                        collectionId: d.id,
                    });
                },
            })),
        );
    }, [navigation, searchText]);

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

            if (type === 'collections') {
                await searchCollections();
                setIsLoading(false);
                return;
            }

            if (type === 'reviews') {
                await searchReviews();
                setIsLoading(false);
                return;
            }
        },
        [
            searchUsers,
            searchPlaces,
            searchCollections,
            searchReviews,
            searchText,
        ],
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
