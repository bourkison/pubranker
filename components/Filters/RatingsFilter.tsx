import React, { useState } from 'react';
import FilterItem from '@/components/Filters/FilterItem';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setOverallRating as setStoreOverallRating } from '@/store/slices/explore';
import { Ionicons } from '@expo/vector-icons';

export default function RangeFilter() {
    const storeOverallRating = useAppSelector(
        state => state.explore.overallRating,
    );
    const [overallRating, setOverallRating] = useState(storeOverallRating);

    const dispatch = useAppDispatch();

    const onClear = () => {
        dispatch(setStoreOverallRating(0));
        setOverallRating(0);
    };

    const onSearch = () => {
        dispatch(setStoreOverallRating(overallRating));
    };

    return (
        <FilterItem
            buttonContent={
                storeOverallRating === 0 ? (
                    'Any Rating'
                ) : (
                    <View style={styles.filterButtonContent}>
                        <Ionicons
                            style={styles.ratingIcon}
                            name="star"
                            size={12}
                            color="#D8D4D5"
                        />
                        <Text style={styles.filterText}>
                            {storeOverallRating.toFixed(1)}+
                        </Text>
                    </View>
                )
            }
            snapPoints={[240]}
            withBottomBar={true}
            onSearchPress={onSearch}
            onClearPress={onClear}
            bottomSheetContent={
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.bottomSheetHeader}>Rating</Text>
                        </View>
                        <View>
                            {overallRating !== 0 ? (
                                <View style={styles.ratingContainer}>
                                    <Ionicons
                                        style={styles.ratingIcon}
                                        name="star"
                                        size={12}
                                        color="#384D48"
                                    />
                                    <Text style={styles.withinText}>
                                        {overallRating.toFixed(2)}+
                                    </Text>
                                </View>
                            ) : (
                                <Text style={styles.withinText}>Any</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheadingText}>
                            Only show pubs with a higher overall rating
                        </Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <Slider
                            minimumValue={0}
                            maximumValue={4.5}
                            step={0.5}
                            value={overallRating}
                            onValueChange={value => setOverallRating(value)}
                        />
                    </View>
                </View>
            }
        />
    );
}

const styles = StyleSheet.create({
    bottomSheetContainer: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subheadingContainer: {
        marginTop: 5,
    },
    subheadingText: {
        fontWeight: '300',
        fontSize: 12,
    },
    bottomSheetHeader: {
        fontSize: 22,
        fontWeight: '600',
    },
    withinText: {
        fontSize: 14,
    },
    sliderContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingIcon: { marginRight: 3 },
    filterButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterText: {
        color: '#D8D4D5',
        fontSize: 12,
    },
});
