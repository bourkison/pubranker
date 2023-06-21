import React, { useRef } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSearchText, setState } from '@/store/slices/explore';

export default function SearchBar() {
    const dispatch = useAppDispatch();
    const exploreState = useAppSelector(state => state.explore.exploreState);
    const searchText = useAppSelector(state => state.explore.searchText);

    const inputRef = useRef<TextInput>(null);

    const search = () => {
        console.log('search');
    };

    const clearSearch = () => {
        dispatch(setSearchText(''));
        search();
    };

    const goToSuggestions = () => {
        dispatch(setSearchText(''));
        dispatch(setState('explore'));

        if (inputRef && inputRef.current) {
            inputRef.current.blur();
        }
    };

    return (
        <View style={styles.searchBar}>
            {exploreState === 'explore' ? (
                <Ionicons
                    name="search"
                    color="#A3A3A3"
                    style={styles.searchIcon}
                    size={16}
                />
            ) : (
                <Pressable onPress={goToSuggestions}>
                    <Ionicons
                        name="arrow-back"
                        color="#A3A3A3"
                        style={styles.searchIcon}
                        size={16}
                    />
                </Pressable>
            )}

            <TextInput
                onFocus={() => dispatch(setState('search'))}
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Find pubs"
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
        borderRadius: 25,
        backgroundColor: '#FFF',
        paddingLeft: 17,
        paddingRight: 10,
        marginHorizontal: 20,
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
