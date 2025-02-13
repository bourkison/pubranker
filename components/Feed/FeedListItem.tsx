import { FeedType } from '@/services/queries/feed';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import FeedReviewLikeItem from '@/components/Feed/FeedReviewLikeItem';
import FeedReviewItem from '@/components/Feed/FeedReviewItem';
import FeedFollowItem from './FeedFollowItem';

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
    if (feedItem.type === 'REVIEW_LIKE' && feedItem.review_like) {
        return (
            <FeedReviewLikeItem
                user={feedItem.user}
                reviewLike={feedItem.review_like}
            />
        );
    } else if (feedItem.type === 'REVIEW_LIKE') {
        return <EmptyFeedListItem id={feedItem.id} />;
    }

    if (feedItem.type === 'REVIEW' && feedItem.review) {
        return <FeedReviewItem user={feedItem.user} review={feedItem.review} />;
    } else if (feedItem.type === 'REVIEW') {
        return <EmptyFeedListItem id={feedItem.id} />;
    }

    if (feedItem.type === 'FOLLOW' && feedItem.follow) {
        return <FeedFollowItem user={feedItem.user} follow={feedItem.follow} />;
    } else if (feedItem.type === 'FOLLOW') {
        return <EmptyFeedListItem id={feedItem.id} />;
    }

    return <EmptyFeedListItem id={feedItem.id} />;
}
