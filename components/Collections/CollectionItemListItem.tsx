import { GOLD_RATINGS_COLOR } from '@/constants';
import { roundToNearest } from '@/services';
import { CollectionType } from '@/services/queries/collections';
import { supabase } from '@/services/supabase';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TouchableHighlight,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as Haptics from 'expo-haptics';
import Animated, { LinearTransition } from 'react-native-reanimated';
import UserAvatar from '../User/UserAvatar';

type CollectionItemListItemProps = {
    collaborativeCollection: boolean;
    rankedCollection: boolean;
    collectionItem: CollectionType['collection_items'][number];
    saved: boolean;
    onSaveCommence?: (id: number) => void;
    onSaveComplete?: (success: boolean, id: number) => void;
    onUnsaveCommence?: (id: number) => void;
    onUnsaveComplete?: (success: boolean, id: number) => void;
    onRemove?: (id: number) => void;
    canEdit: boolean;
    index: number;
};

const ASPECT_RATIO = 1;
const WIDTH_PERCENTAGE = 0.3;

const NO_IMAGE = require('@/assets/noimage.png');

export default function CollectionItemListItem({
    collectionItem,
    collaborativeCollection,
    onSaveCommence,
    onSaveComplete,
    onUnsaveCommence,
    onUnsaveComplete,
    onRemove,
    canEdit,
    index,
    rankedCollection,
    saved,
}: CollectionItemListItemProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    const { showActionSheetWithOptions } = useActionSheet();
    const navigation = useNavigation();

    const IMAGE_WIDTH = useMemo<number>(
        () => containerWidth * WIDTH_PERCENTAGE,
        [containerWidth],
    );

    const image = useMemo(() => {
        if (!collectionItem.pub.primary_photo) {
            return NO_IMAGE;
        }

        return {
            uri: supabase.storage
                .from('pubs')
                .getPublicUrl(collectionItem.pub.primary_photo).data.publicUrl,
        };
    }, [collectionItem]);

    const toggleLike = useCallback(async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            setIsSaving(false);
            return;
        }

        if (!saved) {
            onSaveCommence && onSaveCommence(collectionItem.pub.id);

            const { error } = await supabase.from('saves').insert({
                pub_id: collectionItem.pub.id,
            });

            setIsSaving(false);

            if (error) {
                console.error(error);
                onSaveComplete && onSaveComplete(false, collectionItem.pub.id);
            }

            onSaveComplete && onSaveComplete(true, collectionItem.pub.id);
        } else {
            onUnsaveCommence && onUnsaveCommence(collectionItem.pub.id);

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', collectionItem.pub.id)
                .eq('user_id', userData.user.id);

            setIsSaving(false);

            if (error) {
                console.error(error);
                onUnsaveComplete &&
                    onUnsaveComplete(false, collectionItem.pub.id);
            }

            onUnsaveComplete && onUnsaveComplete(true, collectionItem.pub.id);
        }
    }, [
        isSaving,
        collectionItem,
        onSaveCommence,
        onSaveComplete,
        onUnsaveCommence,
        onUnsaveComplete,
        saved,
    ]);

    return (
        <Animated.View layout={LinearTransition}>
            <TouchableHighlight
                style={styles.container}
                underlayColor="#E5E7EB"
                onPress={() =>
                    navigation.navigate('PubView', {
                        pubId: collectionItem.pub.id,
                    })
                }
                onLongPress={() => {
                    if (!canEdit) {
                        return;
                    }

                    Haptics.impactAsync();

                    showActionSheetWithOptions(
                        {
                            options: ['Remove Pub', 'Cancel'],
                            cancelButtonIndex: 1,
                            tintColor: '#000',
                            cancelButtonTintColor: '#000',
                        },
                        selected => {
                            if (selected === 0) {
                                onRemove && onRemove(collectionItem.pub.id);
                            }
                        },
                    );
                }}>
                <View
                    style={styles.innerContainer}
                    onLayout={({
                        nativeEvent: {
                            layout: { width },
                        },
                    }) => setContainerWidth(width)}>
                    <View>
                        <Image
                            source={image}
                            style={[
                                styles.image,
                                {
                                    width: IMAGE_WIDTH,
                                    height: IMAGE_WIDTH / ASPECT_RATIO,
                                },
                            ]}
                        />

                        {rankedCollection && (
                            <View style={styles.rankedContainer}>
                                <Text style={styles.rankedText}>
                                    {index + 1}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={toggleLike}
                            disabled={isSaving}
                            style={[
                                styles.saveButton,
                                rankedCollection
                                    ? styles.rankedSaveButton
                                    : undefined,
                            ]}>
                            {saved ? (
                                <Ionicons
                                    name="heart"
                                    size={12}
                                    color="#dc2626"
                                />
                            ) : (
                                <Ionicons
                                    name="heart-outline"
                                    size={12}
                                    color="#dc2626"
                                />
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.infoContainer}>
                            <View style={styles.reviewContainer}>
                                <Ionicons
                                    name="star"
                                    size={12}
                                    color={GOLD_RATINGS_COLOR}
                                />
                                <Text style={styles.ratingText}>
                                    {roundToNearest(
                                        collectionItem.pub.rating,
                                        0.1,
                                    ).toFixed(1)}
                                </Text>
                                <Text style={styles.numReviewsText}>
                                    ({collectionItem.pub.num_reviews[0].count})
                                </Text>
                            </View>

                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>
                                    {collectionItem.pub.name}
                                </Text>
                            </View>
                            <View style={styles.addressContainer}>
                                <Text style={styles.addressText}>
                                    {collectionItem.pub.address}
                                </Text>
                            </View>
                        </View>

                        {collaborativeCollection && (
                            <View style={styles.userContainer}>
                                <UserAvatar
                                    photo={
                                        collectionItem.user.profile_photo || ''
                                    }
                                    size={18}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </TouchableHighlight>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingVertical: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankedContainer: {
        position: 'absolute',
        top: -5,
        left: -5,
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
    },
    rankedText: {
        fontSize: 12,
        fontWeight: '800',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    infoContainer: {
        paddingHorizontal: 2,
        marginLeft: 5,
    },
    reviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 3,
        color: '#292935',
        fontSize: 12,
        fontWeight: '500',
    },
    numReviewsText: {
        marginLeft: 3,
        color: '#292935',
        fontSize: 12,
        fontWeight: '200',
    },
    titleContainer: {
        marginTop: 4,
    },
    titleText: {
        fontSize: 16,
        color: '#292935',
        fontWeight: '600',
    },
    addressContainer: {
        marginTop: 4,
    },
    addressText: {
        fontSize: 10,
        color: '#292935',
        fontWeight: '300',
    },
    image: {
        borderRadius: 3,
    },
    saveButton: {
        height: 20,
        width: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 3,
        left: 3,
    },
    rankedSaveButton: { top: 'auto', bottom: 3 },
    userContainer: {
        height: '100%',
        flex: 1,
        alignItems: 'flex-end',
    },
});
