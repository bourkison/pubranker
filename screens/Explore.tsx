import PubList from '@/components/Pubs/PubList';
import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import FiltersContainer from '@/components/Filters/FiltersContainer';
import { useAppSelector } from '@/store/hooks';
import SearchSuggestionList from '@/components/Filters/SearchSuggestionList';
import HomeMap from '@/components/Maps/HomeMap';
import ViewMapButton from '@/components/Maps/ViewMapButton';
// import { Ionicons } from '@expo/vector-icons';

const METERS_WITHIN = 1000;
const INITIAL_AMOUNT = 10;

export default function Explore() {
    // TODO: Move this into a separate component.
    const [isLoading, setIsLoading] = useState(false);
    const [pubs, setPubs] = useState<PubSchema[]>([]);

    const exploreState = useAppSelector(state => state.explore.exploreState);

    useEffect(() => {
        const initialLoad = async () => {
            setIsLoading(true);

            let l = await Location.getCurrentPositionAsync();

            const { data, error } = await supabase
                .rpc('nearby_pubs', {
                    order_lat: l.coords.latitude,
                    order_long: l.coords.longitude,
                    dist_lat: l.coords.latitude,
                    dist_long: l.coords.longitude,
                })
                .lte('dist_meters', METERS_WITHIN)
                .limit(INITIAL_AMOUNT);

            if (error) {
                console.error(error);
                return;
            }

            setPubs(data);
            setIsLoading(false);
        };

        initialLoad();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.filtersContainer}>
                <FiltersContainer />
            </View>
            {exploreState === 'search' ? (
                <View style={styles.suggestionsContainer}>
                    <SearchSuggestionList />
                </View>
            ) : undefined}
            {exploreState === 'map' ? (
                <View style={styles.mapContainer}>
                    <HomeMap />
                </View>
            ) : undefined}
            <ScrollView style={styles.container}>
                <View style={styles.sectionContainer}>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheading}>Top pubs nearby</Text>
                    </View>
                    <PubList pubs={pubs} isLoading={isLoading} />
                </View>
                <View style={styles.sectionContainer}>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheading}>
                            Top pubs in London
                        </Text>
                    </View>
                    <PubList pubs={pubs} isLoading={isLoading} />
                </View>
                <View style={styles.sectionContainer}>
                    <View style={styles.subheadingContainer}>
                        <Text style={styles.subheading}>
                            Top rated pubs by vibe nearby
                        </Text>
                    </View>
                    <PubList pubs={pubs} isLoading={isLoading} />
                </View>
            </ScrollView>
            {exploreState !== 'map' ? (
                <View style={styles.mapButtonContainer}>
                    <ViewMapButton />
                </View>
            ) : undefined}
            {/* {exploreState !== 'map' ? (
                <View style={styles.mapButtonContainer}>
                    <View>
                        <Ionicons name="map-outline" size={18} />
                    </View>
                    <View>
                        <Text>Map</Text>
                    </View>
                </View>
            ) : undefined} */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    filtersContainer: {
        marginBottom: 10,
    },
    suggestionsContainer: {
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    mapContainer: {
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    subheadingContainer: {
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    subheading: {
        fontSize: 24,
        fontWeight: '500',
        color: '#292935',
    },
    mapButtonContainer: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        flexDirection: 'row',
        zIndex: 11,
        height: 40,
        width: 40,
    },
});
