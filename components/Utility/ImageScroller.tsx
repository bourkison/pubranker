import React from 'react';
import { Image, StyleSheet, FlatList, Platform } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

type ImageScrollerImages = {
    images: string[];
    height?: number;
    width?: number;
    margin?: number;
};

export default function ImageScroller({
    images,
    height = 158,
    width = 158,
    margin = 5,
}: ImageScrollerImages) {
    const comp =
        Platform.OS === 'ios' ? (
            <FlatList
                horizontal={true}
                data={images}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={[
                            styles.image,
                            { height, width, marginHorizontal: margin },
                        ]}
                    />
                )}
            />
        ) : (
            <BottomSheetFlatList
                horizontal={true}
                data={images}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image
                        source={{ uri: item }}
                        style={[
                            styles.image,
                            { height, width, marginHorizontal: margin },
                        ]}
                    />
                )}
            />
        );

    return comp;
}

const styles = StyleSheet.create({
    image: { borderRadius: 3 },
});
