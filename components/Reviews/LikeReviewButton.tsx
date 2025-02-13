import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';

type LikeReviewButtonProps = {
    liked: boolean;
    size: number;
    reviewId: number;
    onLikeCommence?: () => void;
    onLikeComplete?: (success: boolean) => void;
    onUnlikeCommence?: () => void;
    onUnlikeComplete?: (success: boolean) => void;
};

export default function LikeReviewButton({
    liked,
    size,
    reviewId,
    onLikeCommence,
    onLikeComplete,
    onUnlikeCommence,
    onUnlikeComplete,
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
                <Ionicons name="heart" size={size} color="#000" />
            ) : (
                <Ionicons name="heart-outline" size={size} color="#000" />
            )}
        </TouchableOpacity>
    );
}
