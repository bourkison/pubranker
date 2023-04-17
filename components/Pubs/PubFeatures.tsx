import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { SelectedPub } from '@/store/slices/pub';

type PubFeaturesProps = {
    pub: SelectedPub;
};

type FeatureProps = {
    title: string;
    trueColor: string;
    falseColor: string;
    input: boolean | null;
};

function Feature({ input, trueColor, falseColor, title }: FeatureProps) {
    if (input === null) {
        return null;
    }

    return (
        <View style={styles.featureContainer}>
            {input ? (
                <Octicons name="check" size={12} color={trueColor} />
            ) : (
                <Octicons name="x" size={12} color={falseColor} />
            )}
            <Text style={input ? styles.trueFeature : styles.falseFeature}>
                {title}
            </Text>
        </View>
    );
}

export default function PubFeatures({ pub }: PubFeaturesProps) {
    return (
        <View>
            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Features</Text>
                <View style={styles.featureList}>
                    <Feature
                        title="Reservable"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.reservable}
                    />
                    <Feature
                        title="Free Wifi"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.free_wifi}
                    />
                    <Feature
                        title="Dog Friendly"
                        trueColor="#000"
                        falseColor="#a3a3a3"
                        input={pub.dog_friendly}
                    />
                    <Feature
                        title="Kid Friendly"
                        trueColor="#000"
                        falseColor="#a3a3a3"
                        input={pub.kid_friendly}
                    />
                    <Feature
                        title="Rooftop"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.rooftop}
                    />
                    <Feature
                        title="Garden"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.beer_garden}
                    />
                </View>
            </View>

            <View style={[styles.section, styles.sectionMargin]}>
                <Text style={styles.sectionHeader}>Entertainment</Text>
                <View style={styles.featureList}>
                    <Feature
                        title="Pool Tables"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.pool_table}
                    />
                    <Feature
                        title="Darts"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.dart_board}
                    />
                    <Feature
                        title="Foosball"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.foosball_table}
                    />
                    <Feature
                        title="Live Sport"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.live_sport}
                    />
                </View>
            </View>

            <View style={[styles.section, styles.sectionMargin]}>
                <Text style={styles.sectionHeader}>Accessibility</Text>
                <View style={styles.featureList}>
                    <Feature
                        title="Wheelchair Accessible"
                        trueColor="#000"
                        falseColor="#A3A3A3"
                        input={pub.wheelchair_accessible}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 15,
        paddingTop: 10,
    },
    sectionHeader: {
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 10,
    },
    featureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        marginBottom: 3,
    },
    sectionMargin: {
        marginTop: 25,
    },
    trueFeature: {
        marginLeft: 10,
    },
    falseFeature: {
        fontWeight: '200',
        marginLeft: 10,
        color: '#a3a3a3',
    },
    featureList: { flexDirection: 'row', flexWrap: 'wrap' },
});
