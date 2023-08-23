import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextLayoutEventData,
    NativeSyntheticEvent,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fromNowString } from '@/services';
import { PubSchema, UserReviewType } from '@/types';
import { GOLD_RATINGS_COLOR } from '@/constants';
import UserAvatar from '../User/UserAvatar';
import { useSharedPubHomeContext } from '@/context/pubHome';

type ReviewProps = {
    review: UserReviewType;
    pub: PubSchema;
};

const MAX_LINES_LENGTH = 4;

export default function Review({ review }: ReviewProps) {
    const [textShown, setTextShown] = useState(false);
    const [lengthMore, setLengthMore] = useState(false);

    const { calculateWithinScrollBounds } = useSharedPubHomeContext();

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
        <View style={styles.container} onLayout={calculateWithinScrollBounds}>
            <View style={styles.headerContainer}>
                <View style={styles.avatarContainer}>
                    <UserAvatar size={24} photo="" />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.nameText}>{review.user_name}</Text>
                    <View style={styles.bottomHeaderRow}>
                        {[0, 0, 0, 0, 0].map((_, index) => (
                            <View key={index} style={styles.starContainer}>
                                <Ionicons
                                    name="star"
                                    size={14}
                                    color={
                                        index < review.rating
                                            ? GOLD_RATINGS_COLOR
                                            : 'rgba(0, 0, 0, 0.2)'
                                    }
                                />
                            </View>
                        ))}
                        <Text style={styles.dateText}>
                            {fromNowString(review.created_at)}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text
                    style={styles.contentText}
                    numberOfLines={textShown ? undefined : MAX_LINES_LENGTH}
                    onTextLayout={onTextLayout}>
                    {review.content}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Diam phasellus vestibulum lorem sed risus ultricies
                    tristique nulla. Praesent semper feugiat nibh sed pulvinar
                    proin. Sollicitudin nibh sit amet commodo. Non diam
                    phasellus vestibulum lorem sed risus ultricies tristique
                    nulla. Placerat orci nulla pellentesque dignissim enim sit.
                    Malesuada proin libero nunc consequat interdum varius sit
                    amet. Lorem sed risus ultricies tristique nulla. Commodo
                    nulla facilisi nullam vehicula ipsum a arcu. Dolor sit amet
                    consectetur adipiscing elit ut. Tristique nulla aliquet enim
                    tortor at auctor urna. Sollicitudin tempor id eu nisl nunc
                    mi ipsum faucibus. Duis at tellus at urna condimentum mattis
                    pellentesque. Augue lacus viverra vitae congue eu consequat.
                    Placerat orci nulla pellentesque dignissim enim sit amet.
                    Est velit egestas dui id ornare arcu odio ut. Nisi lacus sed
                    viverra tellus in hac habitasse platea. Diam ut venenatis
                    tellus in metus vulputate eu scelerisque. Sed blandit libero
                    volutpat sed cras ornare arcu dui. Tortor posuere ac ut
                    consequat semper viverra nam libero justo. Praesent
                    elementum facilisis leo vel fringilla est ullamcorper eget.
                    Gravida cum sociis natoque penatibus et. Tempus egestas sed
                    sed risus. Ornare aenean euismod elementum nisi. Suscipit
                    adipiscing bibendum est ultricies. Volutpat est velit
                    egestas dui. Porta nibh venenatis cras sed felis eget velit.
                    Urna id volutpat lacus laoreet non curabitur gravida arcu.
                    Sagittis eu volutpat odio facilisis mauris sit amet.
                    Phasellus vestibulum lorem sed risus ultricies tristique
                    nulla aliquet. Tellus integer feugiat scelerisque varius
                    morbi enim. Nibh nisl condimentum id venenatis a condimentum
                    vitae. Luctus venenatis lectus magna fringilla. Ut sem nulla
                    pharetra diam. Tempor id eu nisl nunc. Enim diam vulputate
                    ut pharetra sit. Porttitor massa id neque aliquam vestibulum
                    morbi. Consequat ac felis donec et odio pellentesque diam
                    volutpat commodo. Habitant morbi tristique senectus et netus
                    et malesuada fames ac. Orci phasellus egestas tellus rutrum
                    tellus pellentesque eu tincidunt tortor. Magnis dis
                    parturient montes nascetur ridiculus. Quam lacus suspendisse
                    faucibus interdum posuere. Quis lectus nulla at volutpat
                    diam ut venenatis tellus in. Natoque penatibus et magnis dis
                    parturient montes nascetur ridiculus mus. Ultrices sagittis
                    orci a scelerisque purus semper. Eget magna fermentum
                    iaculis eu. Ullamcorper eget nulla facilisi etiam dignissim
                    diam quis enim lobortis. Dignissim diam quis enim lobortis
                    scelerisque fermentum dui. Pretium fusce id velit ut tortor
                    pretium. Ante in nibh mauris cursus. Maecenas sed enim ut
                    sem viverra aliquet. Morbi non arcu risus quis varius quam
                    quisque id. Nisl nisi scelerisque eu ultrices vitae auctor
                    eu augue. Sagittis purus sit amet volutpat consequat. Sit
                    amet venenatis urna cursus eget nunc. Nisi quis eleifend
                    quam adipiscing vitae proin sagittis nisl rhoncus. Amet
                    cursus sit amet dictum sit amet justo. Sit amet tellus cras
                    adipiscing enim eu turpis. Nisi quis eleifend quam
                    adipiscing. A condimentum vitae sapien pellentesque habitant
                    morbi tristique. Id cursus metus aliquam eleifend mi in
                    nulla posuere sollicitudin. Ac ut consequat semper viverra
                    nam libero justo laoreet. Justo donec enim diam vulputate ut
                    pharetra sit amet. Auctor eu augue ut lectus arcu bibendum.
                    Sollicitudin tempor id eu nisl nunc mi. Id velit ut tortor
                    pretium. Duis convallis convallis tellus id interdum velit
                    laoreet. Sit amet dictum sit amet justo donec enim diam.
                    Nunc non blandit massa enim nec dui nunc mattis. Ornare
                    suspendisse sed nisi lacus sed viverra tellus in hac. Ac
                    turpis egestas maecenas pharetra convallis posuere morbi leo
                    urna. Non consectetur a erat nam at. Mi tempus imperdiet
                    nulla malesuada pellentesque elit. Pharetra sit amet aliquam
                    id diam maecenas. Pulvinar neque laoreet suspendisse
                    interdum consectetur libero id faucibus nisl. Mauris augue
                    neque gravida in fermentum et sollicitudin ac. Cursus turpis
                    massa tincidunt dui. Nunc pulvinar sapien et ligula
                    ullamcorper malesuada proin libero nunc. Lacus sed viverra
                    tellus in. Ultricies tristique nulla aliquet enim tortor at
                    auctor urna nunc. Quis imperdiet massa tincidunt nunc.
                    Interdum posuere lorem ipsum dolor sit amet consectetur
                    adipiscing. Lacus vestibulum sed arcu non odio euismod
                    lacinia. Dui id ornare arcu odio ut sem nulla pharetra diam.
                    Cras adipiscing enim eu turpis egestas pretium aenean.
                    Nullam vehicula ipsum a arcu.
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 25,
        marginHorizontal: 25,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {},
    headerTextContainer: {
        paddingLeft: 10,
    },
    bottomHeaderRow: {
        flexDirection: 'row',
        paddingTop: 4,
        alignItems: 'center',
    },
    starContainer: {
        paddingHorizontal: 2,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '500',
    },
    dateText: {
        fontSize: 12,
        opacity: 0.4,
        paddingLeft: 5,
    },
    contentContainer: {
        paddingTop: 15,
    },
    contentText: {
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
});
