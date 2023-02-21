import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPubs } from '@/store/slices/discoverPubs';
import React, { useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import DiscoverPub from '@/components/Pubs/DiscoverPub';

export default function BottomBarDiscover() {
    const dispatch = useAppDispatch();

    const pubs = useAppSelector(state => state.discoverPubs.pubs);

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
            <View>
                <Text style={styles.subHeading}>Results</Text>
                <View>
                    {pubs.map(pub => (
                        <DiscoverPub pub={pub} key={pub.id} />
                    ))}
                </View>
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
