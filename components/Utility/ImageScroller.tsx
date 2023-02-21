import React from 'react';
import { FlatList, Image } from 'react-native';

type ImageScrollerImages = {
    images: string[];
};

export default function ImageScroller({ images }: ImageScrollerImages) {
    return (
        <FlatList
            horizontal={true}
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                <Image
                    source={{ uri: item }}
                    style={{ height: 158, width: 158, marginRight: 5 }}
                />
            )}
        />
    );
}
