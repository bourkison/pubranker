import { CollectionType } from '@/services/queries/collections';
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import UserAvatar from '@/components/User/UserAvatar';
import { useNavigation } from '@react-navigation/native';

type CollectionCollaboratorsType = {
    collection: CollectionType;
};

const AVATAR_HEIGHT = 42;

export default function CollectionCollaborators({
    collection,
}: CollectionCollaboratorsType) {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Collaborators</Text>
            </View>

            <ScrollView
                horizontal={true}
                contentContainerStyle={styles.scrollableContainer}
                showsHorizontalScrollIndicator={false}>
                <Pressable
                    style={styles.avatarContainer}
                    onPress={() =>
                        navigation.navigate('Profile', {
                            userId: collection.user.id,
                        })
                    }>
                    <UserAvatar
                        photo={collection.user.profile_photo}
                        size={AVATAR_HEIGHT}
                    />
                </Pressable>

                {collection.collaborators.map(collaborator => (
                    <Pressable
                        onPress={() =>
                            navigation.navigate('Profile', {
                                userId: collaborator.user.id,
                            })
                        }
                        key={collaborator.user.id}
                        style={styles.avatarContainer}>
                        <UserAvatar
                            photo={collaborator.user.profile_photo || ''}
                            size={AVATAR_HEIGHT}
                        />
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    headerContainer: {
        marginBottom: 10,
        paddingLeft: 20,
    },
    headerText: {
        textTransform: 'uppercase',
        fontSize: 10,
    },
    avatarContainer: {
        marginHorizontal: 2,
    },
    scrollableContainer: {
        paddingLeft: 10,
    },
});
