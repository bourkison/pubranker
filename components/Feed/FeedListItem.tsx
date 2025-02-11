import { FeedType } from '@/services/queries/feed';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import FeedReviewLikeItem from '@/components/Feed/FeedReviewLikeItem';
import FeedReviewItem from '@/components/Feed/FeedReviewItem';

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
    console.log('feed Item', feedItem);

    if (feedItem.type === 'REVIEW_LIKE' && feedItem.review_likes) {
        return (
            <FeedReviewLikeItem
                user={feedItem.user}
                reviewLike={feedItem.review_likes}
            />
        );
    } else if (feedItem.type === 'REVIEW_LIKE') {
        console.log(feedItem.review);
        return <EmptyFeedListItem id={feedItem.id} />;
    }

    if (feedItem.type === 'REVIEW' && feedItem.review) {
        return <FeedReviewItem user={feedItem.user} review={feedItem.review} />;
    } else if (feedItem.type === 'REVIEW') {
        return <EmptyFeedListItem id={feedItem.id} />;
    }

    return <EmptyFeedListItem id={feedItem.id} />;
}
