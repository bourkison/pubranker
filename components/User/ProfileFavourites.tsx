import { UserType } from '@/services/queries/user';
import { supabase } from '@/services/supabase';
import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

type ProfileFavouritesProps = {
    favourites: UserType['favourites'];
};

const NO_IMAGE = require('@/assets/noimage.png');
const MAX_FAVOURITES = 3;
const IMAGE_PADDING = 2;

export default function ProfileFavourites({
    favourites,
}: ProfileFavouritesProps) {
    const navigation = useNavigation();

    const [elementWidth, setElementWidth] = useState(0);

    const pubElementWidth = useMemo<number>(
        () => elementWidth / MAX_FAVOURITES,
        [elementWidth],
    );

    const pubImageWidth = useMemo<number>(
        () => pubElementWidth - 2 * IMAGE_PADDING,
        [pubElementWidth],
    );

    const pubImageHeight = useMemo<number>(
        () => pubImageWidth / 1,
        [pubImageWidth],
    );

    const images = useMemo<string[]>(
        () =>
            favourites.map(favourite => {
                if (favourite.pubs.primary_photo) {
                    return supabase.storage
                        .from('pubs')
                        .getPublicUrl(favourite.pubs.primary_photo).data
                        .publicUrl;
                }

                return '';
            }),
        [favourites],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Favourites</Text>

            <View
                style={styles.pubsContainer}
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => setElementWidth(width)}>
                {favourites.map((favourite, index) => (
                    <Pressable
                        key={favourite.id}
                        style={[
                            styles.pubContainer,
                            { width: pubElementWidth },
                        ]}
                        onPress={() => {
                            const pushAction = StackActions.push('PubHome', {
                                screen: 'PubView',
                                params: {
                                    pubId: favourite.pubs.id,
                                },
                            });
                            navigation.dispatch(pushAction);
                        }}>
                        <Image
                            source={
                                images[index]
                                    ? { uri: images[index] }
                                    : NO_IMAGE
                            }
                            style={[
                                styles.pubImage,
                                {
                                    width: pubImageWidth,
                                    height: pubImageHeight,
                                },
                            ]}
                        />

                        <Text style={styles.pubName}>
                            {favourite.pubs.name}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
        paddingVertical: 15,
    },
    headerText: {
        fontSize: 16,
        fontFamily: 'Jost',
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    pubsContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    pubContainer: {},
    pubImage: {
        borderRadius: 2,
    },
    pubName: {
        paddingHorizontal: 2,
        marginTop: 2,
        fontSize: 10,
        textAlign: 'center',
    },
});
