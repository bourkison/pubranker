import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import SearchSuggestionItem from '@/components/Filters/SearchSuggestionItem';
import { useAppSelector } from '@/store/hooks';
import { SelectedPub } from '@/store/slices/pub';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';

type Suggestion = {
    title: string;
    subtitle?: string;
    type: 'pub' | 'station' | 'park' | 'landmark' | 'area' | 'nearby';
    pub?: SelectedPub;
    onPress?: () => void;
};

export default function SearchSuggestionList() {
    const isLoadingPubs = useAppSelector(state => state.explore.isLoading);
    const pubs = useAppSelector(state => state.explore.pubs);

    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    const suggestions = useMemo<Suggestion[]>(() => {
        const items: Suggestion[] = pubs.map(pub => ({
            title: pub.name,
            subtitle: pub.address,
            type: 'pub',
            pub: pub,
            onPress() {
                navigation.navigate('PubView', { pub });
            },
        }));

        if (items.length) {
            return items;
        }

        return [
            {
                title: 'Nearby',
                type: 'nearby',
            },
        ];
    }, [pubs, navigation]);

    return (
        <View style={styles.container}>
            {isLoadingPubs ? (
                <ActivityIndicator />
            ) : (
                <FlatList
                    data={suggestions}
                    contentContainerStyle={styles.contentContainer}
                    keyboardDismissMode="on-drag"
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View>
                            <SearchSuggestionItem
                                title={item.title}
                                subtitle={item.subtitle}
                                type={item.type}
                                onPress={item.onPress}
                            />
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
});
