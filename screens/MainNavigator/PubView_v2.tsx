import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { FetchPubType, pubQuery } from '@/services/queries/pub';
import { supabase } from '@/services/supabase';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    useWindowDimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import * as Location from 'expo-location';
import { distance, point } from '@turf/turf';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { distanceString, roundToNearest } from '@/services';
import {
    GOLD_RATINGS_COLOR,
    PRIMARY_COLOR,
    PUB_HOME_IMAGE_ASPECT_RATIO,
} from '@/constants';
import Animated, {
    interpolateColor,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSharedCollectionContext } from '@/context/collectionContext';

const GRADIENT_HEIGHT = 128;

export default function PubView({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'PubView'>) {
    const [pub, setPub] = useState<FetchPubType>();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [distMeters, setDistMeters] = useState(0);

    const { width } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const { showActionSheetWithOptions } = useActionSheet();
    const { showAddToCollection } = useSharedCollectionContext();

    const scrollY = useSharedValue(0);

    const imageHeight = useMemo<number>(
        () => width / PUB_HOME_IMAGE_ASPECT_RATIO,
        [width],
    );

    const headerImage = useMemo<string>(() => {
        return supabase.storage.from('pubs').getPublicUrl('56/star_hd_1.png')
            .data.publicUrl;
        // if (pub?.primary_photo) {
        //     return supabase.storage.from('pubs').getPublicUrl(pub.primary_photo)
        //         .data.publicUrl;
        // }

        // return '';
    }, []);

    const saved = useMemo<boolean>(() => {
        if (!pub) {
            return false;
        }

        return pub.saved[0].count > 0;
    }, [pub]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            let userId = userData.user?.id || '';

            const { data, error } = await pubQuery(userId)
                .eq('id', route.params.pubId)
                .limit(1)
                .single();

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            // Have to ts-ignore below as typescript is not picking up
            // The functions in our query as valid columns.
            // @ts-ignore
            const p: FetchPubType = data as FetchPubType;

            // Next get the distance
            const l = await Location.getCurrentPositionAsync();

            setDistMeters(
                distance(
                    point([l.coords.longitude, l.coords.latitude]),
                    point(p.location.coordinates),
                    { units: 'meters' },
                ),
            );

            setIsLoading(false);
            setPub(p);
        })();
    }, [route]);

    const setSaved = useCallback(
        (s: boolean) => {
            if (!pub) {
                return;
            }

            setPub({ ...pub, saved: [{ count: s ? 1 : 0 }] });
        },
        [pub],
    );

    const toggleLike = useCallback(async () => {
        if (isSaving || !pub) {
            return;
        }

        setIsSaving(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            return;
        }

        if (!pub.saved) {
            setSaved(true);

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (!error) {
                showAddToCollection(pub.id);

                if (route.params.onSaveToggle) {
                    route.params.onSaveToggle(pub.id, true);
                }
            } else {
                setSaved(false);

                console.error(error);
            }
        } else {
            setSaved(false);

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            setIsSaving(false);

            if (!error) {
                if (route.params.onSaveToggle) {
                    route.params.onSaveToggle(pub.id, false);
                }
            } else {
                setSaved(true);
                console.error(error);
            }
        }
    }, [pub, isSaving, showAddToCollection, route, setSaved]);

    // ------- ANIMATED -----------

    const onFlatListScroll = useAnimatedScrollHandler(
        event => (scrollY.value = event.contentOffset.y),
    );

    const rButtonStyle = useAnimatedStyle(() => {
        const pointFullBackground = imageHeight - insets.top;
        -styles.button.height;
        const pointStartInterpolation = pointFullBackground - 100;

        console.log(
            'scr',
            scrollY.value,
            'pfb',
            pointFullBackground,
            'psi',
            pointStartInterpolation,
        );

        return {
            backgroundColor: interpolateColor(
                scrollY.value,
                [pointStartInterpolation, pointFullBackground],
                ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.99)'],
                // [crossOverPoint - 25, crossOverPoint + 50],
                // ['rgba(255, 255, 255, 0.99)', 'rgba(255, 255, 255, 0)'],
                'RGB',
            ),
        };
    });

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!pub) {
        return (
            <View>
                <Text>404 No pub</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: headerImage }}
                    style={{
                        width: width,
                        height: width / PUB_HOME_IMAGE_ASPECT_RATIO,
                    }}
                />
            </View>

            {/* This is our absolute positioned buttons */}
            <Animated.View
                style={[
                    rButtonStyle,
                    styles.buttonsContainer,
                    { paddingTop: insets.top + 5 },
                ]}>
                <Pressable
                    style={styles.button}
                    onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-outline"
                        color={PRIMARY_COLOR}
                        size={14}
                    />
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() =>
                        showActionSheetWithOptions(
                            {
                                options: [
                                    saved ? 'Unsave' : 'Save',
                                    'Write Review',
                                    'Suggest an edit',
                                    'View on map',
                                    'Cancel',
                                ],
                                cancelButtonIndex: 4,
                                tintColor: PRIMARY_COLOR,
                                cancelButtonTintColor: PRIMARY_COLOR,
                            },
                            selected => {
                                if (selected === 0) {
                                    toggleLike();
                                    return;
                                }

                                if (selected === 2) {
                                    navigation.navigate('Suggestions', {
                                        pub: pub,
                                    });
                                }
                            },
                        )
                    }>
                    <SimpleLineIcons
                        name="options"
                        color={PRIMARY_COLOR}
                        size={14}
                    />
                </Pressable>
            </Animated.View>
            <Animated.FlatList
                data={Array(1)}
                onScroll={onFlatListScroll}
                ListHeaderComponent={
                    <>
                        {/* This drops the content by the image height allowing  */}
                        {/* us to see the image */}
                        <View
                            style={[
                                styles.transparentImage,
                                {
                                    width: width,
                                    height: imageHeight - GRADIENT_HEIGHT,
                                },
                            ]}
                        />
                        {/* Gradient of the pub title */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
                            style={styles.gradient}>
                            <View style={styles.headerContainer}>
                                <View style={styles.headerContentContainer}>
                                    <Text style={styles.titleText}>
                                        {pub.name}
                                    </Text>
                                    <View style={styles.bottomRowContainer}>
                                        <View style={styles.ratingsContainer}>
                                            <Ionicons
                                                name="star"
                                                size={10}
                                                color={GOLD_RATINGS_COLOR}
                                            />
                                            <Text style={styles.ratingsText}>
                                                {roundToNearest(
                                                    pub.rating,
                                                    0.1,
                                                ).toFixed(1)}{' '}
                                                ({pub.num_reviews[0].count})
                                            </Text>
                                        </View>
                                        <View style={styles.distanceContainer}>
                                            <Text
                                                numberOfLines={1}
                                                style={styles.distanceText}>
                                                {distanceString(distMeters)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.heartContainer}>
                                    <TouchableOpacity>
                                        {saved ? (
                                            <Ionicons
                                                name="heart"
                                                size={14}
                                                color="#dc2626"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="heart-outline"
                                                size={14}
                                                color="#dc2626"
                                            />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </>
                }
                renderItem={() => (
                    <View style={styles.contentContainer}>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                        <Text>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Perferendis mollitia sit recusandae? Libero
                            nobis, sit ipsam harum facere non vitae, voluptates
                            molestiae id quidem ab natus eveniet similique at
                            commodi?
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
    },
    transparentImage: {
        opacity: 0,
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    gradient: {
        flex: 1,
        height: 128,
        justifyContent: 'flex-end',
        paddingHorizontal: 10,
        paddingBottom: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerContentContainer: {},
    titleText: {
        fontSize: 24,
        color: '#FFF',
        fontWeight: 'bold',
        fontFamily: 'Jost',
    },
    bottomRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ratingsText: {
        fontWeight: '300',
        color: '#fff',
        fontSize: 10,
        marginRight: 4,
    },
    distanceContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    distanceText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '300',
    },
    heartContainer: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonsContainer: {
        position: 'absolute',
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 100,
        top: 0,
        paddingBottom: 5,
    },
    button: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    contentContainer: {
        backgroundColor: 'blue',
    },
});
