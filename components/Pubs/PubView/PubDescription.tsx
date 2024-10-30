import { PubSchema } from '@/types';
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    NativeSyntheticEvent,
    TextLayoutEventData,
    TouchableOpacity,
} from 'react-native';
import RateButton from '@/components/Pubs/PubView/RateButtonModal/RateButtonModal';

type PubDescriptionProps = {
    pub: PubSchema;
};

const MAX_LINES_LENGTH = 4;

export default function PubDescription({ pub }: PubDescriptionProps) {
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    const onTextLayout = useCallback(
        (e: NativeSyntheticEvent<TextLayoutEventData>) => {
            setLengthMore(e.nativeEvent.lines.length >= MAX_LINES_LENGTH);
        },
        [],
    );

    const toggleText = () => {
        setTextShown(!textShown);
    };

    return (
        <>
            <View style={styles.container}>
                <View>
                    <RateButton pub={pub} />
                </View>
                <Text
                    numberOfLines={textShown ? undefined : MAX_LINES_LENGTH}
                    style={styles.descriptionText}
                    onTextLayout={onTextLayout}>
                    {pub.description}
                </Text>
                {lengthMore ? (
                    <TouchableOpacity
                        onPress={toggleText}
                        style={
                            textShown
                                ? styles.seeLessContainer
                                : styles.seeMoreContainer
                        }>
                        <Text style={styles.toggleTextText}>
                            {textShown ? 'See Less' : '... See More'}
                        </Text>
                    </TouchableOpacity>
                ) : undefined}
            </View>
            <View style={styles.separator} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.6,
    },
    seeLessContainer: {
        alignSelf: 'flex-end',
    },
    seeMoreContainer: {
        alignSelf: 'flex-end',
        marginTop: -17,
        backgroundColor: 'white',
    },
    toggleTextText: {
        color: '#A3A3A3',
    },
    separator: {
        marginHorizontal: 30,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
    },
});
