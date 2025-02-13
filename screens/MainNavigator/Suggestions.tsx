import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/constants';
import { useActionSheet } from '@expo/react-native-action-sheet';
import PubFeature from '@/components/Pubs/PubView/Features/PubFeature';

export default function Suggestions({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'Suggestions'>) {
    const [reservable, setReservable] = useState(route.params.pub.reservable);
    const [freeWifi, setFreeWifi] = useState(route.params.pub.free_wifi);
    const [dogFriendly, setDogFriendly] = useState(
        route.params.pub.dog_friendly,
    );
    const [kidFriendly, setKidFriendly] = useState(
        route.params.pub.kid_friendly,
    );
    const [rooftop, setRooftop] = useState(route.params.pub.rooftop);
    const [garden, setGarden] = useState(route.params.pub.beer_garden);
    const [poolTables, setPoolTables] = useState(route.params.pub.pool_table);
    const [darts, setDarts] = useState(route.params.pub.dart_board);
    const [foosball, setFoosball] = useState(route.params.pub.foosball_table);
    const [liveSport, setLiveSport] = useState(route.params.pub.live_sport);
    const [wheelchairAccessible, setWheelchairAccessible] = useState(
        route.params.pub.wheelchair_accessible,
    );

    const { showActionSheetWithOptions } = useActionSheet();

    const toggleFeature = (
        value: boolean | null,
        func: (val: boolean | null) => void,
    ) => {
        console.log('toggle', value);

        if (value === true) {
            func(false);
        }

        if (value === false) {
            func(null);
        }

        func(true);
    };

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <Pressable
                    style={styles.button}
                    onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-outline"
                        color={PRIMARY_COLOR}
                        size={14}
                    />
                </Pressable>
                <Text style={styles.headerText}>{route.params.pub.name}</Text>
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        showActionSheetWithOptions(
                            {
                                options: [
                                    route.params.pub.saved ? 'Unsave' : 'Save',
                                    'Write Review',
                                    'Suggest an edit',
                                    'View on map',
                                    'Cancel',
                                ],
                                cancelButtonIndex: 4,
                                tintColor: PRIMARY_COLOR,
                                cancelButtonTintColor: PRIMARY_COLOR,
                            },
                            selected => {
                                if (selected === 2) {
                                    navigation.navigate('Suggestions', {
                                        pub: route.params.pub,
                                    });
                                }
                                console.log('select', selected);
                            },
                        )
                    }>
                    <SimpleLineIcons
                        name="options"
                        color={PRIMARY_COLOR}
                        size={14}
                    />
                </Pressable>
            </View>

            <View>
                <PubFeature
                    title="Reservable"
                    input={reservable}
                    onPress={() => toggleFeature(reservable, setReservable)}
                />
                <PubFeature
                    title="Free Wifi"
                    input={freeWifi}
                    onPress={() => toggleFeature(freeWifi, setFreeWifi)}
                />
                <PubFeature
                    title="Dog Friendly"
                    input={dogFriendly}
                    onPress={() => toggleFeature(dogFriendly, setDogFriendly)}
                />
                <PubFeature
                    title="Kid Friendly"
                    input={kidFriendly}
                    onPress={() => toggleFeature(kidFriendly, setKidFriendly)}
                />
                <PubFeature
                    title="Rooftop"
                    input={rooftop}
                    onPress={() => toggleFeature(rooftop, setRooftop)}
                />
                <PubFeature
                    title="Garden"
                    input={garden}
                    onPress={() => toggleFeature(garden, setGarden)}
                />
                <PubFeature
                    title="Pool Tables"
                    input={poolTables}
                    onPress={() => toggleFeature(poolTables, setPoolTables)}
                />
                <PubFeature
                    title="Darts"
                    input={darts}
                    onPress={() => toggleFeature(darts, setDarts)}
                />
                <PubFeature
                    title="Foosball"
                    input={foosball}
                    onPress={() => toggleFeature(foosball, setFoosball)}
                />
                <PubFeature
                    title="Live Sport"
                    input={liveSport}
                    onPress={() => toggleFeature(liveSport, setLiveSport)}
                />
                <PubFeature
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
    },
    button: {
        height: 28,
        width: 28,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
});
