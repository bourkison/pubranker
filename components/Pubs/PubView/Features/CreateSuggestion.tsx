import React, { RefObject, useCallback, useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
    Pressable,
} from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { FetchPubType } from '@/services/queries/pub';
import PubFeature from './PubFeature';
import { PRIMARY_COLOR } from '@/constants';
import { TablesInsert } from '@/types/schema';
import { supabase } from '@/services/supabase';

type CreateSuggestionProps = {
    pub: FetchPubType;
    expandModal: () => void;
    bottomSheetRef: RefObject<BottomSheetModal>;
};

const FEATURE_MARGIN_BOTTOM = 5;
const FEATURE_MARGIN_HORIZONTAL = 4;

export default function CreateSuggestion({
    pub,
    expandModal,
    bottomSheetRef,
}: CreateSuggestionProps) {
    const [isCreating, setIsCreating] = useState(false);

    const [reservable, setReservable] = useState<boolean | null>(null);
    const [freeWifi, setFreeWifi] = useState<boolean | null>(null);
    const [dogFriendly, setDogFriendly] = useState<boolean | null>(null);
    const [kidFriendly, setKidFriendly] = useState<boolean | null>(null);
    const [rooftop, setRooftop] = useState<boolean | null>(null);
    const [garden, setGarden] = useState<boolean | null>(null);
    const [poolTables, setPoolTables] = useState<boolean | null>(null);
    const [darts, setDarts] = useState<boolean | null>(null);
    const [foosball, setFoosball] = useState<boolean | null>(null);
    const [liveSport, setLiveSport] = useState<boolean | null>(null);
    const [wheelchairAccessible, setWheelchairAccessible] = useState<
        boolean | null
    >(null);

    const toggleFeature = (
        value: boolean | null,
        func: (val: boolean | null) => void,
    ) => {
        if (value === true) {
            return func(false);
        }

        if (value === false) {
            return func(null);
        }

        func(true);
    };

    const resetModal = useCallback(() => {
        setReservable(null);
        setFreeWifi(null);
        setDogFriendly(null);
        setKidFriendly(null);
        setRooftop(null);
        setGarden(null);
        setPoolTables(null);
        setDarts(null);
        setFoosball(null);
        setLiveSport(null);
        setWheelchairAccessible(null);

        bottomSheetRef.current?.dismiss();
    }, [bottomSheetRef]);

    const uploadSuggestion = useCallback(async () => {
        if (isCreating) {
            return;
        }

        setIsCreating(true);
        const uploads: TablesInsert<'suggestions'>[] = [];

        if (reservable !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'RESERVABLE',
                value: reservable,
            });
        }

        if (freeWifi !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'FREE_WIFI',
                value: freeWifi,
            });
        }

        if (dogFriendly !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'DOG_FRIENDLY',
                value: dogFriendly,
            });
        }

        if (kidFriendly !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'KID_FRIENDLY',
                value: kidFriendly,
            });
        }

        if (rooftop !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'ROOFTOP',
                value: rooftop,
            });
        }

        if (garden !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'GARDEN',
                value: garden,
            });
        }

        if (poolTables !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'POOL_TABLE',
                value: poolTables,
            });
        }

        if (darts !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'DARTS',
                value: darts,
            });
        }

        if (foosball !== null) {
            uploads.push({
                pub_id: pub.id,
                type: 'FOOSBALL',
                value: foosball,
            });
        }

        if (liveSport) {
            uploads.push({
                pub_id: pub.id,
                type: 'LIVE_SPORT',
                value: liveSport,
            });
        }

        if (wheelchairAccessible) {
            uploads.push({
                pub_id: pub.id,
                type: 'WHEELCHAIR_ACCESSIBLE',
                value: wheelchairAccessible,
            });
        }

        if (uploads.length === 0) {
            return;
        }

        const { error } = await supabase.from('suggestions').insert(uploads);

        if (error) {
            console.error(error);
            setIsCreating(false);
            return;
        }

        setIsCreating(false);
        resetModal();
    }, [
        darts,
        dogFriendly,
        foosball,
        freeWifi,
        wheelchairAccessible,
        liveSport,
        poolTables,
        garden,
        rooftop,
        reservable,
        kidFriendly,
        pub,
        isCreating,
        resetModal,
    ]);

    return (
        <>
            <TouchableOpacity
                onPress={expandModal}
                style={styles.makeSuggestionContainer}>
                <Text style={styles.makeSuggestionText}>Suggest</Text>
                <Octicons name="plus" />
            </TouchableOpacity>

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={[400]}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        pressBehavior="close"
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.5}
                    />
                )}>
                <View style={styles.bottomSheetContainer}>
                    <View>
                        <View>
                            <Text style={styles.headerText}>
                                We'd love your help.
                            </Text>
                            <Text style={styles.subheaderText}>
                                Suggest a feature to help others find this pub.
                            </Text>
                        </View>

                        <View style={styles.allFeaturesContainer}>
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Reservable"
                                input={reservable}
                                onPress={() =>
                                    toggleFeature(reservable, setReservable)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Free Wifi"
                                input={freeWifi}
                                onPress={() =>
                                    toggleFeature(freeWifi, setFreeWifi)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Dog Friendly"
                                input={dogFriendly}
                                onPress={() =>
                                    toggleFeature(dogFriendly, setDogFriendly)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Kid Friendly"
                                input={kidFriendly}
                                onPress={() =>
                                    toggleFeature(kidFriendly, setKidFriendly)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Rooftop"
                                input={rooftop}
                                onPress={() =>
                                    toggleFeature(rooftop, setRooftop)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Garden"
                                input={garden}
                                onPress={() => toggleFeature(garden, setGarden)}
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Pool Tables"
                                input={poolTables}
                                onPress={() =>
                                    toggleFeature(poolTables, setPoolTables)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Darts"
                                input={darts}
                                onPress={() => toggleFeature(darts, setDarts)}
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Foosball"
                                input={foosball}
                                onPress={() =>
                                    toggleFeature(foosball, setFoosball)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Live Sport"
                                input={liveSport}
                                onPress={() =>
                                    toggleFeature(liveSport, setLiveSport)
                                }
                            />
                            <PubFeature
                                hideOnNull={false}
                                marginBottom={FEATURE_MARGIN_BOTTOM}
                                marginHorizontal={FEATURE_MARGIN_HORIZONTAL}
                                title="Wheelchair Accessible"
                                input={wheelchairAccessible}
                                onPress={() =>
                                    toggleFeature(
                                        wheelchairAccessible,
                                        setWheelchairAccessible,
                                    )
                                }
                            />
                        </View>

                        <View style={styles.draughtContainer}>
                            <Text style={styles.subheaderText}>
                                Let us know what this pub had on draught.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.createButtonContainer}>
                        <Pressable
                            style={styles.createButton}
                            onPress={uploadSuggestion}>
                            <Text style={styles.createText}>Upload</Text>
                        </Pressable>
                    </View>
                </View>
            </BottomSheetModal>
        </>
    );
}

const styles = StyleSheet.create({
    makeSuggestionText: {
        fontSize: 12,
        marginRight: 2,
        fontWeight: '300',
    },
    makeSuggestionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    allFeaturesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    bottomSheetContainer: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        flex: 1,
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '600',
    },
    subheaderText: {
        fontSize: 12,
        marginTop: 2,
        color: 'rgba(0, 0, 0, 0.6)',
    },
    draughtContainer: {
        marginTop: 15,
    },
    createButtonContainer: {
        paddingHorizontal: 40,
        marginBottom: 40,
    },
    createButton: {
        marginTop: 25,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 4,
        borderRadius: 15,
    },
    createText: {
        color: '#FFF',
        fontWeight: '500',
        fontSize: 12,
    },
});
