import React, { RefObject } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PubMap from '@/components/Pubs/PubView/PubMap';
import DraughtBeersList from '@/components/Beers/DraughtBeersList';
import { FetchPubType } from '@/services/queries/pub';
import CreateSuggestion from '@/components/Pubs/PubView/Features/CreateSuggestion';
import PubFeature from '@/components/Pubs/PubView/Features/PubFeature';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

type FeaturesSectionProps = {
    pub: FetchPubType;
    expandModal: () => void;
    featuresBottomSheetRef: RefObject<BottomSheetModal>;
};

export default function FeaturesSection({
    pub,
    expandModal,
    featuresBottomSheetRef,
}: FeaturesSectionProps) {
    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Features</Text>
                <CreateSuggestion
                    pub={pub}
                    expandModal={expandModal}
                    bottomSheetRef={featuresBottomSheetRef}
                />
            </View>

            <View style={styles.featureList}>
                <>
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
                </>
            </View>

            <DraughtBeersList pubId={pub.id} />

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
