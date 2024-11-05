import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import { Color } from '@/types';

type LikeReviewButtonProps = {
    liked: boolean;
    size: number;
    reviewId: number;
    onLikeCommence?: () => void;
    onLikeComplete?: (success: boolean) => void;
    onUnlikeCommence?: () => void;
    onUnlikeComplete?: (success: boolean) => void;
    unlikedColor?: Color;
};

export default function LikeReviewButton({
    liked,
    size,
    reviewId,
    onLikeCommence,
    onLikeComplete,
    onUnlikeCommence,
    onUnlikeComplete,
    unlikedColor = '#dc2626',
}: LikeReviewButtonProps) {
    const [isLiking, setIsLiking] = useState(false);

    const toggleLike = useCallback(async () => {
        setIsLiking(true);

        if (!liked) {
            onLikeCommence && onLikeCommence();

            const { error } = await supabase
                .from('review_likes')
                .insert({ review_id: reviewId });

            if (error) {
                console.error(error);
                onLikeComplete && onLikeComplete(false);
                return;
            }

            onLikeComplete && onLikeComplete(true);
            setIsLiking(false);
            return;
        }

        onUnlikeCommence && onUnlikeCommence();

        const { error } = await supabase
            .from('review_likes')
            .delete()
            .eq('review_id', reviewId);

        if (error) {
            console.error(error);
            onUnlikeComplete && onUnlikeComplete(false);
        }

        setIsLiking(false);
        console.log('success');
        onUnlikeComplete && onUnlikeComplete(true);
    }, [
        reviewId,
        liked,
        onLikeCommence,
        onLikeComplete,
        onUnlikeCommence,
        onUnlikeComplete,
    ]);

    return (
        <TouchableOpacity onPress={toggleLike} disabled={isLiking}>
            {liked ? (
                <Ionicons name="heart" size={size} color="#dc2626" />
            ) : (
                <Ionicons
                    name="heart-outline"
                    size={size}
                    color={unlikedColor}
                />
            )}
        </TouchableOpacity>
    );
}
