import SearchSuggestionItem from '@/components/Search/SearchSuggestionItem';
import Header from '@/components/Utility/Header';
import { ResultType } from '@/context/searchContext';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddCollaborator({
    navigation,
    route,
}: RootStackScreenProps<'AddCollaborator'>) {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState<ResultType[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const search = useCallback(async () => {
        setIsSearching(true);
        setResults([]);

        const { data, error } = await supabase
            .from('users_public')
            .select('id, username, profile_photo')
            .textSearch('username', searchText, {
                type: 'websearch',
                config: 'english',
            });

        if (error) {
            console.error(error);
            setIsSearching(false);
            return;
        }

        setResults(
            data
                .filter(d => !route.params.excludedIds.includes(d.id))
                .map(d => ({
                    title: d.username,
                    subtitle: '',
                    type: 'user',
                    onPress: () => {
                        route.params.onAdd({
                            id: d.id,
                            username: d.username,
                            profile_photo: d.profile_photo,
                        });

                        navigation.goBack();
                    },
                })),
        );
    }, [route, searchText, navigation]);

    return (
        <View style={styles.container}>
            <Header
                header="Add Collaborator"
                leftColumn={
                    <TouchableOpacity
                        style={styles.cancelContainer}
                        onPress={() => navigation.goBack()}>
                        <Text>Back</Text>
                    </TouchableOpacity>
                }
                rightColumn={
                    <View style={styles.cancelContainer}>
                        <Text style={styles.hiddenText}>Back</Text>
                    </View>
                }
            />

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
                                placeholder="Search for a user"
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
                            <Text>No users</Text>
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
    container: {},
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'flex-end',
    },
    hiddenText: {
        color: 'transparent',
    },
    itemContainer: {
        paddingHorizontal: 10,
    },
    searchInput: {
        paddingVertical: 8,
        flex: 1,
    },
    searchIcon: {
        marginRight: 5,
    },
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
});
