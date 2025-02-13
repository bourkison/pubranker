import React, { useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';

type LikeCollectionButtonProps = {
    liked: boolean;
    size: number;
    collectionId: number;
    onLikeCommence?: () => void;
    onLikeComplete?: (success: boolean) => void;
    onUnlikeCommence?: () => void;
    onUnlikeComplete?: (success: boolean) => void;
};

const BUTTON_COLOR = 'black';

export default function LikeCollectionButton({
    size,
    liked,
    collectionId,
    onLikeCommence,
    onLikeComplete,
    onUnlikeCommence,
    onUnlikeComplete,
}: LikeCollectionButtonProps) {
    const [isLiking, setIsLiking] = useState(false);

    const toggleLike = useCallback(async () => {
        setIsLiking(true);

        if (!liked) {
            onLikeCommence && onLikeCommence();

            const { error } = await supabase
                .from('collection_likes')
                .insert({ collection_id: collectionId });

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
            .from('collection_likes')
            .delete()
            .eq('collection_id', collectionId);

        if (error) {
            console.error(error);
            onUnlikeComplete && onUnlikeComplete(false);
            return;
        }

        onUnlikeComplete && onUnlikeComplete(true);
        setIsLiking(false);
    }, [
        collectionId,
        liked,
        onLikeCommence,
        onLikeComplete,
        onUnlikeCommence,
        onUnlikeComplete,
    ]);
    return (
        <TouchableOpacity onPress={toggleLike} disabled={isLiking}>
            {liked ? (
                <Ionicons name="heart" size={size} color={BUTTON_COLOR} />
            ) : (
                <Ionicons
                    name="heart-outline"
                    size={size}
                    color={BUTTON_COLOR}
                />
            )}
        </TouchableOpacity>
    );
}
