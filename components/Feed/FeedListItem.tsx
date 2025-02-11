import { FeedType } from '@/services/queries/feed';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import FeedReviewLikeItem from './FeedReviewLikeItem';

type EmptyFeedListItemProps = {
    id: number;
};

type FeedListItemProps = {
    feedItem: FeedType;
};

function EmptyFeedListItem({ id }: EmptyFeedListItemProps) {
    useEffect(() => {
        console.log('Empty feed item', id);
    }, [id]);

    return <View />;
}

export default function FeedListItem({ feedItem }: FeedListItemProps) {
    if (feedItem.type === 'REVIEW_LIKE' && feedItem.review_likes) {
        return (
            <FeedReviewLikeItem
                user={feedItem.user}
                reviewLike={feedItem.review_likes}
            />
        );
    } else if (feedItem.type === 'REVIEW_LIKE') {
        return <EmptyFeedListItem id={feedItem.id} />;
    }

    return <EmptyFeedListItem id={feedItem.id} />;
}
