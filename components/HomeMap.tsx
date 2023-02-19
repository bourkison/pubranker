import React, { useEffect, useState } from 'react';

import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import MapStyle from '../mapStyle.json';
import { StyleSheet } from 'react-native';

export default function HomeMap() {
    const [location, setLocation] = useState<Location.LocationObject | null>(
        null,
    );

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                // TODO: Error.
                return;
            }

            let l = await Location.getCurrentPositionAsync();
            setLocation(l);
            console.log('LOCATION:', l);
        })();
    }, []);

    return (
        <MapView
            provider="google"
            showsUserLocation={true}
            style={styles.map}
            customMapStyle={MapStyle}
            initialRegion={
                location
                    ? {
                          latitude: location.coords.latitude,
                          longitude: location.coords.longitude,
                          latitudeDelta: 0.0082,
                          longitudeDelta: 0.0092,
                      }
                    : undefined
            }
        />
    );
}

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: '100%',
    },
});
