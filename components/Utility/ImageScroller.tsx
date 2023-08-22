import React, { Ref, useMemo } from 'react';
import {
    Image,
    StyleSheet,
    FlatList,
    Platform,
    useWindowDimensions,
} from 'react-native';

type ImageScrollerImages = {
    images: string[];
    margin?: number;
    imageFlatListRef?: Ref<FlatList>;
    percentageWidth: number;
    aspectRatio: number;
};

export default function ImageScroller({
    images,
    margin = 5,
    percentageWidth,
    aspectRatio,
    imageFlatListRef,
}: ImageScrollerImages) {
    const { width } = useWindowDimensions();

    const imageWidth = useMemo(
        () => width * percentageWidth,
        [width, percentageWidth],
    );
    const imageHeight = useMemo(
        () => imageWidth / aspectRatio,
        [imageWidth, aspectRatio],
    );

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
                            {
                                width: imageWidth,
                                height: imageHeight,
                                marginHorizontal: margin,
                            },
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
                            {
                                width: imageWidth,
                                height: imageHeight,
                                marginHorizontal: margin,
                            },
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
