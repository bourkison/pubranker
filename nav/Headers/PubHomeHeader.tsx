import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Octicons } from '@expo/vector-icons';
import { StackHeaderProps, StackNavigationProp } from '@react-navigation/stack';
import { parseLocation } from '@/services';
import { getBorough } from '@/services/geo';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetStackParamList } from '../BottomSheetNavigator';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deselectPub, toggleSave as toggleMapSave } from '@/store/slices/pub';
import { toggleSave } from '@/store/slices/saved';
import { toggleSave as toggleDiscoverSave } from '@/store/slices/discover';

export default function PubHomeHeader({}: StackHeaderProps) {
    const navigation =
        useNavigation<StackNavigationProp<BottomSheetStackParamList>>();

    const dispatch = useAppDispatch();

    const pub = useAppSelector(state => state.pub.selectedPub);

    const displayAddress = useMemo(() => {
        if (!pub) {
            return '';
        }

        return `${pub.address.split(', ')[0]}, ${getBorough(
            parseLocation(pub.location),
        )}`;
    }, [pub]);

    const save = async () => {
        if (pub) {
            navigation.setParams({
                pub: {
                    ...pub,
                    saved: !pub.saved,
                },
            });

            dispatch(
                toggleSave({
                    id: pub.id,
                    saved: pub.saved,
                }),
            );
            dispatch(toggleMapSave());
            dispatch(toggleDiscoverSave({ id: pub.id }));
        }
    };

    if (!pub) {
        return <View />;
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleSubTitleContainer}>
                <Text style={styles.title}>{pub.name}</Text>
                <Text style={styles.subtitle}>{displayAddress}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.likeButton} onPress={save}>
                    {pub.saved ? (
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
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOpacity: 1,
        paddingBottom: 10,
        elevation: 2,
        backgroundColor: 'white',
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
        fontSize: 12,
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
});
