import { FAIL_COLOR, SUCCESS_COLOR } from '@/constants';
import { UserType } from '@/services/queries/user';
import { supabase } from '@/services/supabase';
import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Sortable from 'react-native-sortables';

type SettingsFavouritesProps = {
    favourites: UserType['favourites'];
    onRemove: (index: number) => void;
    addFavourite: (pub: {
        id: number;
        name: string;
        primary_photo: string | null;
    }) => void;
    setFavourites: (favourites: UserType['favourites']) => void;
};

const NO_IMAGE = require('@/assets/noimage.png');
const MAX_FAVOURITES = 3;
const IMAGE_PADDING = 2;

export default function SettingsFavourites({
    favourites,
    onRemove,
    addFavourite,
    setFavourites,
}: SettingsFavouritesProps) {
    const [elementWidth, setElementWidth] = useState(0);
    const navigation = useNavigation();

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

    const { showActionSheetWithOptions } = useActionSheet();

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

    const deleteFavourite = useCallback(
        async (index: number) => {
            const favouriteId = favourites[index].id;

            if (!favouriteId) {
                console.error('No favourite ID');
                return;
            }

            const { error } = await supabase
                .from('favourites')
                .delete()
                .eq('id', favouriteId);

            if (error) {
                console.error(error);
                return;
            }

            onRemove(index);
        },
        [onRemove, favourites],
    );

    return (
        <View style={styles.container}>
            <View
                style={styles.pubsContainer}
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => setElementWidth(width)}>
                <Sortable.Grid
                    columns={3}
                    itemEntering={undefined}
                    itemExiting={undefined}
                    hapticsEnabled={true}
                    data={favourites}
                    onDragEnd={params => setFavourites(params.data)}
                    renderItem={({ item, index }) => (
                        <View
                            key={item.id}
                            style={[
                                styles.pubContainer,
                                { width: pubElementWidth },
                            ]}>
                            <Pressable
                                style={styles.removeButton}
                                onPress={() =>
                                    showActionSheetWithOptions(
                                        {
                                            options: ['Remove', 'Cancel'],
                                            cancelButtonIndex: 1,
                                            tintColor: FAIL_COLOR,
                                            cancelButtonTintColor: '#000',
                                        },
                                        selected => {
                                            if (selected === 0) {
                                                deleteFavourite(index);
                                            }
                                        },
                                    )
                                }>
                                <Text style={styles.removeButtonText}>x</Text>
                            </Pressable>

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

                            <Text style={styles.pubName}>{item.pubs.name}</Text>
                        </View>
                    )}
                />
                {favourites.length < 3 && (
                    <View
                        style={[
                            styles.pubContainer,
                            { width: pubElementWidth },
                        ]}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate('SelectPub', {
                                    header: 'Select a pub',
                                    excludedIds: favourites.map(
                                        favourite => favourite.pubs.id,
                                    ),
                                    onAdd: pub => addFavourite(pub),
                                })
                            }
                            style={[
                                styles.addFavourite,
                                {
                                    width: pubImageWidth,
                                    height: pubImageHeight,
                                    marginLeft:
                                        (3 - favourites.length) *
                                        -(2 * pubElementWidth),
                                },
                            ]}>
                            <AntDesign
                                name="pluscircleo"
                                size={32}
                                color={SUCCESS_COLOR + 'aa'}
                            />
                        </Pressable>
                    </View>
                )}
            </View>

            <Text style={styles.hintText}>
                Hold and drag images to reorder.
            </Text>
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
    pubsContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    pubContainer: {
        zIndex: 1,
        alignItems: 'center',
    },
    pubImage: {
        borderRadius: 2,
        zIndex: 1,
    },
    pubName: {
        paddingHorizontal: 2,
        marginTop: 2,
        fontSize: 10,
        textAlign: 'center',
    },
    removeButton: {
        position: 'absolute',
        top: -5,
        right: 0,
        backgroundColor: 'white',
        height: 18,
        width: 18,
        borderRadius: 10,
        zIndex: 99,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 0,
        },
    },
    removeButtonText: {
        fontSize: 12,
    },
    addFavourite: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        borderColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    hintText: {
        fontSize: 10,
        marginTop: 15,
    },
});
