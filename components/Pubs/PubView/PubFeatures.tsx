import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { PubSchema } from '@/types';
import PubMap from '@/components/Pubs/PubView/PubMap';
import DraughtBeersList from '@/components/Beers/DraughtBeersList';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import PubFeature from '@/components/Pubs/PubFeature';

type PubFeaturesProps = {
    pub: PubSchema;
};

export default function PubFeatures({ pub }: PubFeaturesProps) {
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Features</Text>
                <TouchableOpacity
                    style={styles.makeSuggestionContainer}
                    onPress={() => navigation.navigate('Suggestions', { pub })}>
                    <Text style={styles.makeSuggestionText}>Suggest</Text>
                    <Octicons name="plus" />
                </TouchableOpacity>
            </View>

            <View style={styles.featureList}>
                <PubFeature title="Reservable" input={pub.reservable} />
                <PubFeature title="Free Wifi" input={pub.free_wifi} />
                <PubFeature title="Dog Friendly" input={pub.dog_friendly} />
                <PubFeature title="Kid Friendly" input={pub.kid_friendly} />
                <PubFeature title="Rooftop" input={pub.rooftop} />
                <PubFeature title="Garden" input={pub.beer_garden} />
                <PubFeature title="Pool Tables" input={pub.pool_table} />
                <PubFeature title="Darts" input={pub.dart_board} />
                <PubFeature title="Foosball" input={pub.foosball_table} />
                <PubFeature title="Live Sport" input={pub.live_sport} />
                <PubFeature
                    title="Wheelchair Accessible"
                    input={pub.wheelchair_accessible}
                />
            </View>

            <DraughtBeersList pub={pub} />

            <PubMap pub={pub} />
        </>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: { fontSize: 16, fontFamily: 'Jost' },
    makeSuggestionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    makeSuggestionText: {
        fontSize: 12,
        marginRight: 2,
        fontWeight: '300',
    },
    featureList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    separator: {
        marginTop: 20,
        marginHorizontal: 30,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },
});
