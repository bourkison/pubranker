import CollectionListItem from '@/components/Collections/CollectionListItem';
import {
    ListCollectionType,
    listFollowedCollectionsQuery,
} from '@/services/queries/collections';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    SafeAreaView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackScreenProps } from '@/types/nav';
import Header from '@/components/Utility/Header';
import { supabase } from '@/services/supabase';

export default function UserCollections({
    route,
    navigation,
}: RootStackScreenProps<'UserCollections'>) {
    const [collections, setCollections] = useState<ListCollectionType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data: testData, error: testError } = await supabase
                .from('collections')
                .select()
                .eq('user_id', route.params.userId);

            console.log('COLLECTION DATA', testData, testError);

            const { data, error } = await listFollowedCollectionsQuery()
                .eq('user_id', route.params.userId)
                .order('updated_at', { ascending: false });

            if (error) {
                setIsLoading(false);
                console.error(error);
                return;
            }

            console.log('FOLLOW DATA', data);

            setCollections(data.map(d => d.collections));
            setIsLoading(false);
        })();
    }, [route]);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="Lists"
                leftColumn={
                    <TouchableOpacity
                        style={styles.backContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={14} />
                    </TouchableOpacity>
                }
                rightColumn={<View style={styles.emptyContainer} />}
            />

            <FlatList
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        <View>
                            <Text>
                                No collections yet. Hit the plus at the top
                                right to add.
                            </Text>
                        </View>
                    )
                }
                data={collections}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <CollectionListItem
                        collection={item}
                        onPress={() =>
                            navigation.navigate('UserCollectionView', {
                                collectionId: item.id,
                            })
                        }
                    />
                )}
                keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {},
    backContainer: {
        paddingLeft: ICON_PADDING,
    },
    emptyContainer: {
        flexBasis: 32,
    },
});
