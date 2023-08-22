import { distanceString, roundToNearest } from '@/services';
import { supabase } from '@/services/supabase';
import { PubSchema } from '@/types';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { selectPub } from '@/store/slices/map';
import { useAppDispatch } from '@/store/hooks';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
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

    const deselectPub = useCallback(() => {
        dispatch(selectPub(undefined));
    }, [dispatch]);

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
                runOnJS(deselectPub)();
                return;
            }

            sTranslateY.value = withTiming(0, {
                duration: 300,
                easing: Easing.inOut(Easing.quad),
            });
        });

    useEffect(() => {
        if (pub.photos[0]) {
            const url = supabase.storage
                .from('pubs')
                .getPublicUrl(pub.photos[0]);

            setImageUrl(url.data.publicUrl);
        } else {
            setImageUrl('');
        }
    }, [pub]);

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
            style={rStyle}
            entering={FadeInDown}
            exiting={CustomExitingAnimation}>
            <GestureDetector gesture={panGesture}>
                <Pressable
                    style={styles.container}
                    onPress={() => navigation.navigate('PubView', { pub })}>
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
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
                                    color="#FFD700"
                                />
                                <Text style={styles.ratingsText}>
                                    {roundToNearest(
                                        pub.overall_reviews,
                                        0.1,
                                    ).toFixed(1)}{' '}
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
            </GestureDetector>
        </Animated.View>
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
