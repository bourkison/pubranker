import { supabase } from '@/services/supabase';
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StarRanker from '@/components/Utility/StarRanker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FAIL_COLOR, SECONDARY_COLOR, SUCCESS_COLOR } from '@/constants';
import { Ionicons } from '@expo/vector-icons';

type CategoryRating = null | boolean;

type CategoryProps = {
    title: string;
    value: CategoryRating;
    onThumbsUp: () => void;
    onThumbsDown: () => void;
};

type CreateReviewProps = {
    pubId: number;
    expanded: boolean;
    onCreate?: () => void;
    onDismiss?: () => void;
};

const PAGES_AMOUNT = 3;

function Category({ title, onThumbsUp, onThumbsDown, value }: CategoryProps) {
    useEffect(() => console.log(title, value));

    return (
        <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{title}</Text>
            <View style={styles.categoryButtonsContainer}>
                <TouchableOpacity
                    style={[
                        styles.categoryButtonContainer,
                        value === true
                            ? styles.categoryPositiveButton
                            : undefined,
                    ]}
                    onPress={onThumbsUp}>
                    <Ionicons
                        name="thumbs-up-outline"
                        size={16}
                        color={value === true ? '#FFF' : '#000'}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.categoryButtonContainer,
                        value === false
                            ? styles.categoryNegativeButton
                            : undefined,
                    ]}
                    onPress={onThumbsDown}>
                    <Ionicons
                        name="thumbs-down-outline"
                        size={16}
                        color={value === false ? '#FFF' : '#000'}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function CreateReview({
    pubId,
    expanded,
    onDismiss,
    onCreate,
}: CreateReviewProps) {
    const [page, setPage] = useState(0);

    const [rating, setRating] = useState(0);

    const [vibe, setVibe] = useState<CategoryRating>(null);
    const [beer, setBeer] = useState<CategoryRating>(null);
    const [music, setMusic] = useState<CategoryRating>(null);
    const [service, setService] = useState<CategoryRating>(null);
    const [location, setLocation] = useState<CategoryRating>(null);
    const [food, setFood] = useState<CategoryRating>(null);

    const [content, setContent] = useState('');
    const [loading, setIsLoading] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const dismissed = useCallback(() => {
        if (onDismiss) {
            onDismiss();
        }

        setPage(0);
    }, [onDismiss]);

    useEffect(() => {
        console.log('EXPANDED:', expanded);

        if (!bottomSheetRef || !bottomSheetRef.current) {
            console.log('no bottom sheet ref');
            return;
        }

        if (expanded) {
            console.log('expanding');
            bottomSheetRef.current.present();
        } else {
            bottomSheetRef.current.close();
            dismissed();
        }
    }, [expanded, dismissed]);

    const nextPage = () => {
        if (page === PAGES_AMOUNT - 1) {
            postReview();
            return;
        }

        setPage(page + 1);
    };

    const postReview = async () => {
        setIsLoading(true);

        const { error } = await supabase
            .from('reviews')
            .insert({
                content,
                vibe,
                beer,
                music,
                service,
                location,
                food,
                rating,
                pub_id: pubId,
            })
            .select()
            .limit(1)
            .single();

        setIsLoading(false);

        if (error) {
            // TODO: Handle error
            console.error(error);
            return;
        }

        if (onCreate) {
            onCreate();
        }
    };

    const PageContent = useMemo(() => {
        if (page === 0) {
            return (
                <Animated.View
                    exiting={FadeOut}
                    entering={FadeIn}
                    style={styles.pageOneContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>How was the pub?</Text>
                    </View>

                    <View style={styles.starsContainer}>
                        <StarRanker selected={rating} setSelected={setRating} />
                    </View>
                </Animated.View>
            );
        } else if (page === 1) {
            return (
                <Animated.View
                    exiting={FadeOut}
                    entering={FadeIn}
                    style={styles.pageTwoContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>
                            What should others know about this pub?
                        </Text>
                    </View>

                    <BottomSheetTextInput
                        multiline={true}
                        placeholder="Add some extra information about your experience at the pub"
                        textAlignVertical="top"
                        onChangeText={setContent}
                        style={styles.contentInput}
                    />
                </Animated.View>
            );
        } else if (page === 2) {
            return (
                <Animated.View
                    exiting={FadeOut}
                    entering={FadeIn}
                    style={styles.pageThreeContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>
                            Additional categories
                        </Text>

                        <View style={styles.categoriesContainer}>
                            <Category
                                title="Vibe"
                                value={vibe}
                                onThumbsUp={() =>
                                    setVibe(vibe === true ? null : true)
                                }
                                onThumbsDown={() =>
                                    setVibe(vibe === false ? null : false)
                                }
                            />

                            <Category
                                title="Beer"
                                value={beer}
                                onThumbsUp={() =>
                                    setBeer(vibe === true ? null : true)
                                }
                                onThumbsDown={() =>
                                    setBeer(vibe === false ? null : false)
                                }
                            />

                            <Category
                                title="Music"
                                value={music}
                                onThumbsUp={() =>
                                    setMusic(music === true ? null : true)
                                }
                                onThumbsDown={() =>
                                    setMusic(music === false ? null : false)
                                }
                            />

                            <Category
                                title="Service"
                                value={service}
                                onThumbsUp={() =>
                                    setService(service === true ? null : true)
                                }
                                onThumbsDown={() =>
                                    setService(service === false ? null : false)
                                }
                            />

                            <Category
                                title="Location"
                                value={location}
                                onThumbsUp={() =>
                                    setLocation(location === true ? null : true)
                                }
                                onThumbsDown={() =>
                                    setLocation(
                                        location === false ? null : false,
                                    )
                                }
                            />

                            <Category
                                title="Food"
                                value={food}
                                onThumbsUp={() =>
                                    setFood(food === true ? null : true)
                                }
                                onThumbsDown={() =>
                                    setFood(food === false ? null : false)
                                }
                            />
                        </View>
                    </View>
                </Animated.View>
            );
        }
    }, [
        page,
        rating,
        setBeer,
        beer,
        vibe,
        setVibe,
        music,
        setMusic,
        location,
        setLocation,
        food,
        setFood,
        service,
        setService,
    ]);

    return (
        <BottomSheetModal
            keyboardBlurBehavior="restore"
            ref={bottomSheetRef}
            snapPoints={[400]}
            onDismiss={dismissed}
            backdropComponent={props => (
                <BottomSheetBackdrop
                    {...props}
                    pressBehavior="close"
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.5}
                />
            )}>
            <View style={styles.container}>
                <View style={styles.pageCountContainer}>
                    {Array.from(new Array(PAGES_AMOUNT)).map((_, index) => (
                        <>
                            <View
                                style={[
                                    styles.pageCount,
                                    page >= index
                                        ? styles.activePageCount
                                        : styles.inactivePageCount,
                                ]}>
                                <Text
                                    style={[
                                        styles.pageCountText,
                                        page >= index
                                            ? styles.activePageCountText
                                            : styles.inactivePageCountText,
                                    ]}>
                                    {index + 1}
                                </Text>
                            </View>
                            {index < PAGES_AMOUNT - 1 ? (
                                <View style={styles.pageCountSeparator} />
                            ) : undefined}
                        </>
                    ))}
                </View>

                {PageContent}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={nextPage} style={styles.button}>
                        {loading ? (
                            <ActivityIndicator />
                        ) : (
                            <Text style={styles.buttonText}>
                                {page === PAGES_AMOUNT - 1
                                    ? 'Post'
                                    : 'Continue'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        paddingTop: 10,
        justifyContent: 'space-between',
    },
    headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 20,
        fontWeight: '500',
        lineHeight: 20,
        letterSpacing: 0.3,
        textAlign: 'center',
    },
    pageCountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 30,
    },
    pageCountSeparator: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        height: 1,
        width: 24,
    },
    pageCount: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: SECONDARY_COLOR,
        borderWidth: 1,
    },
    activePageCount: {
        backgroundColor: SECONDARY_COLOR,
    },
    inactivePageCount: {
        backgroundColor: 'transparent',
    },
    pageCountText: {
        fontWeight: '500',
    },
    activePageCountText: {
        color: '#FFF',
    },
    inactivePageCountText: {
        color: '#000',
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginHorizontal: 25,
    },
    button: {
        backgroundColor: '#292935',
        paddingVertical: 3,
        borderRadius: 40,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    contentInput: {
        height: 128,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginTop: 25,
        marginBottom: 25,
    },
    categoriesContainer: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 25,
    },
    categoryContainer: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        marginTop: 10,
    },
    categoryButtonsContainer: { flexDirection: 'row' },
    categoryButtonContainer: {
        height: 32,
        width: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 2,
    },
    categoryPositiveButton: {
        borderColor: SUCCESS_COLOR,
        backgroundColor: SUCCESS_COLOR,
    },
    categoryNegativeButton: {
        borderColor: FAIL_COLOR,
        backgroundColor: FAIL_COLOR,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '300',
    },
    pageOneContainer: {
        paddingHorizontal: 25,
    },
    pageTwoContainer: {
        paddingHorizontal: 25,
    },
    pageThreeContainer: {},
});
