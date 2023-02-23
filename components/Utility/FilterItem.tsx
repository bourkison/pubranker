import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPubs, setFilter } from '@/store/slices/discover';
import { PubFilters } from '@/types';
import React, { useMemo } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type FilterItemProps = {
    type: keyof PubFilters;
    pubLoadAmount: number;
};

export default function FilterItem({ type, pubLoadAmount }: FilterItemProps) {
    const val = useAppSelector(state => state.discover.filters[type]);
    const dispatch = useAppDispatch();

    const title = useMemo(() => {
        switch (type) {
            case 'boardGames':
                return 'Board Games';
            case 'darts':
                return 'Darts';
            case 'dogFriendly':
                return 'Dog Friendly';
            case 'foosball':
                return 'Foosball';
            case 'freeWifi':
                return 'Free Wifi';
            case 'garden':
                return 'Beer Garden';
            case 'kidFriendly':
                return 'Kid Friendly';
            case 'liveMusic':
                return 'Live Music';
            case 'liveSport':
                return 'Live Sport';
            case 'pool':
                return 'Pool Tables';
            case 'roof':
                return 'Rooftop';
            case 'sundayRoast':
                return 'Sunday Roast';
            case 'wheelchairAccessible':
                return 'Wheelchair Accessible';
        }
    }, [type]);

    const touchableStyle = useMemo(() => {
        if (val === 'unset') {
            return { backgroundColor: '#ffffff' };
        } else if (val === false) {
            return { backgroundColor: '#dc2626', borderColor: '#f87171' };
        } else {
            return { backgroundColor: '#84cc16', borderColor: '#bef264' };
        }
    }, [val]);

    const color = useMemo(() => {
        if (val === 'unset') {
            return undefined;
        } else {
            return '#fff';
        }
    }, [val]);

    const press = () => {
        if (val === 'unset') {
            dispatch(setFilter({ key: type, val: true }));
        } else if (val === false) {
            dispatch(setFilter({ key: type, val: 'unset' }));
        } else if (val === true) {
            dispatch(setFilter({ key: type, val: false }));
        }

        dispatch(fetchPubs({ amount: pubLoadAmount }));
    };

    return (
        <TouchableOpacity
            style={[styles.container, touchableStyle]}
            onPress={press}>
            <Text style={{ color }}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#A3A3A3',
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginHorizontal: 3,
    },
});
