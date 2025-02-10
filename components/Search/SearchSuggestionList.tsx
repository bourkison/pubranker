import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import SearchSuggestionItem from '@/components/Search/SearchSuggestionItem';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { PRIMARY_COLOR } from '@/constants';
import { useSharedSearchContext } from '@/context/searchContext';

type SearchSuggestionListProps = {};

export default function SearchSuggestionList({}: SearchSuggestionListProps) {
    const bottomTabBarHeight = useBottomTabBarHeight();

    const { searchType, toggleSearchType, isLoading, results } =
        useSharedSearchContext();

    return (
        <View style={styles.container}>
            <View style={styles.searchTypeContainer}>
                <TouchableOpacity
                    disabled={searchType === 'places'}
                    onPress={() => toggleSearchType('places')}
                    style={[
                        styles.radioContainer,
                        searchType === 'places' && styles.activeRadioContainer,
                    ]}>
                    <Text
                        style={[
                            styles.radioText,
                            searchType === 'places' && styles.activeRadioText,
                        ]}>
                        Pubs
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={searchType === 'users'}
                    onPress={() => toggleSearchType('users')}
                    style={[
                        styles.radioContainer,
                        searchType === 'users' && styles.activeRadioContainer,
                    ]}>
                    <Text
                        style={[
                            styles.radioText,
                            searchType === 'users' && styles.activeRadioText,
                        ]}>
                        Users
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={searchType === 'reviews'}
                    onPress={() => toggleSearchType('reviews')}
                    style={[
                        styles.radioContainer,
                        searchType === 'reviews' && styles.activeRadioContainer,
                    ]}>
                    <Text
                        style={[
                            styles.radioText,
                            searchType === 'reviews' && styles.activeRadioText,
                        ]}>
                        Reviews
                    </Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={results}
                    contentContainerStyle={[
                        styles.contentContainer,
                        { paddingBottom: bottomTabBarHeight },
                    ]}
                    keyboardDismissMode="on-drag"
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <SearchSuggestionItem result={item} />
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        paddingHorizontal: 15,
    },
    searchTypeContainer: {
        flexDirection: 'row',
        paddingVertical: 3,
        paddingHorizontal: 12,
        justifyContent: 'center',
    },
    radioContainer: {
        borderColor: PRIMARY_COLOR,
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginHorizontal: 3,
    },
    activeRadioContainer: {
        backgroundColor: PRIMARY_COLOR,
    },
    radioText: {
        fontSize: 13,
        fontWeight: '500',
        color: PRIMARY_COLOR,
    },
    activeRadioText: {
        color: '#FFF',
    },
});
