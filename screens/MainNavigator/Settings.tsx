import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { FAIL_COLOR } from '@/constants';
import { useAppDispatch } from '@/store/hooks';
import { signOut as storeSignOut } from '@/store/slices/user';
import SettingsFavourites from '@/components/Settings/SettingsFavourites';
import { UserType } from '@/services/queries/user';
import { supabase } from '@/services/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AvatarUpload from '@/components/Settings/AvatarUpload';

const RIGHT_COLUMN_COLOR = 'rgba(0, 0, 0, 0.6)';

export default function Settings({
    navigation,
    route,
}: StackScreenProps<MainNavigatorStackParamList, 'Settings'>) {
    const [displayName, setDisplayName] = useState(route.params.name);
    const [location, setLocation] = useState(route.params.location);
    const [favourites, setFavourites] = useState(route.params.favourites);
    const [profilePhoto, setProfilePhoto] = useState(
        route.params.profile_photo,
    );

    const [isSaving, setIsSaving] = useState(false);

    const { bottom } = useSafeAreaInsets();

    const favouritesChanged = useCallback(() => {
        if (route.params.favourites.length !== favourites.length) {
            return true;
        }

        for (let i = 0; i < favourites.length; i++) {
            if (favourites[i].pubs.id !== route.params.favourites[i].pubs.id) {
                return true;
            }
        }

        return false;
    }, [route, favourites]);

    const userChanged = useCallback(() => {
        if (displayName !== route.params.name) {
            return true;
        }

        if (location !== route.params.location) {
            return true;
        }

        return false;
    }, [displayName, location, route]);

    const removeFavourite = useCallback(
        (index: number) => {
            const temp = favourites.slice();

            if (temp[index]) {
                setFavourites(temp.filter(item => item.id !== temp[index].id));
            }
        },
        [favourites],
    );

    const addFavourite = useCallback(
        (favourite: UserType['favourites'][number]) => {
            setFavourites([...favourites, favourite]);
        },
        [favourites],
    );

    const updateFavourites = useCallback(async () => {
        return new Promise<void>(async (resolve, reject) => {
            // First delete all favourites.
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error('User error', userError);
                reject(userError);
                return;
            }

            const { error: deleteError } = await supabase
                .from('favourites')
                .delete()
                .eq('user_id', userData.user.id);

            if (deleteError) {
                console.error('Error deleting', deleteError);
                reject(deleteError);
                return;
            }

            const { error } = await supabase.from('favourites').upsert(
                favourites.map((favourite, index) => ({
                    pub_id: favourite.pubs.id,
                    user_id: userData.user.id,
                    count: index + 1,
                })),
            );

            if (error) {
                console.error('Error uploading', error);
                reject(error);
                return;
            }

            resolve();
        });
    }, [favourites]);

    const updateUser = useCallback(async () => {
        return new Promise<void>(async (resolve, reject) => {
            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.error(userError);
                reject(userError);
                return;
            }

            const { error } = await supabase
                .from('users_public')
                .update({
                    name: displayName,
                    location: location,
                })
                .eq('id', userData.user.id);

            if (error) {
                console.error(error);
                reject(error);
                return;
            }

            resolve();
        });
    }, [displayName, location]);

    const saveChanges = useCallback(async () => {
        setIsSaving(true);
        let promises: Promise<void>[] = [];

        if (favouritesChanged()) {
            promises.push(updateFavourites());
        }

        if (userChanged()) {
            promises.push(updateUser());
        }

        await Promise.allSettled(promises);

        setIsSaving(false);
        navigation.goBack();
    }, [
        updateFavourites,
        favouritesChanged,
        navigation,
        updateUser,
        userChanged,
    ]);

    const dispatch = useAppDispatch();

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.cancelContainer}
                    onPress={() => navigation.goBack()}>
                    <Text>Back</Text>
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Settings</Text>
                </View>

                <TouchableOpacity
                    style={styles.saveContainer}
                    disabled={isSaving}
                    onPress={saveChanges}>
                    <Text>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={{ paddingBottom: bottom }}
                keyboardDismissMode="interactive">
                <View>
                    <View style={styles.loggedInContainer}>
                        <Text style={styles.itemText}>Logged in as </Text>
                        <Text style={styles.usernameText}>
                            {route.params.username}
                        </Text>
                    </View>

                    <TouchableHighlight
                        style={styles.itemContainer}
                        underlayColor={'#E5E7EB'}
                        onPress={() => console.log('Password')}>
                        <>
                            <Text style={styles.itemText}>
                                Password and account
                            </Text>
                            <Feather
                                name="chevron-right"
                                size={18}
                                color={RIGHT_COLUMN_COLOR}
                            />
                        </>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.itemContainer}
                        underlayColor={'#E5E7EB'}
                        onPress={() => dispatch(storeSignOut())}>
                        <Text style={styles.signOutText}>Sign out</Text>
                    </TouchableHighlight>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Profile</Text>

                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Display name</Text>

                        <TextInput
                            value={displayName}
                            onChangeText={setDisplayName}
                            selectTextOnFocus={true}
                            textAlign="right"
                            style={styles.inputText}
                        />
                    </View>

                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>Location</Text>

                        <TextInput
                            value={location}
                            onChangeText={setLocation}
                            selectTextOnFocus={true}
                            textAlign="right"
                            style={styles.inputText}
                        />
                    </View>

                    <TouchableHighlight
                        style={styles.itemContainer}
                        underlayColor={'#E5E7EB'}
                        onPress={() => console.log('Email')}>
                        <>
                            <Text style={styles.itemText}>Email</Text>

                            <View style={styles.inlineRightColumn}>
                                <Text style={styles.inlineRightColumnText}>
                                    {route.params.email}
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
                        underlayColor={'#E5E7EB'}
                        onPress={() => console.log('Bio')}>
                        <>
                            <Text style={styles.itemText}>Bio</Text>
                            <Feather
                                name="chevron-right"
                                size={18}
                                color={RIGHT_COLUMN_COLOR}
                            />
                        </>
                    </TouchableHighlight>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Favourites</Text>

                    <SettingsFavourites
                        favourites={favourites}
                        onRemove={removeFavourite}
                        addFavourite={addFavourite}
                        setFavourites={setFavourites}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Avatar</Text>

                    <View style={styles.avatarContainer}>
                        <AvatarUpload
                            profilePhoto={profilePhoto}
                            setProfilePhoto={setProfilePhoto}
                        />
                    </View>
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>
                        Additional Settings
                    </Text>

                    <TouchableHighlight
                        style={styles.itemContainer}
                        underlayColor={'#E5E7EB'}
                        onPress={() => console.log('Notifications')}>
                        <>
                            <Text style={styles.itemText}>Notifications</Text>
                            <Feather
                                name="chevron-right"
                                size={18}
                                color={RIGHT_COLUMN_COLOR}
                            />
                        </>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.itemContainer}
                        underlayColor={'#E5E7EB'}
                        onPress={() => console.log('Privacy Policy')}>
                        <>
                            <Text style={styles.itemText}>Privacy policy</Text>
                            <Feather
                                name="chevron-right"
                                size={18}
                                color={RIGHT_COLUMN_COLOR}
                            />
                        </>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={styles.itemContainer}
                        underlayColor={'#E5E7EB'}
                        onPress={() => console.log('Terms of Use')}>
                        <>
                            <Text style={styles.itemText}>Terms of use</Text>
                            <Feather
                                name="chevron-right"
                                size={18}
                                color={RIGHT_COLUMN_COLOR}
                            />
                        </>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flexOne: { flex: 1 },
    container: { flex: 1 },
    headerContainer: {
        paddingVertical: 20,
        paddingHorizontal: 5,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'space-between',
    },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    saveContainer: {
        flex: 1,
        alignItems: 'flex-end',
        paddingHorizontal: 10,
    },
    hiddenText: {
        color: 'transparent',
    },
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        fontWeight: '500',
    },
    scrollContainer: {
        flex: 1,
    },
    loggedInContainer: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: '#E5E7EB',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    usernameText: {
        fontWeight: '600',
    },
    itemText: {},
    itemContainer: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    signOutText: {
        fontWeight: '600',
        color: FAIL_COLOR,
    },
    sectionContainer: {
        marginTop: 40,
    },
    sectionHeader: {
        textTransform: 'uppercase',
        fontSize: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        paddingBottom: 10,
        borderColor: '#E5E7EB',
    },
    inputText: {
        flex: 1,
    },
    inlineRightColumn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    inlineRightColumnText: {
        marginRight: 3,
    },
    avatarContainer: {
        marginTop: 20,
        marginHorizontal: 20,
    },
});
