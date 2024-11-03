import { supabase } from '@/services/supabase';
import { ListCollectionType } from '@/types/collections';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';

const NO_IMAGE = require('@/assets/noimage.png');

type CollectionListItemProps = {
    collection: ListCollectionType;
};

const IMAGE_HORIZONTAL_MARGINS = 3;
const IMAGE_VERTICAL_MARGINS = 1;

export default function CollectionListItem({
    collection,
}: CollectionListItemProps) {
    const [containerWidth, setContainerWidth] = useState(0);
    const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

    const navigation =
        useNavigation<StackNavigationProp<SavedNavigatorStackParamList>>();

    const primaryImageDimensions = useMemo(
        () => (containerWidth / 3) * 2 - IMAGE_HORIZONTAL_MARGINS,
        [containerWidth],
    );

    const secondaryImageDimensions = useMemo(
        () => primaryImageDimensions / 2 - IMAGE_VERTICAL_MARGINS,
        [primaryImageDimensions],
    );

    const halfImageDimensions = useMemo(
        () => containerWidth / 2 - IMAGE_HORIZONTAL_MARGINS,
        [containerWidth],
    );

    useEffect(() => {
        const images: (string | null)[] = [];

        collection.pubs.forEach((pub, index) => {
            if (index > 2) {
                return;
            }

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

    const Images = useMemo<React.JSX.Element>(() => {
        if (imageUrls.length === 0) {
            return <View />;
        }

        if (imageUrls.length === 1) {
            return (
                <View style={styles.soloImageContainer}>
                    <Image
                        source={imageUrls[0] ? { uri: imageUrls[0] } : NO_IMAGE}
                        style={[
                            styles.image,
                            {
                                width: primaryImageDimensions,
                                height: primaryImageDimensions,
                            },
                        ]}
                    />
                </View>
            );
        }

        if (imageUrls.length === 2) {
            return (
                <>
                    <Image
                        source={imageUrls[0] ? { uri: imageUrls[0] } : NO_IMAGE}
                        style={[
                            styles.image,
                            styles.imageRightMargin,
                            {
                                width: halfImageDimensions,
                                height: halfImageDimensions,
                            },
                        ]}
                    />
                    <Image
                        source={imageUrls[1] ? { uri: imageUrls[1] } : NO_IMAGE}
                        style={[
                            styles.image,
                            styles.imageLeftMargin,
                            {
                                width: halfImageDimensions,
                                height: halfImageDimensions,
                            },
                        ]}
                    />
                </>
            );
        }

        return (
            <>
                <Image
                    source={imageUrls[0] ? { uri: imageUrls[0] } : NO_IMAGE}
                    style={[
                        styles.image,
                        styles.imageRightMargin,
                        {
                            width: primaryImageDimensions,
                            height: primaryImageDimensions,
                        },
                    ]}
                />

                <View>
                    <Image
                        source={imageUrls[1] ? { uri: imageUrls[1] } : NO_IMAGE}
                        style={[
                            styles.image,
                            styles.imageLeftMargin,
                            styles.imageBottomMargin,
                            {
                                width: secondaryImageDimensions,
                                height: secondaryImageDimensions,
                            },
                        ]}
                    />
                    <Image
                        source={imageUrls[2] ? { uri: imageUrls[2] } : NO_IMAGE}
                        style={[
                            styles.image,
                            styles.imageLeftMargin,
                            styles.imageTopMargin,
                            {
                                width: secondaryImageDimensions,
                                height: secondaryImageDimensions,
                            },
                        ]}
                    />
                </View>
            </>
        );
    }, [
        imageUrls,
        primaryImageDimensions,
        secondaryImageDimensions,
        halfImageDimensions,
    ]);

    return (
        <TouchableHighlight
            style={styles.container}
            underlayColor="#E5E7EB"
            onPress={() =>
                navigation.navigate('CollectionsView', {
                    collectionId: collection.id,
                })
            }
            activeOpacity={1}>
            <View
                onLayout={({
                    nativeEvent: {
                        layout: { width },
                    },
                }) => setContainerWidth(width)}>
                <View style={styles.imagesContainer}>{Images}</View>
                <Text style={styles.nameText}>{collection.name}</Text>
                <Text style={styles.countText}>
                    {collection.pubs_count[0].count}{' '}
                    {collection.pubs_count[0].count === 1 ? 'pub' : 'pubs'}
                </Text>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: 30,
    },
    image: {
        borderRadius: 4,
    },
    imagesContainer: {
        flexDirection: 'row',
    },
    imageRightMargin: {
        marginRight: IMAGE_HORIZONTAL_MARGINS,
    },
    imageLeftMargin: {
        marginRight: IMAGE_HORIZONTAL_MARGINS,
    },
    imageTopMargin: {
        marginTop: IMAGE_VERTICAL_MARGINS,
    },
    imageBottomMargin: {
        marginBottom: IMAGE_VERTICAL_MARGINS,
    },
    soloImageContainer: { alignItems: 'center', width: '100%' },
    nameText: {
        fontSize: 16,
        marginTop: 6,
    },
    countText: {
        fontSize: 12,
        marginTop: 2,
        fontWeight: '300',
    },
});
