import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { SelectedPub } from '@/nav/BottomSheetNavigator';

type PubFeaturesProps = {
    pub: SelectedPub;
};

const dictionary = {
    pool_table: {
        icon: <MaterialCommunityIcons name="billiards" size={18} />,
        title: 'Pool',
    },
    dart_board: {
        icon: <MaterialCommunityIcons name="bullseye" size={18} />,
        title: 'Darts',
    },
    foosball_table: {
        icon: <MaterialCommunityIcons name="soccer" size={18} />,
        title: 'Foosball',
    },
    reservable: {
        icon: <MaterialCommunityIcons name="book" size={18} />,
        title: 'Reservable',
    },
    dog_friendly: {
        icon: <MaterialCommunityIcons name="dog" size={18} />,
        title: 'Dog Friendly',
    },
    live_sport: {
        icon: <MaterialCommunityIcons name="television" size={18} />,
        title: 'Live Sport',
    },
    beer_garden: {
        icon: <MaterialCommunityIcons name="flower" size={18} />,
        title: 'Garden',
    },
    kid_friendly: {
        icon: <FontAwesome5 name="baby-carriage" size={18} />,
        title: 'Kid Friendly',
    },
    free_wifi: {
        icon: <MaterialCommunityIcons name="wifi" size={18} />,
        title: 'Free Wifi',
    },
    rooftop: {
        icon: <MaterialCommunityIcons name="home-roof" size={18} />,
        title: 'Rooftop',
    },
    wheelchair_accessible: {
        icon: <FontAwesome5 name="wheelchair" size={18} />,
        title: 'Accessible',
    },
};

type TDic = keyof typeof dictionary;

export default function PubFeatures({ pub }: PubFeaturesProps) {
    const getColor = (input: boolean) => {
        if (input) {
            return '#16A34A';
        } else {
            return '#dc2626';
        }
    };

    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                flexWrap: 'wrap',
            }}>
            {/* <View style={styles.pill}>
                {dictionary['pool_table'].icon}
                <Text style={styles.pillText}>
                    {dictionary['pool_table'].title}
                </Text>
            </View> */}
            {/* @ts-ignore */}
            {Object.keys(pub).map((k: TDic) => {
                if (dictionary[k] !== undefined && pub[k] !== null) {
                    return (
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            {/* {dictionary[k].icon} */}
                            <Text style={styles.pillText}>
                                {dictionary[k].title}
                            </Text>
                        </View>
                    );
                    // return (
                    //     <View
                    //         style={[
                    //             styles.pill,
                    //             { borderColor: getColor(pub[k]) },
                    //         ]}>
                    //         {dictionary[k].icon}
                    //         <Text
                    //             style={[
                    //                 styles.pillText,
                    //                 { color: getColor(pub[k]) },
                    //             ]}>
                    //             {dictionary[k].title}
                    //         </Text>
                    //     </View>
                    // );
                } else {
                    return undefined;
                }
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 25,
        marginBottom: 5,
        marginHorizontal: 5,
        borderWidth: 2,
    },
    pillText: {
        fontWeight: '300',
        marginLeft: 3,
        fontSize: 12,
    },
});
