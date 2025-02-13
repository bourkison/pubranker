import { distanceString, roundToNearest } from '@/services';
import { supabase } from '@/services/supabase';
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Animated, {
    Easing,
    EntryExitAnimationFunction,
    ExitAnimationsValues,
    Extrapolation,
    FadeInDown,
    FadeOutDown,
    LayoutAnimation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { GOLD_RATINGS_COLOR } from '@/constants';
import { MapPub, useSharedMapContext } from '@/context/mapContext';

type SelectedPubProps = {
    pub: MapPub;
};

const IMAGE_SIZE = 128;
const BORDER_RADIUS = 5;
const NO_IMAGE = require('@/assets/noimage.png');

export default function SelectedPub({ pub }: SelectedPubProps) {
    const image = useMemo<string>(() => {
        if (pub.primary_photo) {
            return supabase.storage.from('pubs').getPublicUrl(pub.primary_photo)
                .data.publicUrl;
        }

        return '';
    }, [pub]);

    const navigation = useNavigation();

    const { deselectMapPub } = useSharedMapContext();

    const sTranslateY = useSharedValue(0);
    const sOpacity = useDerivedValue(() =>
        interpolate(sTranslateY.value, [0, 50], [1, 0.4], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
        }),
    );
    const contextY = useSharedValue(0);

    const showExitAnimation = useSharedValue(true);
    const fadeOutDownAnimation =
        new FadeOutDown().build() as EntryExitAnimationFunction;

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: sTranslateY.value }],
        opacity: sOpacity.value,
    }));

    const deselect = useCallback(() => {
        deselectMapPub();
    }, [deselectMapPub]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            contextY.value = sTranslateY.value;
        })
        .onUpdate(e => {
            sTranslateY.value = interpolate(
                e.translationY + contextY.value,
                [-200, 0, 100],
                [-20, 0, 50],
                {
                    extrapolateLeft: Extrapolation.CLAMP,
                    extrapolateRight: Extrapolation.EXTEND,
                },
            );
        })
        .onFinalize(() => {
            if (sTranslateY.value > 50) {
                showExitAnimation.value = false;
                runOnJS(deselect)();
                return;
            }

            sTranslateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        });

    const CustomExitingAnimation: EntryExitAnimationFunction = (
        values: ExitAnimationsValues,
    ): LayoutAnimation => {
        'worklet';

        if (showExitAnimation.value === true) {
            // @ts-ignore
            return fadeOutDownAnimation(values);
        }

        const animations = {
            opacity: withTiming(0, { duration: 150 }),
        };

        const initialValues = {
            originY: sTranslateY.value,
            opacity: sOpacity.value,
        };

        return { animations, initialValues };
    };

    return (
        <Animated.View
            style={[rStyle, styles.animatedContainer]}
            entering={FadeInDown}
            exiting={CustomExitingAnimation}>
            <GestureDetector gesture={panGesture}>
                <Pressable
                    style={styles.container}
                    onPress={() =>
                        navigation.navigate('PubView', { pubId: pub.id })
                    }>
                    {image ? (
                        <Image
                            source={image ? { uri: image } : NO_IMAGE}
                            style={styles.image}
                        />
                    ) : undefined}

                    <View style={styles.contentContainer}>
                        <View>
                            <Text style={styles.titleText}>{pub.name}</Text>
                            <Text style={styles.addressText}>
                                {pub.address}
                            </Text>
                        </View>
                        <View style={styles.bottomContentRowContainer}>
                            <Text style={styles.distText}>
                                {distanceString(pub.dist_meters)}
                            </Text>
                            <View style={styles.ratingsContainer}>
                                <Ionicons
                                    name="star"
                                    size={10}
                                    color={GOLD_RATINGS_COLOR}
                                />
                                <Text style={styles.ratingsText}>
                                    {roundToNearest(pub.rating, 0.1).toFixed(1)}{' '}
                                    ({pub.num_reviews})
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Pressable
                        style={styles.closeButtonContainer}
                        onPress={deselect}>
                        <Text style={styles.closeButtonText}>x</Text>
                    </Pressable>
                </Pressable>
            </GestureDetector>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    animatedContainer: {
        zIndex: 3,
    },
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
