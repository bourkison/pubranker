import React, { useState } from 'react';
import FilterItem from '@/components/Filters/FilterItem';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setWithinRange } from '@/store/slices/explore';
import { MAX_WITHIN_RANGE, MIN_WITHIN_RANGE } from '@/constants';

export default function RangeFilter() {
    const withinRange = useAppSelector(state => state.explore.withinRange);
    const [range, setRange] = useState(withinRange);

    const dispatch = useAppDispatch();

    const onClear = () => {
        dispatch(setWithinRange(MAX_WITHIN_RANGE));
        setRange(MAX_WITHIN_RANGE);
    };

    const onSearch = () => {
        dispatch(setWithinRange(range));
    };

    return (
        <FilterItem
            buttonContent="Within"
            snapPoints={[240]}
            withBottomBar={true}
            onSearchPress={onSearch}
            onClearPress={onClear}
            bottomSheetContent={
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.headerContainer}>
                        <View>
                            <Text style={styles.bottomSheetHeader}>
                                Distance within
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.withinText}>
                                {range !== MAX_WITHIN_RANGE
                                    ? `Within ${range.toLocaleString()} meters`
                                    : 'Any'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheadingText}>
                            Only show pubs within this range
                        </Text>
                    </View>
                    <View style={styles.sliderContainer}>
                        <Slider
                            minimumValue={MIN_WITHIN_RANGE}
                            maximumValue={MAX_WITHIN_RANGE}
                            step={100}
                            value={range}
                            onValueChange={value => setRange(value)}
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
});
