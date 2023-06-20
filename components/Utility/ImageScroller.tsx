import React, { Ref } from 'react';
import { Image, StyleSheet, FlatList, Platform } from 'react-native';

type ImageScrollerImages = {
    images: string[];
    height?: number;
    width?: number;
    margin?: number;
    imageFlatListRef?: Ref<FlatList>;
};

export default function ImageScroller({
    images,
    height = 158,
    width = 158,
    margin = 5,
    imageFlatListRef,
}: ImageScrollerImages) {
    const comp =
        Platform.OS === 'ios' ? (
            <FlatList
                ref={imageFlatListRef}
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
            <FlatList
                ref={imageFlatListRef}
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
