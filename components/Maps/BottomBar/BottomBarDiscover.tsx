import { useAppDispatch } from '@/store/hooks';
import { fetchPubs } from '@/store/slices/pubsNearMe';
import React, { useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

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
            <View style={styles.searchBar}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search"
                    placeholderTextColor="#A3A3A3"
                />
            </View>
            <View>
                <Text style={styles.subHeading}>Filters</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        borderRadius: 7,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 10,
        marginHorizontal: 15,
    },
    searchInput: { width: '100%', paddingVertical: 8 },
    subHeading: {
        fontWeight: 'bold',
        color: '#A3A3A3',
        marginHorizontal: 15,
        marginTop: 15,
    },
});
