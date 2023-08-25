import React from 'react';
import { View, Text } from 'react-native';

type CreateReviewProps = {
    pubId: number;
};

export default function CreateReview({ pubId }: CreateReviewProps) {
    return (
        <View>
            <Text>Create Review</Text>
        </View>
    );
}
