import { supabase } from '@/services/supabase';
import { ListCollectionType } from '@/services/queries/collections';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Pressable,
} from 'react-native';
import UserAvatar from '../User/UserAvatar';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const NO_IMAGE = require('@/assets/noimage.png');

type CollectionListItemProps = {
    collection: ListCollectionType;
    onPress: () => void;
};

const IMAGE_ASPECT_RATIO = 1.3333;
const IMAGE_WIDTH = 100;

const DESCRIPTION_LINES_AMOUNT = 5;

const PRIVACY_ICON_SIZE = 12;

export default function CollectionListItem({
    collection,
    onPress,
}: CollectionListItemProps) {
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

    useEffect(() => {
        const images: (string | null)[] = [];

        collection.collection_items.forEach(collectionItem => {
            if (collectionItem.pub.primary_photo) {
                const url = supabase.storage
                    .from('pubs')
                    .getPublicUrl(collectionItem.pub.primary_photo);

                images.push(url.data.publicUrl);
            } else {
                images.push(null);
            }
        });

        setImageUrls(images);
    }, [collection]);

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={onPress}
            activeOpacity={1}>
            <View>
                <View style={styles.headerContainer}>
                    <Text style={styles.nameText}>{collection.name}</Text>
                    <Text style={styles.countText}>
                        {collection.pubs_count[0].count}{' '}
                        {collection.pubs_count[0].count === 1 ? 'pub' : 'pubs'}
                    </Text>
                </View>

                <ScrollView
                    horizontal={true}
                    contentContainerStyle={styles.scrollableContainer}
                    showsHorizontalScrollIndicator={false}>
                    <Pressable style={styles.imageContainer}>
                        {imageUrls.map((image, index) => (
                            <View key={index}>
                                <Image
                                    source={image ? { uri: image } : NO_IMAGE}
                                    style={[
                                        styles.image,
                                        {
                                            width: IMAGE_WIDTH,
                                            height:
                                                IMAGE_WIDTH /
                                                IMAGE_ASPECT_RATIO,
                                        },
                                    ]}
                                />
                            </View>
                        ))}
                    </Pressable>
                </ScrollView>

                {collection.description ? (
                    <View style={styles.descriptionContainer}>
                        <Text
                            style={styles.descriptionText}
                            numberOfLines={DESCRIPTION_LINES_AMOUNT}>
                            {collection.description}
                        </Text>
                    </View>
                ) : undefined}

                <View style={styles.bottomContainer}>
                    <View style={styles.userContainer}>
                        <UserAvatar
                            size={20}
                            photo={collection.user.profile_photo || ''}
                        />

                        <Text style={styles.userNameText}>
                            {collection.user.username}
                        </Text>
                    </View>

                    <View style={styles.privacyContainer}>
                        {collection.public === 'PRIVATE' ? (
                            <View style={styles.privacyItem}>
                                <Text style={styles.privacyItemText}>
                                    Private
                                </Text>
                                <Entypo
                                    name="lock"
                                    size={PRIVACY_ICON_SIZE - 2}
                                    color="#000"
                                />
                            </View>
                        ) : collection.public === 'FRIENDS_ONLY' ? (
                            <View style={styles.privacyItem}>
                                <Text style={styles.privacyItemText}>
                                    Friends only
                                </Text>
                                <MaterialIcons
                                    name="people"
                                    size={PRIVACY_ICON_SIZE}
                                    color="#000"
                                />
                            </View>
                        ) : (
                            <View style={styles.privacyItem}>
                                <Text style={styles.privacyItemText}>
                                    Public
                                </Text>
                                <Entypo
                                    name="globe"
                                    size={PRIVACY_ICON_SIZE - 2}
                                    color="#000"
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingTop: 25,
        paddingBottom: 15,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginBottom: 15,
    },
    nameText: {
        fontSize: 14,
        fontWeight: '500',
        letterSpacing: -0.2,
    },
    countText: {
        fontSize: 12,
        fontWeight: '300',
        letterSpacing: -0.2,
    },
    scrollableContainer: {
        paddingHorizontal: 30,
    },
    imageContainer: {
        flexDirection: 'row',
    },
    image: {
        borderRadius: 3,
    },
    descriptionContainer: {
        paddingHorizontal: 30,
        marginTop: 15,
    },
    descriptionText: {
        fontSize: 12,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 30,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userNameText: {
        fontSize: 12,
        marginLeft: 3,
    },
    privacyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    privacyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    privacyItemText: {
        fontSize: 10,
        fontWeight: '300',
        letterSpacing: -0.4,
        marginRight: 3,
    },
});
