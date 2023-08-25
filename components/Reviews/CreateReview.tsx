import { supabase } from '@/services/supabase';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import StarRanker from '@/components/Utility/StarRanker';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type CategoryRating = null | boolean;

type CreateReviewProps = {
    pubId: number;
    expanded: boolean;
    onCreate?: () => void;
    onDismiss?: () => void;
};

export default function CreateReview({
    pubId,
    expanded,
    onDismiss,
    onCreate,
}: CreateReviewProps) {
    const [page, setPage] = useState(0);

    const [rating, setRating] = useState(1);

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
    };

    const PageContent = useMemo(() => {
        if (page === 0) {
            return (
                <Animated.View exiting={FadeOut} entering={FadeIn}>
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
                <Animated.View exiting={FadeOut} entering={FadeIn}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>
                            What should others know about this pub?
                        </Text>
                    </View>

                    <TextInput
                        multiline={true}
                        placeholder="Add some extra information about your experience at the pub"
                        textAlignVertical="top"
                        onChangeText={setContent}
                        style={styles.contentInput}
                    />
                </Animated.View>
            );
        }
    }, [page, rating]);

    return (
        <BottomSheetModal
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
                <View>
                    <Text>{page}</Text>
                </View>

                {PageContent}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => setPage(page + 1)}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </BottomSheetModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 25,
        paddingVertical: 50,
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
    starsContainer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    button: {
        backgroundColor: '#292935BB',
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
});
