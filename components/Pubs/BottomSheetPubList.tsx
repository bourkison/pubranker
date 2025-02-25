import React, { useCallback } from 'react';
import PubItem from '@/components/Pubs/PubItem';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
    ExplorePub,
    fetchMoreExplorePubs,
    setPubSave,
} from '@/store/slices/explore';

type BottomSheetPubListProps = {
    pubs: ExplorePub[];
};

export default function BottomSheetPubList({ pubs }: BottomSheetPubListProps) {
    const bottomTabBarHeight = useBottomTabBarHeight();
    const resultsAmount = useAppSelector(state => state.explore.resultsAmount);

    const isLoadingMore = useAppSelector(state => state.explore.isLoadingMore);
    const moreToLoad = useAppSelector(state => state.explore.moreToLoad);
    const isLoading = useAppSelector(state => state.explore.isLoading);

    const dispatch = useAppDispatch();

    const loadMorePubs = useCallback(() => {
        if (isLoading || isLoadingMore || !moreToLoad) {
            return;
        }

        dispatch(fetchMoreExplorePubs({ amount: 25 }));
    }, [isLoading, isLoadingMore, moreToLoad, dispatch]);

    return (
        <BottomSheetFlatList
            contentContainerStyle={{ paddingBottom: bottomTabBarHeight }}
            ListHeaderComponent={
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>
                        {resultsAmount} Pub{resultsAmount === 1 ? '' : 's'}
                    </Text>
                </View>
            }
            data={pubs}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <PubItem
                    pub={item}
                    onSaveComplete={() =>
                        dispatch(setPubSave({ id: item.id, value: true }))
                    }
                    onUnsaveComplete={() =>
                        dispatch(setPubSave({ id: item.id, value: false }))
                    }
                />
            )}
            onEndReached={loadMorePubs}
            ListFooterComponent={
                isLoadingMore ? <ActivityIndicator /> : undefined
            }
        />
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 25,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
    },
});
