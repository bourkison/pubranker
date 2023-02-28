import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { setSearchText } from '@/store/slices/discover';

type SearchBarProps = {
    search: () => void;
};

export default function SearchBar({ search }: SearchBarProps) {
    const TextInputRef = useRef<TextInput>(null);

    const [focused, setFocused] = useState(-1); // -1 is not focused, 0 is focused at index 0, etc.

    const searchText = useAppSelector(state => state.discover.searchText);
    const { expand, snapToIndex, animatedIndex } = useBottomSheet();

    const dispatch = useAppDispatch();

    const cancelPress = () => {
        if (TextInputRef && TextInputRef.current) {
            TextInputRef.current.blur();
        }

        if (animatedIndex.value === 0 || focused === 2) {
            return;
        } else {
            console.log('I SNAP');
            snapToIndex(1);
        }
    };

    const searchBarFocused = () => {
        setFocused(animatedIndex.value);
        expand();
    };

    const clearSearch = () => {
        dispatch(setSearchText(''));
        search();
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons
                    name="search"
                    color="#A3A3A3"
                    style={styles.searchIcon}
                />
                <TextInput
                    ref={TextInputRef}
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#A3A3A3"
                    value={searchText}
                    returnKeyType="search"
                    onSubmitEditing={search}
                    onChangeText={s => dispatch(setSearchText(s))}
                    onFocus={searchBarFocused}
                    onBlur={() => setFocused(-1)}
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
            {focused > -1 ? (
                <TouchableOpacity
                    style={styles.cancelTextContainer}
                    onPress={cancelPress}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            ) : undefined}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center' },
    searchBar: {
        flex: 1,
        borderRadius: 7,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        marginHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchIcon: {
        marginRight: 5,
    },
    xIcon: { zIndex: 99 },
    searchInput: {
        paddingVertical: 8,
        flex: 1,
    },
    cancelTextContainer: { marginRight: 15 },
    cancelText: {
        color: 'rgb(229, 130, 68)',
        fontWeight: '500',
    },
});
