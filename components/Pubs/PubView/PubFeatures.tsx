import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { PubSchema } from '@/types';
import PubMap from '@/components/Pubs/PubView/PubMap';

type PubFeaturesProps = {
    pub: PubSchema;
};

type FeatureProps = {
    title: string;
    input: boolean | null;
};

const TRUE_COLOR = '#000';
const FALSE_COLOR = '#A3A3A3';

function Feature({ input, title }: FeatureProps) {
    if (input === null) {
        return null;
    }

    return (
        <View
            style={[
                styles.featureContainer,
                input
                    ? styles.trueFeatureContainer
                    : styles.falseFeatureContainer,
            ]}>
            {input ? (
                <Octicons name="check" size={12} color={TRUE_COLOR} />
            ) : (
                <Octicons name="x" size={12} color={FALSE_COLOR} />
            )}
            <Text
                style={[
                    styles.featureText,
                    input ? styles.trueFeature : styles.falseFeature,
                ]}>
                {title}
            </Text>
        </View>
    );
}

export default function PubFeatures({ pub }: PubFeaturesProps) {
    return (
        <>
            <View style={styles.featureList}>
                <Feature title="Reservable" input={pub.reservable} />
                <Feature title="Free Wifi" input={pub.free_wifi} />
                <Feature title="Dog Friendly" input={pub.dog_friendly} />
                <Feature title="Kid Friendly" input={pub.kid_friendly} />
                <Feature title="Rooftop" input={pub.rooftop} />
                <Feature title="Garden" input={pub.beer_garden} />
                <Feature title="Pool Tables" input={pub.pool_table} />
                <Feature title="Darts" input={pub.dart_board} />
                <Feature title="Foosball" input={pub.foosball_table} />
                <Feature title="Live Sport" input={pub.live_sport} />
                <Feature
                    title="Wheelchair Accessible"
                    input={pub.wheelchair_accessible}
                />
            </View>

            <PubMap pub={pub} />

            <View style={styles.separator} />
        </>
    );
}
const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 25,
    },
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 5,
        paddingVertical: 2,
        paddingHorizontal: 5,
    },
    trueFeatureContainer: {
        borderColor: TRUE_COLOR,
    },
    falseFeatureContainer: {
        borderColor: FALSE_COLOR,
    },
    featureText: {
        fontSize: 12,
    },
    trueFeature: {
        marginLeft: 3,
    },
    falseFeature: {
        marginLeft: 3,
        color: '#a3a3a3',
        fontFamily: 'JostLight',
    },
    featureList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        marginTop: 25,
    },
    separator: {
        marginHorizontal: 30,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },
});
