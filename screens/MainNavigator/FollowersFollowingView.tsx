import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import {
    FollowsType,
    getFollowersQuery,
    getFollowingQuery,
} from '@/services/queries/follows';
import FollowListItem from '@/components/Follows/FollowListItem';
import { RootStackScreenProps } from '@/types/nav';

export default function FollowersFollowingView({
    route,
    navigation,
}: RootStackScreenProps<'FollowersFollowingView'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [follows, setFollows] = useState<FollowsType[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: userData } = await supabase.auth.getUser();

            if (route.params.type === 'followers') {
                const { data, error } = await getFollowersQuery(
                    route.params.userId,
                    userData.user?.id,
                );

                if (error) {
                    console.error(error);
                    setIsLoading(false);
                    return;
                }

                setFollows(data);
            }

            if (route.params.type === 'following') {
                const { data, error } = await getFollowingQuery(
                    route.params.userId,
                    userData.user?.id,
                );

                if (error) {
                    console.error(error);
                    setIsLoading(false);
                    return;
                }

                setFollows(data);
            }
        })();
    }, [route]);

    const header = useMemo<string>(() => {
        if (route.params.type === 'followers') {
            return `Followers (${route.params.count})`;
        }

        return `Following (${route.params.count})`;
    }, [route]);

    const toggleFollow = useCallback(
        (isFollow: boolean, index: number) => {
            const temp = follows.slice();

            if (!temp[index]) {
                console.error("Can't find follow to toggle.");
            }

            temp[index].user.is_followed = [{ count: isFollow ? 1 : 0 }];
        },
        [follows],
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{header}</Text>
                </View>

                <View style={styles.menuContainer} />
            </View>

            <FlatList
                data={follows}
                ListEmptyComponent={
                    <View>
                        {isLoading ? (
                            <ActivityIndicator />
                        ) : (
                            <View>
                                <Text>No followers/following</Text>
                            </View>
                        )}
                    </View>
                }
                renderItem={({ item, index }) => (
                    <FollowListItem
                        user={item}
                        index={index}
                        toggleFollow={toggleFollow}
                    />
                )}
                keyExtractor={item => item.user_id}
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        flexBasis: 20,
        paddingRight: ICON_PADDING,
    },
});
