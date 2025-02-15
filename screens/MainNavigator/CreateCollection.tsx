import Header from '@/components/Utility/Header';
import { Enums } from '@/types/schema';
import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR } from '@/constants';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';
import CreateEditCollectionForm from '@/components/Collections/CreateEditCollectionForm';

export default function CreateCollection({
    navigation,
    route,
}: RootStackScreenProps<'CreateCollection'>) {
    const [pubs, setPubs] = useState<
        { id: number; name: string; primary_photo: string | null }[]
    >(
        route.params
            ? [
                  {
                      id: route.params.withPub.id,
                      name: route.params.withPub.name,
                      primary_photo: route.params.withPub.primary_photo,
                  },
              ]
            : [],
    );

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [publicity, setPublicity] =
        useState<Enums<'collection_privacy_type'>>('PUBLIC');
    const [ranked, setRanked] = useState(false);
    const [collaborative, setCollaborative] = useState(false);
    const [collaborators, setCollaborators] = useState<
        { id: string; username: string; profile_photo: string | null }[]
    >([]);

    const [isCreating, setIsCreating] = useState(false);

    const createCollaborators = useCallback(
        async (collectionId: number) => {
            const { error } = await supabase
                .from('collection_collaborations')
                .insert(
                    collaborators.map(collaborator => ({
                        user_id: collaborator.id,
                        collection_id: collectionId,
                    })),
                );

            if (error) {
                console.error(error);
                return;
            }
        },
        [collaborators],
    );

    const createCollectionItems = useCallback(
        async (collectionId: number) => {
            const { error } = await supabase.from('collection_items').insert(
                pubs.map((pub, index) => ({
                    collection_id: collectionId,
                    pub_id: pub.id,
                    order: index + 1,
                })),
            );

            if (error) {
                console.error(error);
                return;
            }
        },
        [pubs],
    );

    const createCollection = useCallback(async () => {
        if (!name || isCreating) {
            return;
        }

        setIsCreating(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error('cant create user error', userError);
            setIsCreating(false);
            return;
        }

        const { data, error } = await supabase
            .from('collections')
            .insert({
                name: name,
                description: description,
                user_id: userData.user.id,
                public: publicity,
                collaborative: collaborative,
                ranked: ranked,
            })
            .select()
            .limit(1)
            .single();

        if (error) {
            console.error(error);
            setIsCreating(false);
            return;
        }

        await Promise.allSettled([
            createCollectionItems(data.id),
            createCollaborators(data.id),
        ]);

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
        isCreating,
        navigation,
        createCollectionItems,
        createCollaborators,
    ]);

    return (
        <View style={styles.container}>
            <Header
                header="New list"
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
                        onPress={createCollection}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                }
            />

            <CreateEditCollectionForm
                collaborators={collaborators}
                setCollaborators={setCollaborators}
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
