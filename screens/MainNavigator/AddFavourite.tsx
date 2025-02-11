import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import SearchSuggestionItem from '@/components/Search/SearchSuggestionItem';
import { ResultType } from '@/context/searchContext';

export default function AddFavourite({
    navigation,
    route,
}: StackScreenProps<MainNavigatorStackParamList, 'AddFavourite'>) {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<ResultType[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const maxIdVal = useMemo<number>(() => {
        if (route.params.favourites.length === 0) {
            return 0;
        }

        return route.params.favourites
            .map(favourite => favourite.id)
            .reduce((acc, curr) => (acc += curr));
    }, [route]);

    const maxCountVal = useMemo<number>(() => {
        if (route.params.favourites.length === 0) {
            return 0;
        }

        return route.params.favourites
            .map(favourite => favourite.count)
            .reduce((acc, curr) => (acc += curr));
    }, [route]);

    const search = useCallback(async () => {
        setIsSearching(true);
        setResults([]);

        const { data, error } = await supabase
            .from('pubs')
            .select('id, name, primary_photo')
            .textSearch('name', searchText, {
                type: 'websearch',
                config: 'english',
            });

        if (error) {
            console.error(error);
            setIsSearching(false);
            return;
        }

        // Only show results of pubs that aren't already in favourites
        // Furthermore, map the pub to be a search result.
        setResults(
            data
                .filter(
                    d =>
                        !route.params.favourites
                            .map(favourite => favourite.pubs.id)
                            .includes(d.id),
                )
                .map(d => ({
                    title: d.name,
                    subtitle: '',
                    type: 'pub',
                    onPress: () => {
                        route.params.onAdd({
                            id: maxIdVal + 1,
                            count: maxCountVal + 1,
                            pubs: {
                                id: d.id,
                                name: d.name,
                                primary_photo: d.primary_photo,
                            },
                        });

                        navigation.goBack();
                    },
                })),
        );

        setIsSearching(false);
    }, [searchText, route, maxCountVal, maxIdVal, navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.cancelContainer}
                    onPress={() => navigation.goBack()}>
                    <Text>Back</Text>
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Select a Pub</Text>
                </View>

                <View style={styles.cancelContainer}>
                    <Text style={styles.hiddenText}>Back</Text>
                </View>
            </View>

            <FlatList
                data={results}
                ListHeaderComponent={
                    <View style={styles.searchBarContainer}>
                        <View style={styles.searchBar}>
                            <Ionicons
                                name="search"
                                color="#A3A3A3"
                                style={styles.searchIcon}
                                size={14}
                            />
                            <TextInput
                                placeholder="Search for a film"
                                style={styles.searchInput}
                                value={searchText}
                                onChangeText={setSearchText}
                                returnKeyType="search"
                                onSubmitEditing={search}
                            />
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    isSearching ? (
                        <ActivityIndicator />
                    ) : (
                        <View>
                            <Text>No pubs</Text>
                        </View>
                    )
                }
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <SearchSuggestionItem result={item} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'space-between',
    },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
    },
    hiddenText: {
        color: 'transparent',
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: '500',
    },
    contentContainer: {},
    searchBarContainer: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 10,
    },
    searchBar: {
        borderRadius: 5,
        backgroundColor: 'white',
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchInput: {
        paddingVertical: 8,
        flex: 1,
    },
    searchIcon: {
        marginRight: 5,
    },
    itemContainer: {
        paddingHorizontal: 10,
    },
});
