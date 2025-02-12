import React, { useCallback, useRef, useState } from 'react';
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

type CreateSuggestionProps = {
    pub: FetchPubType;
};

const FEATURE_MARGIN_BOTTOM = 5;
const FEATURE_MARGIN_HORIZONTAL = 4;

export default function CreateSuggestion({}: CreateSuggestionProps) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const expandModal = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

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
        console.log('toggle', value);

        if (value === true) {
            return func(false);
        }

        if (value === false) {
            return func(null);
        }

        func(true);
    };

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
                        <Pressable style={styles.createButton}>
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
