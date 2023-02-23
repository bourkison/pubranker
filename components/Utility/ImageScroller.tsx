import React from 'react';
import { Image, StyleSheet, FlatList, Platform } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

type ImageScrollerImages = {
    images: string[];
};

export default function ImageScroller({ images }: ImageScrollerImages) {
    const comp =
        Platform.OS === 'ios' ? (
            <FlatList
                horizontal={true}
                data={images}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.image} />
                )}
            />
        ) : (
            <BottomSheetFlatList
                horizontal={true}
                data={images}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={{ uri: item }} style={styles.image} />
                )}
            />
        );

    return comp;
}

const styles = StyleSheet.create({
    image: { height: 158, width: 158, marginRight: 5 },
});
