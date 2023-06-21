import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchExplorePubs,
    setSearchText,
    setState,
    resetPubs,
} from '@/store/slices/explore';

export default function SearchBar() {
    const dispatch = useAppDispatch();
    const exploreState = useAppSelector(state => state.explore.exploreState);
    const searchText = useAppSelector(state => state.explore.searchText);

    const inputRef = useRef<TextInput>(null);

    const search = () => {
        dispatch(fetchExplorePubs({ amount: 10 }));
    };

    const goToSuggestions = () => {
        dispatch(setSearchText(''));
        dispatch(setState('suggestions'));
        dispatch(resetPubs());

        if (inputRef && inputRef.current) {
            inputRef.current.blur();
        }
    };

    return (
        <View style={styles.searchBar}>
            {exploreState === 'suggestions' ? (
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
