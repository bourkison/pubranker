import Header from '@/components/Utility/Header';
import { Enums } from '@/types/schema';
import React, { useCallback, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Entypo,
    MaterialIcons,
    FontAwesome6,
    FontAwesome5,
} from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { PRIMARY_COLOR } from '@/constants';
import Sortable from 'react-native-sortables';
import { supabase } from '@/services/supabase';
import { RootStackScreenProps } from '@/types/nav';

const ICON_COLOR = 'rgba(0, 0, 0, 0.8)';
const NO_IMAGE = require('@/assets/noimage.png');

const SELECTED_PUB_COLUMNS = 3;
const IMAGE_PADDING = 10;

const ICON_SIZE = 26;

export default function CreateCollection({
    navigation,
    route,
}: RootStackScreenProps<'CreateCollection'>) {
    const [elementWidth, setElementWidth] = useState(0);
    const [pubs, setPubs] = useState<
        { id: number; name: string; primary_photo: string | null }[]
    >(
        route.params.collection
            ? route.params.collection.collection_items.map(collectionItem => ({
                  id: collectionItem.pub.id,
                  name: collectionItem.pub.name,
                  primary_photo: collectionItem.pub.primary_photo,
              }))
            : [],
    );

    const [name, setName] = useState(
        route.params.collection ? route.params.collection.name : '',
    );
    const [description, setDescription] = useState(
        route.params.collection ? route.params.collection.description : '',
    );
    const [publicity, setPublicity] = useState<
        Enums<'collection_privacy_type'>
    >(route.params.collection ? route.params.collection.public : 'PUBLIC');
    const [ranked, setRanked] = useState(
        route.params.collection ? route.params.collection.ranked : false,
    );
    const [collaborative, setCollaborative] = useState(
        route.params.collection ? route.params.collection.collaborative : false,
    );

    const [isCreating, setIsCreating] = useState(false);

    const { bottom } = useSafeAreaInsets();

    const pubElementWidth = useMemo<number>(
        () => elementWidth / SELECTED_PUB_COLUMNS,
        [elementWidth],
    );

    const pubImageWidth = useMemo<number>(
        () => pubElementWidth - 2 * IMAGE_PADDING,
        [pubElementWidth],
    );

    const pubImageHeight = useMemo<number>(
        () => pubImageWidth / 1,
        [pubImageWidth],
    );

    const navigateToSelect = useCallback(
        () =>
            navigation.navigate('SelectPub', {
                header: 'Select a pub',
                onAdd: pub => {
                    setPubs([...pubs, pub]);
                },
                excludedIds: pubs.map(pub => pub.id),
            }),
        [navigation, pubs],
    );

    const togglePublicity = useCallback(() => {
        Haptics.selectionAsync();

        if (publicity === 'PUBLIC') {
            setPublicity('FRIENDS_ONLY');
        } else if (publicity === 'FRIENDS_ONLY') {
            setPublicity('PRIVATE');
        } else if (publicity === 'PRIVATE') {
            setPublicity('PUBLIC');
        }
    }, [publicity]);

    const pubImage = useCallback(
        (index: number) => {
            if (pubs[index].primary_photo) {
                return {
                    uri: supabase.storage
                        .from('pubs')
                        .getPublicUrl(pubs[index].primary_photo).data.publicUrl,
                };
            }

            return NO_IMAGE;
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
            return;
        }

        const { error: itemError } = await supabase
            .from('collection_items')
            .insert(
                pubs.map((pub, index) => ({
                    collection_id: data.id,
                    pub_id: pub.id,
                    order: index + 1,
                })),
            );

        if (itemError) {
            console.error(itemError);
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
        isCreating,
        navigation,
        pubs,
    ]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.container}
            onLayout={({
                nativeEvent: {
                    layout: { width },
                },
            }) => setElementWidth(width)}
            bounces={false}
            keyboardDismissMode="on-drag">
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

            <View style={styles.contentContainer}>
                <View style={styles.section}>
                    <View style={styles.nameSectionHeaderContainer}>
                        <Text style={styles.sectionHeaderText}>List name</Text>
                    </View>

                    <View style={styles.nameInputContainer}>
                        <TextInput
                            placeholderTextColor="rgba(0, 0, 0, 0.4)"
                            style={styles.nameInputText}
                            placeholder="Add list name"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <View style={styles.descriptionHeaderContainer}>
                        <Text style={styles.sectionHeaderText}>
                            Description
                        </Text>
                    </View>

                    <View style={styles.descriptionInputContainer}>
                        <TextInput
                            style={styles.descriptionInputText}
                            numberOfLines={5}
                            multiline={true}
                            placeholder="Add description"
                            placeholderTextColor="rgba(0, 0, 0, 0.4)"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                </View>
            </View>

            <Pressable style={styles.addPubSection} onPress={navigateToSelect}>
                <View style={styles.addPubTextSection}>
                    <Text style={styles.sectionHeaderText}>Pubs</Text>

                    <TouchableOpacity onPress={navigateToSelect}>
                        <Text style={styles.addPubsText}>Add pubs...</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView>
                    <Sortable.Grid
                        columns={3}
                        hapticsEnabled={true}
                        data={pubs}
                        keyExtractor={pub => pub.id.toString()}
                        onDragEnd={params => setPubs(params.data)}
                        renderItem={({ item, index }) => (
                            <Pressable
                                style={[
                                    styles.pubContainer,
                                    { width: pubElementWidth },
                                ]}>
                                <Image
                                    source={pubImage(index)}
                                    style={[
                                        styles.pubImage,
                                        {
                                            width: pubImageWidth,
                                            height: pubImageHeight,
                                        },
                                    ]}
                                />

                                <Text style={styles.pubName}>{item.name}</Text>
                            </Pressable>
                        )}
                    />
                </ScrollView>
            </Pressable>

            <View>
                <View
                    style={[
                        styles.settingsSection,
                        {
                            paddingBottom:
                                (styles.settingsSection.paddingBottom || 0) +
                                bottom,
                        },
                    ]}>
                    <Pressable
                        style={styles.settingsColumn}
                        onPress={togglePublicity}>
                        {publicity === 'PUBLIC' && (
                            <View style={styles.settingsIconContainer}>
                                <Entypo
                                    name="globe"
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>Public</Text>
                            </View>
                        )}

                        {publicity === 'FRIENDS_ONLY' && (
                            <View style={styles.settingsIconContainer}>
                                <MaterialIcons
                                    name="people"
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>
                                    Friends Only
                                </Text>
                            </View>
                        )}

                        {publicity === 'PRIVATE' && (
                            <View style={styles.settingsIconContainer}>
                                <Entypo
                                    name="lock"
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>Private</Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.settingsColumn}
                        onPress={() => {
                            Haptics.selectionAsync();
                            setRanked(!ranked);
                        }}>
                        {ranked ? (
                            <View style={styles.settingsIconContainer}>
                                <FontAwesome6
                                    name="ranking-star"
                                    size={ICON_SIZE - 2}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>Ranked</Text>
                            </View>
                        ) : (
                            <View style={styles.settingsIconContainer}>
                                <FontAwesome5
                                    name="random"
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>
                                    Not Ranked
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.settingsColumn}
                        onPress={() => {
                            Haptics.selectionAsync();
                            setCollaborative(!collaborative);
                        }}>
                        {!collaborative ? (
                            <View style={styles.settingsIconContainer}>
                                <MaterialIcons
                                    name="person"
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>
                                    Not Collaborative
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.settingsIconContainer}>
                                <MaterialIcons
                                    name="people"
                                    size={ICON_SIZE}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>
                                    Collaborative
                                </Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        </ScrollView>
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
    contentContainer: {
        paddingTop: 15,
        paddingLeft: 25,
    },
    section: {
        borderColor: '#E5E7EB',
        borderBottomWidth: 1,
        paddingBottom: 15,
    },
    nameSectionHeaderContainer: {},
    sectionHeaderText: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: -0.3,
    },
    nameInputContainer: {
        marginTop: 10,
    },
    nameInputText: {
        fontSize: 16,
        letterSpacing: -0.2,
    },
    descriptionHeaderContainer: {
        marginTop: 15,
    },
    descriptionInputContainer: {
        marginTop: 10,
    },
    descriptionInputText: {
        fontSize: 16,
        letterSpacing: -0.2,
        height: 144,
    },
    addPubSection: {
        marginTop: 15,
        paddingHorizontal: 10,
        flex: 1,
    },
    addPubsText: {
        color: PRIMARY_COLOR,
        fontSize: 16,
        marginTop: 15,
        marginBottom: 15,
        fontWeight: '600',
    },
    settingsSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        paddingTop: 20,
        borderColor: '#E5E7EB',
        borderTopWidth: 1,
    },
    settingsColumn: {
        flex: 1,
    },
    settingsIconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsText: {
        fontWeight: '300',
        fontSize: 12,
        marginTop: 6,
        letterSpacing: -0.2,
    },
    pubImage: {
        borderRadius: 2,
        zIndex: 1,
    },
    pubName: {
        paddingHorizontal: 2,
        marginTop: 2,
        fontSize: 10,
        textAlign: 'center',
    },
    pubContainer: {
        zIndex: 1,
        alignItems: 'center',
        marginVertical: 5,
    },
    addPubTextSection: {
        marginLeft: 20,
    },
});
