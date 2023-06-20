import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchText } from '@/store/slices/discover';

export default function SearchBar() {
    const dispatch = useAppDispatch();
    const searchText = useAppSelector(state => state.discover.searchText);

    const search = () => {
        console.log('search');
    };

    const clearSearch = () => {
        dispatch(setSearchText(''));
        search();
    };

    return (
        <View style={styles.searchBar}>
            <Ionicons name="search" color="#A3A3A3" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#A3A3A3"
                value={searchText}
                returnKeyType="search"
                onSubmitEditing={search}
                onChangeText={s => dispatch(setSearchText(s))}
                selectTextOnFocus={true}
            />
            {searchText.length > 0 ? (
                <TouchableOpacity onPress={clearSearch}>
                    <Feather
                        name="x-circle"
                        color="#A3A3A3"
                        style={styles.xIcon}
                        size={13}
                    />
                </TouchableOpacity>
            ) : undefined}
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        borderRadius: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    searchIcon: {
        marginRight: 5,
    },
    xIcon: { zIndex: 99 },
    searchInput: {
        paddingVertical: 12,
        flex: 1,
    },
});
