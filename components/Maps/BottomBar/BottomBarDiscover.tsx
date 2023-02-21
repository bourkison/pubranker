import { useAppDispatch } from '@/store/hooks';
import { fetchPubs } from '@/store/slices/pubsNearMe';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BottomBarDiscover() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const f = async () => {
            await dispatch(fetchPubs());
        };

        f();
    }, [dispatch]);

    return (
        <View>
            <Text style={styles.title}>Discover Pubs Near You</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
});
