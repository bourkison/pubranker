import React, { Ref, useMemo } from 'react';
import {
    Image,
    StyleSheet,
    FlatList,
    Platform,
    useWindowDimensions,
    ScrollView,
} from 'react-native';

type ImageScrollerImages = {
    images: string[];
    margin?: number;
    imageFlatListRef?: Ref<FlatList>;
    rows: { width: number; aspectRatio: number }[]; // Each number is how wide the image should be on that row
};

export default function ImageScroller({
    images,
    margin = 5,
    imageFlatListRef,
    rows,
}: ImageScrollerImages) {
    const { width } = useWindowDimensions();

    const rowsAmount = useMemo(() => rows.length, [rows]);

    return (
        <ScrollView>
            <FlatList
                contentContainerStyle={{ alignSelf: 'flex-start' }}
                numColumns={Math.ceil(images.length / rowsAmount)}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={images}
                renderItem={({ item, index }) => {
                    return (
                        <Image
                            source={{ uri: item }}
                            style={{
                                width: rows[0].width * width,
                                height:
                                    (rows[0].width * width) /
                                    rows[0].aspectRatio,
                            }}
                        />
                    );
                }}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: { borderRadius: 3 },
});
