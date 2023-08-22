import { distanceString, roundToNearest } from '@/services';
import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { selectPub } from '@/store/slices/map';
import { useAppDispatch } from '@/store/hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';

type SelectedPubProps = {
    pub: PubSchema;
};

const IMAGE_SIZE = 128;
const BORDER_RADIUS = 5;

export default function SelectedPub({ pub }: SelectedPubProps) {
    const [imageUrl, setImageUrl] = useState('');

    const dispatch = useAppDispatch();
    const navigation =
        useNavigation<StackNavigationProp<MainNavigatorStackParamList>>();

    useEffect(() => {
        if (pub.photos[0]) {
            const url = supabase.storage
                .from('pubs')
                .getPublicUrl(pub.photos[0]);

            setImageUrl(url.data.publicUrl);

            console.log('SELECTED PUB:', url);
        } else {
            setImageUrl('');
        }
    }, [pub]);

    const deselectPub = () => {
        dispatch(selectPub(undefined));
    };

    return (
        <Pressable
            style={styles.container}
            onPress={() => navigation.navigate('PubView', { pub })}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : undefined}

            <View style={styles.contentContainer}>
                <View>
                    <Text style={styles.titleText}>{pub.name}</Text>
                    <Text style={styles.addressText}>{pub.address}</Text>
                </View>
                <View style={styles.bottomContentRowContainer}>
                    <Text style={styles.distText}>
                        {distanceString(pub.dist_meters)}
                    </Text>
                    <View style={styles.ratingsContainer}>
                        <Ionicons name="star" size={10} color="#FFD700" />
                        <Text style={styles.ratingsText}>
                            {roundToNearest(pub.overall_reviews, 0.1).toFixed(
                                1,
                            )}{' '}
                            ({pub.num_reviews})
                        </Text>
                    </View>
                </View>
            </View>

            <Pressable
                style={styles.closeButtonContainer}
                onPress={deselectPub}>
                <Text style={styles.closeButtonText}>x</Text>
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS,
        backgroundColor: '#fff',
        width: '100%',
        height: IMAGE_SIZE,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.1,
        position: 'relative',
    },
    image: {
        flex: 1,
        flexBasis: IMAGE_SIZE,
        flexGrow: 0,
        flexShrink: 0,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderTopLeftRadius: BORDER_RADIUS,
        borderBottomRightRadius: BORDER_RADIUS,
    },
    contentContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 7,
        justifyContent: 'space-between',
    },
    titleText: {
        fontWeight: '600',
    },
    addressText: {
        fontWeight: '300',
        fontSize: 10,
        paddingTop: 3,
    },
    bottomContentRowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    distText: {
        fontWeight: '300',
        fontSize: 10,
        paddingTop: 3,
    },
    ratingsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingsText: {
        fontWeight: '300',
        fontSize: 10,
        paddingTop: 3,
        marginLeft: 2,
    },
    closeButtonContainer: {
        position: 'absolute',
        top: 5,
        left: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: { color: '#fff' },
});
