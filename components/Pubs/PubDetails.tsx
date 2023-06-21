import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { parseLocation, parseOpeningHours } from '@/services';
import HoursCollapsible from '@/components/Utility/HoursCollapsible';
import url from 'url';
import { showLocation } from 'react-native-map-link';
import { DiscoveredPub } from '@/types';

type PubDetailsProps = {
    pub: DiscoveredPub;
};

export default function PubDetails({ pub }: PubDetailsProps) {
    const openingHours = parseOpeningHours(pub.opening_hours);

    const pubLocation = parseLocation(pub.location);
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);

    useEffect(() => {
        const setLocation = async () => {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                return;
            }

            const l = await Location.getCurrentPositionAsync();
            setUserLocation(l);
        };

        setLocation();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.sectionContainer}>
                <HoursCollapsible openingHours={openingHours} />
            </View>

            <View style={styles.sectionContainer}>
                <View>
                    <Text style={styles.header}>Website</Text>
                </View>
                <TouchableOpacity onPress={() => Linking.openURL(pub.website)}>
                    <Text>{url.parse(pub.website).hostname}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
                <View>
                    <Text style={styles.header}>Phone</Text>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        Linking.openURL(`tel://${pub.phone_number}`)
                    }>
                    <Text>{pub.phone_number}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.sectionContainer}>
                <View>
                    <Text style={styles.header}>Address</Text>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        showLocation({
                            latitude: pubLocation.coordinates[1],
                            longitude: pubLocation.coordinates[0],
                            googlePlaceId: pub.google_id,
                            sourceLatitude: userLocation?.coords.latitude,
                            sourceLongitude: userLocation?.coords.longitude,
                            directionsMode: 'public-transport',
                        })
                    }>
                    <Text>{pub.address}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 25,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    sectionContainer: {
        paddingHorizontal: 15,
        marginTop: 25,
    },
    header: {
        fontSize: 14,
        fontWeight: '500',
    },
});
