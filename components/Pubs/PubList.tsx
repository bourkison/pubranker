import { PubSchema } from '@/types';
import React, { useCallback } from 'react';
import BottomSheetPubItem from '@/components/Pubs/PubItem';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMoreExplorePubs } from '@/store/slices/explore';

type BottomSheetPubListProps = {
    pubs: PubSchema[];
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
            renderItem={({ item }) => <BottomSheetPubItem pub={item} />}
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
