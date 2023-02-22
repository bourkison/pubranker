import { PubFilters } from '@/types';
import React, { useMemo, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type FilterItemProps = {
    type: keyof PubFilters;
};

export default function FilterItem({ type }: FilterItemProps) {
    const [val, setVal] = useState<PubFilters[typeof type]>('unset');

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
            setVal(true);
        } else if (val === false) {
            setVal('unset');
        } else if (val === true) {
            setVal(false);
        }
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
