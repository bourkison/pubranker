import { UserType } from '@/services/queries/user';
import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackActions, useNavigation } from '@react-navigation/native';

type ProfileLinksProps = {
    user: UserType;
};

const RIGHT_COLUMN_COLOR = 'rgba(0, 0, 0, 0.6)';

export default function ProfileLinks({ user }: ProfileLinksProps) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableHighlight
                style={styles.itemContainer}
                underlayColor="#E5E7EB"
                onPress={() =>
                    navigation.navigate('UserRatings', { userId: user.id })
                }>
                <>
                    <Text style={styles.itemHeader}>Ratings</Text>

                    <View style={styles.subheaderContainer}>
                        <Text style={styles.subheaderText}>
                            {user.ratings[0].count}
                        </Text>
                        <Feather
                            name="chevron-right"
                            size={18}
                            color={RIGHT_COLUMN_COLOR}
                        />
                    </View>
                </>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.itemContainer}
                underlayColor="#E5E7EB"
                onPress={() => console.log('press')}>
                <>
                    <Text style={styles.itemHeader}>Reviews</Text>

                    <View style={styles.subheaderContainer}>
                        <Text style={styles.subheaderText}>
                            {user.reviews[0].count}
                        </Text>
                        <Feather
                            name="chevron-right"
                            size={18}
                            color={RIGHT_COLUMN_COLOR}
                        />
                    </View>
                </>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.itemContainer}
                underlayColor="#E5E7EB"
                onPress={() => {
                    const pushAction = StackActions.push('UserCollections', {
                        userId: user.id,
                    });
                    navigation.dispatch(pushAction);
                }}>
                <>
                    <Text style={styles.itemHeader}>Lists</Text>

                    <View style={styles.subheaderContainer}>
                        <Text style={styles.subheaderText}>
                            {user.collections[0].count}
                        </Text>
                        <Feather
                            name="chevron-right"
                            size={18}
                            color={RIGHT_COLUMN_COLOR}
                        />
                    </View>
                </>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.itemContainer}
                underlayColor="#E5E7EB"
                onPress={() => {
                    const pushAction = StackActions.push(
                        'FollowersFollowingView',
                        {
                            type: 'following',
                            userId: user.id,
                            count: user.following[0].count,
                        },
                    );
                    navigation.dispatch(pushAction);
                }}>
                <>
                    <Text style={styles.itemHeader}>Following</Text>

                    <View style={styles.subheaderContainer}>
                        <Text style={styles.subheaderText}>
                            {user.following[0].count}
                        </Text>
                        <Feather
                            name="chevron-right"
                            size={18}
                            color={RIGHT_COLUMN_COLOR}
                        />
                    </View>
                </>
            </TouchableHighlight>

            <TouchableHighlight
                style={styles.itemContainer}
                underlayColor="#E5E7EB"
                onPress={() => {
                    const pushAction = StackActions.push(
                        'FollowersFollowingView',
                        {
                            type: 'followers',
                            userId: user.id,
                            count: user.followers[0].count,
                        },
                    );
                    navigation.dispatch(pushAction);
                }}>
                <>
                    <Text style={styles.itemHeader}>Followers</Text>

                    <View style={styles.subheaderContainer}>
                        <Text style={styles.subheaderText}>
                            {user.followers[0].count}
                        </Text>
                        <Feather
                            name="chevron-right"
                            size={18}
                            color={RIGHT_COLUMN_COLOR}
                        />
                    </View>
                </>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    itemContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    itemHeader: {
        fontSize: 14,
        fontWeight: '400',
    },
    subheaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    subheaderText: {
        fontSize: 12,
        color: RIGHT_COLUMN_COLOR,
    },
});
