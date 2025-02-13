import Header from '@/components/Utility/Header';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { Enums } from '@/types/schema';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
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

const ICON_COLOR = 'rgba(0, 0, 0, 0.8)';

export default function CreateCollection({
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'CreateCollection'>) {
    const [listName, setListName] = useState('');
    const [description, setDescription] = useState('');
    const [publicity, setPublicity] =
        useState<Enums<'collection_privacy_type'>>('PUBLIC');

    const [ranked, setRanked] = useState(false);
    const [collaborative, setCollaborative] = useState(false);

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

    const { bottom } = useSafeAreaInsets();

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.container}
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
                    <TouchableOpacity style={styles.saveContainer}>
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
                            value={listName}
                            onChangeText={setListName}
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

                <Pressable style={styles.addPubSection}>
                    <Text style={styles.sectionHeaderText}>Pubs</Text>

                    <TouchableOpacity>
                        <Text style={styles.addPubsText}>Add pubs...</Text>
                    </TouchableOpacity>
                </Pressable>
            </View>
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
                                    size={36}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>Public</Text>
                            </View>
                        )}

                        {publicity === 'FRIENDS_ONLY' && (
                            <View style={styles.settingsIconContainer}>
                                <MaterialIcons
                                    name="people"
                                    size={38}
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
                                    size={36}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>Private</Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable
                        style={styles.settingsColumn}
                        onPress={() => setRanked(!ranked)}>
                        {ranked ? (
                            <View style={styles.settingsIconContainer}>
                                <FontAwesome6
                                    name="ranking-star"
                                    size={36}
                                    color={ICON_COLOR}
                                />

                                <Text style={styles.settingsText}>Ranked</Text>
                            </View>
                        ) : (
                            <View style={styles.settingsIconContainer}>
                                <FontAwesome5
                                    name="random"
                                    size={36}
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
                        onPress={() => setCollaborative(!collaborative)}>
                        {!collaborative ? (
                            <View style={styles.settingsIconContainer}>
                                <Entypo
                                    name="lock"
                                    size={36}
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
                                    size={38}
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
        flex: 1,
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
        flex: 1,
    },
    addPubsText: {
        color: PRIMARY_COLOR,
        fontSize: 16,
        marginTop: 20,
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
});
