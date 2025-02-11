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

const NO_IMAGE = require('@/assets/noimage.png');

type CollectionListItemProps = {
    collection: ListCollectionType;
    onPress: () => void;
};

const IMAGE_ASPECT_RATIO = 1.3333;
const IMAGE_WIDTH = 100;

export default function CollectionListItem({
    collection,
    onPress,
}: CollectionListItemProps) {
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

    useEffect(() => {
        const images: (string | null)[] = [];

        collection.pubs.forEach(pub => {
            if (pub.primary_photo) {
                const url = supabase.storage
                    .from('pubs')
                    .getPublicUrl(pub.primary_photo);

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
                        <Text style={styles.descriptionText}>
                            {collection.description}
                        </Text>
                    </View>
                ) : undefined}

                <View style={styles.userContainer}>
                    <UserAvatar
                        size={20}
                        photo={collection.user.profile_photo || ''}
                    />

                    <Text style={styles.userNameText}>
                        {collection.user.username}
                    </Text>
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
        marginBottom: 30,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
    },
    countText: {
        fontSize: 12,
        fontWeight: '300',
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
        marginTop: 30,
    },
    descriptionText: {
        fontSize: 12,
    },
    userContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    userNameText: {
        fontSize: 12,
        marginLeft: 3,
    },
});
