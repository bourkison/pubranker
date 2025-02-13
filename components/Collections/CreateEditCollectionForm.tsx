import { Enums } from '@/types/schema';
import React, {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useState,
} from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/services/supabase';
import Sortable from 'react-native-sortables';
import {
    Entypo,
    MaterialIcons,
    FontAwesome6,
    FontAwesome5,
} from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/constants';

const ICON_COLOR = 'rgba(0, 0, 0, 0.8)';
const NO_IMAGE = require('@/assets/noimage.png');

const SELECTED_PUB_COLUMNS = 3;
const IMAGE_PADDING = 10;

const ICON_SIZE = 26;

type CreateEditCollectionFormProps = {
    pubs: { id: number; name: string; primary_photo: string | null }[];
    setPubs: Dispatch<
        SetStateAction<
            { id: number; name: string; primary_photo: string | null }[]
        >
    >;
    name: string;
    setName: Dispatch<SetStateAction<string>>;
    description: string;
    setDescription: Dispatch<SetStateAction<string>>;
    publicity: Enums<'collection_privacy_type'>;
    setPublicity: Dispatch<SetStateAction<Enums<'collection_privacy_type'>>>;
    ranked: boolean;
    setRanked: Dispatch<SetStateAction<boolean>>;
    collaborative: boolean;
    setCollaborative: Dispatch<SetStateAction<boolean>>;
};

export default function CreateEditCollectionForm({
    pubs,
    setPubs,
    name,
    setName,
    description,
    setDescription,
    publicity,
    setPublicity,
    ranked,
    setRanked,
    collaborative,
    setCollaborative,
}: CreateEditCollectionFormProps) {
    const [elementWidth, setElementWidth] = useState(0);

    const { bottom } = useSafeAreaInsets();
    const navigation = useNavigation();

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

    const togglePublicity = useCallback(() => {
        Haptics.selectionAsync();

        if (publicity === 'PUBLIC') {
            setPublicity('FRIENDS_ONLY');
        } else if (publicity === 'FRIENDS_ONLY') {
            setPublicity('PRIVATE');
        } else if (publicity === 'PRIVATE') {
            setPublicity('PUBLIC');
        }
    }, [publicity, setPublicity]);

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

    const navigateToSelect = useCallback(
        () =>
            navigation.navigate('SelectPub', {
                header: 'Select a pub',
                onAdd: pub => {
                    setPubs([...pubs, pub]);
                },
                excludedIds: pubs.map(pub => pub.id),
            }),
        [navigation, pubs, setPubs],
    );

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
