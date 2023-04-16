import {
    BottomSheetStackParamList,
    SelectedPub,
} from '@/nav/BottomSheetNavigator';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import {
    averageReviews,
    checkIfOpen,
    distanceString,
    parseOpeningHours,
    roundToNearest,
} from '@/services';
import { timeString } from '@/services';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type TopBarPubProps = {
    pub: SelectedPub;
};

export default function TopBarPub({ pub }: TopBarPubProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [nextOpenCloseTime, setNextOpenCloseTime] = useState('');

    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    useEffect(() => {
        const openingHours = parseOpeningHours(pub.opening_hours);
        const { isOpen: o, nextHours } = checkIfOpen(openingHours);

        setIsOpen(o);

        if (o) {
            setNextOpenCloseTime(
                `Until ${timeString(nextHours.format('HHmm'))}`,
            );
        } else {
            setNextOpenCloseTime(
                `Opens ${nextHours.format('ddd')} ${timeString(
                    nextHours.format('HHmm'),
                )}`,
            );
        }
    }, [pub, isOpen]);

    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <View style={styles.reviewColumnContainer}>
                    <Ionicons name="star" />
                    <Text style={styles.reviewText}>
                        {roundToNearest(
                            averageReviews(
                                pub.review_beer,
                                pub.review_food,
                                pub.review_location,
                                pub.review_music,
                                pub.review_service,
                                pub.review_vibe,
                            ),
                            0.1,
                        ).toFixed(1)}{' '}
                        ({pub.num_reviews})
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={styles.column}
                onPress={() => navigation.navigate('OpeningHours', { pub })}>
                {isOpen ? (
                    <Text style={styles.openText}>Open</Text>
                ) : (
                    <Text style={styles.closedText}>Closed</Text>
                )}
                <Text style={styles.nextOpenCloseTime}>
                    {nextOpenCloseTime}
                </Text>
            </TouchableOpacity>
            <View style={styles.column}>
                <View style={styles.directionsColumnContainer}>
                    <FontAwesome name="map-marker" size={18} />
                    <Text style={styles.directionsText}>Directions</Text>
                    <Text style={styles.distanceText}>
                        {distanceString(pub.dist_meters)}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 15,
        flexDirection: 'row',
    },
    column: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    reviewColumnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewText: { marginLeft: 3 },
    openText: {
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#16A34A',
    },
    closedText: {
        fontWeight: '600',
        textTransform: 'uppercase',
        color: '#dc2626',
    },
    nextOpenCloseTime: {
        fontSize: 12,
        fontWeight: '300',
    },
    directionsColumnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    directionsText: {
        fontSize: 10,
    },
    distanceText: {
        fontSize: 8,
        fontWeight: '300',
    },
});
