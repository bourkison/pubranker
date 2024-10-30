import { useAppSelector } from '@/store/hooks';
import { UserReviewType } from '@/types';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';

type HelpfulsPropsType = {
    review: UserReviewType;
};

export default function Helpfuls({ review }: HelpfulsPropsType) {
    const user = useAppSelector(state => state.user.docData);

    const [isCreatingHelpful, setIsCreatingHelpful] = useState(false);
    const [isHelpfuls, setIsHelpfuls] = useState(review.is_helpfuls);
    const [totalHelpfuls, setTotalHelpfuls] = useState(review.total_helpfuls);

    const createHelpful = async (isHelpful: boolean) => {
        if (!user || isCreatingHelpful) {
            return;
        }

        setIsCreatingHelpful(true);

        // Check if already created opposite and thus have to update/toggle already created.
        const { data, error } = await supabase
            .from('review_helpfuls')
            .select()
            .eq('review_id', review.id)
            .eq('user_id', user.id)
            .limit(1);

        if (error) {
            return;
        }

        if (data.length === 0) {
            await supabase.from('review_helpfuls').insert({
                review_id: review.id,
                is_helpful: isHelpful,
            });

            if (isHelpful) {
                setIsHelpfuls(isHelpfuls + 1);
            }

            setTotalHelpfuls(totalHelpfuls + 1);
        } else if (data.length === 1 && data[0].is_helpful === !isHelpful) {
            await supabase
                .from('review_helpfuls')
                .update({ is_helpful: isHelpful })
                .eq('review_id', review.id)
                .eq('user_id', user.id)
                .eq('is_helpful', !isHelpful);

            if (isHelpful) {
                setIsHelpfuls(isHelpfuls + 1);
            } else {
                setIsHelpfuls(isHelpfuls - 1);
            }
        } else {
            await supabase
                .from('review_helpfuls')
                .delete()
                .eq('review_id', review.id)
                .eq('user_id', user.id);

            if (isHelpful) {
                setIsHelpfuls(isHelpfuls - 1);
            }

            setTotalHelpfuls(totalHelpfuls - 1);
        }

        setIsCreatingHelpful(false);
    };

    return (
        <View style={styles.helpfulContainer}>
            <TouchableOpacity
                onPress={() => createHelpful(true)}
                style={styles.helpfulButton}>
                <Feather name="thumbs-up" size={14} color="#A3A3A3" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => createHelpful(false)}
                style={styles.helpfulButton}>
                <Feather name="thumbs-down" size={14} color="#A3A3A3" />
            </TouchableOpacity>
            <Text style={styles.helpfulText}>
                {isHelpfuls} of {totalHelpfuls} found this helpful
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    helpfulContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    helpfulButton: {
        marginHorizontal: 2,
    },
    helpfulText: {
        fontSize: 12,
        opacity: 0.4,
        paddingLeft: 3,
    },
});
