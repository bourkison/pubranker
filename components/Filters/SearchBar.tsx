import React, { useEffect, useRef, useState } from 'react';
import { TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    fetchExplorePubs,
    setSearchText,
    setState,
    // resetPubs,
} from '@/store/slices/explore';
import { INITIAL_SEARCH_AMOUNT, PRIMARY_COLOR } from '@/constants';
import { deselectPub } from '@/store/slices/map';
import Animated, {
    Easing,
    FadeInDown,
    FadeInUp,
    FadeOutDown,
    FadeOutUp,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const AnimatedIonicon = Animated.createAnimatedComponent(Ionicons);

export default function SearchBar() {
    const dispatch = useAppDispatch();
    const exploreState = useAppSelector(state => state.explore.exploreState);
    const searchText = useAppSelector(state => state.explore.searchText);

    const [focused, setFocused] = useState(false);

    const inputRef = useRef<TextInput>(null);

    const sFocused = useSharedValue(0); // 0 is not focused, 1 is focused.

    const search = () => {
        dispatch(fetchExplorePubs({ amount: INITIAL_SEARCH_AMOUNT }));
    };

    const goToSuggestions = () => {
        // dispatch(setSearchText(''));
        // dispatch(resetPubs());
        dispatch(setState('suggestions'));
        dispatch(deselectPub());

        if (inputRef && inputRef.current) {
            inputRef.current.blur();
        }
    };

    useEffect(() => {
        if (focused) {
            sFocused.value = withTiming(1, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        } else {
            sFocused.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        }
    }, [focused, sFocused]);

    const rStyle = useAnimatedStyle(() => ({
        borderColor: interpolateColor(
            sFocused.value,
            [0, 1],
            ['rgba(0, 0, 0, 0)', PRIMARY_COLOR + '40'],
        ),
    }));

    return (
        <Animated.View style={[styles.searchBar, rStyle]}>
            {exploreState === 'suggestions' ? (
                <AnimatedIonicon
                    name="search"
                    color="#A3A3A3"
                    style={styles.searchIcon}
                    size={14}
                    entering={FadeInUp.duration(300)}
                    exiting={FadeOutUp.duration(300)}
                />
            ) : (
                <Pressable onPress={goToSuggestions}>
                    <AnimatedIonicon
                        name="arrow-back-outline"
                        color="#A3A3A3"
                        style={styles.searchIcon}
                        size={14}
                        entering={FadeInDown.duration(300)}
                        exiting={FadeOutDown.duration(300)}
                    />
                </Pressable>
            )}

            <TextInput
                onFocus={e => {
                    dispatch(setState('search'));
                    setFocused(true);
                    // Work around for selectTextOnFocus={true} not working
                    // https://github.com/facebook/react-native/issues/30585#issuecomment-1330928411
                    e.currentTarget.setNativeProps({
                        selection: {
                            start: 0,
                            end: searchText.length,
                        },
                    });
                }}
                onBlur={() => setFocused(false)}
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
        </Animated.View>
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
        overflow: 'hidden',
        borderWidth: 1,
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
