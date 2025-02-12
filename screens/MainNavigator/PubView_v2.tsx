import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { FetchPubType, pubQuery } from '@/services/queries/pub';
import { supabase } from '@/services/supabase';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    useWindowDimensions,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import { distance, point } from '@turf/turf';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { distanceString, roundToNearest } from '@/services';
import { GOLD_RATINGS_COLOR } from '@/constants';

const GRADIENT_HEIGHT = 128;

export default function PubView({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'PubView'>) {
    const [pub, setPub] = useState<FetchPubType>();
    const [isLoading, setIsLoading] = useState(false);
    const [distMeters, setDistMeters] = useState(0);

    const { width, height } = useWindowDimensions();

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
                        height: width,
                    }}
                />
            </View>
            <FlatList
                data={Array(1)}
                ListHeaderComponent={
                    <>
                        <View
                            style={[
                                styles.transparentImage,
                                {
                                    width: width,
                                    height: width - GRADIENT_HEIGHT,
                                },
                            ]}
                        />
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
                    <View>
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
});
