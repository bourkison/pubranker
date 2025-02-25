import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { checkIfOpen, distanceString, roundToNearest } from '@/services';
import { timeString } from '@/services';
import * as Location from 'expo-location';
import { showLocation } from 'react-native-map-link';
import { FetchPubType } from '@/services/queries/pub';
import { useNavigation } from '@react-navigation/native';

type TopBarPubProps = {
    pub: FetchPubType;
    distMeters: number;
};

export default function PubTopBar({ pub, distMeters }: TopBarPubProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [nextOpenCloseTime, setNextOpenCloseTime] = useState('');

    const pubLocation = pub.location;
    const [userLocation, setUserLocation] = useState<
        Location.LocationObject | undefined
    >(undefined);

    const navigation = useNavigation();

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

    useEffect(() => {
        const { isOpen: o, nextHours } = checkIfOpen(pub.opening_hours);

        setIsOpen(o);

        if (o) {
            setNextOpenCloseTime(
                `Until ${timeString(nextHours.format('HHmm'))}`,
            );
        } else {
            setNextOpenCloseTime(
                `Opens ${nextHours.format('ddd')} ${timeString(
                    nextHours.format('HHmm'),
                )}`,
            );
        }
    }, [pub, isOpen]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.column}
                onPress={() =>
                    navigation.navigate('PubHome', {
                        screen: 'PubReviewsView',
                        params: { pubId: pub.id },
                    })
                }>
                <View style={styles.reviewColumnContainer}>
                    <Ionicons name="star" />
                    <Text style={styles.reviewText}>
                        {roundToNearest(pub.rating, 0.1).toFixed(1)} (
                        {pub.num_reviews[0].count})
                    </Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.column}>
                {isOpen ? (
                    <Text style={styles.openText}>Open</Text>
                ) : (
                    <Text style={styles.closedText}>Closed</Text>
                )}
                <Text style={styles.nextOpenCloseTime}>
                    {nextOpenCloseTime}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.column}
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
                <View style={styles.directionsColumnContainer}>
                    <FontAwesome name="map-marker" size={18} />
                    <Text style={styles.directionsText}>Directions</Text>
                    <Text style={styles.distanceText}>
                        {distanceString(distMeters)}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 15,
        flexDirection: 'row',
    },
    column: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    reviewColumnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewText: { marginLeft: 3 },
    openText: {
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#16A34A',
    },
    closedText: {
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#dc2626',
    },
    nextOpenCloseTime: {
        fontSize: 12,
        fontWeight: '300',
    },
    directionsColumnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    directionsText: {
        fontSize: 10,
    },
    distanceText: {
        fontSize: 8,
        fontWeight: '300',
    },
});
