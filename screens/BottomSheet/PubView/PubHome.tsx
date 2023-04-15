import { distanceString, parseOpeningHours } from '@/services';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Octicons, Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deselectPub, toggleSave as toggleMapSave } from '@/store/slices/pub';
import { toggleSave } from '@/store/slices/saved';
import { toggleSave as toggleDiscoverSave } from '@/store/slices/discover';
import OpeningHours from '@/components/Pubs/OpeningHours';

import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import PubReviews from '@/components/Pubs/PubReviews';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

export default function PubHome({
    route,
    navigation,
}: StackScreenProps<BottomSheetStackParamList, 'PubHome'>) {
    const dispatch = useAppDispatch();
    const reference = useAppSelector(state => state.pub.selectedPubReference);

    const save = async () => {
        navigation.setParams({
            pub: {
                ...route.params.pub,
                saved: !route.params.pub.saved,
            },
        });

        dispatch(
            toggleSave({
                id: route.params.pub.id,
                saved: route.params.pub.saved,
            }),
        );
        dispatch(toggleMapSave());

        if (reference === 'discover') {
            dispatch(toggleDiscoverSave({ id: route.params.pub.id }));
        }
    };

    return (
        <BottomSheetScrollView>
            <View style={styles.headerContainer}>
                <View style={styles.titleSubTitleContainer}>
                    <Text style={styles.title}>{route.params.pub.name}</Text>
                    <Text style={styles.subtitle}>
                        {distanceString(route.params.pub.dist_meters)}
                    </Text>
                </View>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity style={styles.likeButton} onPress={save}>
                        {route.params.pub.saved ? (
                            <Ionicons name="heart" size={18} color="#dc2626" />
                        ) : (
                            <Ionicons
                                name="heart-outline"
                                size={18}
                                color="#dc2626"
                            />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            dispatch(deselectPub());
                            navigation.navigate('Discover');
                        }}
                        style={styles.closeButton}>
                        <Octicons name="x" color="#A3A3A3" size={18} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.descriptionContainer}>
                    <Text>{route.params.pub.google_overview}</Text>
                </View>
                <View>
                    <View style={styles.openingHoursContainer}>
                        <OpeningHours
                            openingHours={parseOpeningHours(
                                route.params.pub.opening_hours,
                            )}
                        />
                    </View>
                </View>

                <View style={styles.reviewsContainer}>
                    <PubReviews pub={route.params.pub} />
                </View>

                <View style={styles.reviewButtonContainer}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() =>
                            navigation.navigate('CreateReview', {
                                pub: route.params.pub,
                            })
                        }>
                        <Text style={styles.reviewButtonText}>
                            Review This Pub
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetScrollView>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        justifyContent: 'space-between',
    },
    contentContainer: {
        width: '100%',
    },
    titleSubTitleContainer: {
        marginLeft: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
    },
    subtitle: {
        fontSize: 16,
        color: '#A3A3A3',
    },
    buttonsContainer: {
        marginRight: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -10,
    },
    likeButton: {
        marginRight: 4,
    },
    closeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    descriptionContainer: {
        paddingHorizontal: 10,
        marginTop: 10,
    },
    openingHoursContainer: {
        maxWidth: 256,
        marginTop: 25,
    },
    reviewsContainer: {
        marginTop: 25,
    },
    reviewButtonContainer: {
        paddingHorizontal: 100,
        marginTop: 25,
    },
    reviewButton: {
        backgroundColor: '#2B5256',
        paddingVertical: 10,
        borderRadius: 5,
    },
    reviewButtonText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
