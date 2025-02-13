import CreateEditCollectionForm from '@/components/Collections/CreateEditCollectionForm';
import Header from '@/components/Utility/Header';
import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditCollection({
    route,
    navigation,
}: RootStackScreenProps<'EditCollection'>) {
    const [pubs, setPubs] = useState(
        route.params.collection.collection_items.map(collectionItem => ({
            id: collectionItem.pub.id,
            name: collectionItem.pub.name,
            primary_photo: collectionItem.pub.primary_photo,
        })),
    );
    const [name, setName] = useState(route.params.collection.name);
    const [description, setDescription] = useState(
        route.params.collection.description,
    );
    const [publicity, setPublicity] = useState(route.params.collection.public);
    const [ranked, setRanked] = useState(route.params.collection.ranked);
    const [collaborative, setCollaborative] = useState(
        route.params.collection.collaborative,
    );

    const [isUpdating, setIsUpdating] = useState(false);

    const updateCollection = useCallback(async () => {
        if (!name || isUpdating) {
            return;
        }

        setIsUpdating(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error('cant update user error', userError);
            setIsUpdating(false);
            return;
        }

        const { data, error } = await supabase
            .from('collections')
            .update({
                name: name,
                description: description,
                user_id: userData.user.id,
                public: publicity,
                collaborative: collaborative,
                ranked: ranked,
            })
            .eq('id', route.params.collection.id)
            .select()
            .single();

        if (error) {
            console.error('error updating', error);
            setIsUpdating(false);
            return;
        }

        // First delete all collection items.
        const { error: deleteError } = await supabase
            .from('collection_items')
            .delete()
            .eq('collection_id', route.params.collection.id);

        if (deleteError) {
            console.error('Error deleting', deleteError);
            setIsUpdating(false);
            return;
        }

        // Next reupload them in correct order.
        const { error: itemError } = await supabase
            .from('collection_items')
            .insert(
                pubs.map((pub, index) => ({
                    collection_id: route.params.collection.id,
                    pub_id: pub.id,
                    order: index + 1,
                })),
            );

        if (itemError) {
            console.error('end test', itemError);
            setIsUpdating(false);
            return;
        }

        navigation.navigate('Home', {
            screen: 'Favourites',
            params: {
                screen: 'CollectionView',
                params: { collectionId: data.id },
            },
        });
    }, [
        name,
        description,
        publicity,
        collaborative,
        ranked,
        isUpdating,
        navigation,
        pubs,
        route,
    ]);

    return (
        <View style={styles.container}>
            <Header
                header="Update list"
                leftColumn={
                    <TouchableOpacity
                        style={styles.backContainer}
                        onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                }
                rightColumn={
                    <TouchableOpacity
                        style={styles.saveContainer}
                        onPress={updateCollection}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                }
            />

            <CreateEditCollectionForm
                pubs={pubs}
                setPubs={setPubs}
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                publicity={publicity}
                setPublicity={setPublicity}
                ranked={ranked}
                setRanked={setRanked}
                collaborative={collaborative}
                setCollaborative={setCollaborative}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    backText: {
        fontWeight: '300',
    },
    saveContainer: {
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'flex-end',
    },
    saveText: {
        fontWeight: '500',
        color: PRIMARY_COLOR,
    },
});
