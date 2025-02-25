import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '@/components/Utility/Header';
import { SavedNavigatorScreenProps } from '@/types/nav';
import { HEADER_ICON_SIZE } from '@/constants';
import PageTabs from '@/components/Utility/PageTabs';
import FavouritesHome, {
    SavedType,
} from '@/screens/SavedNavigator/FavouritesHome';

export default function SavedPubs({
    navigation,
}: SavedNavigatorScreenProps<'SavedHome'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favourites, setFavourites] = useState<SavedType['pub'][]>([]);
    const [hasLoadedFavourites, setHasLoadedFavourites] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="Saved"
                leftColumn={<View style={styles.cancelContainer} />}
                rightColumn={
                    <TouchableOpacity
                        onPress={() => navigation.navigate('CreateCollection')}
                        style={styles.createContainer}>
                        <Feather name="plus" size={HEADER_ICON_SIZE} />
                    </TouchableOpacity>
                }
            />

            <View style={styles.pageContainer}>
                <PageTabs
                    pages={[
                        {
                            title: 'Favourites',
                            component: (
                                <FavouritesHome
                                    hasLoaded={hasLoadedFavourites}
                                    setHasLoaded={setHasLoadedFavourites}
                                    favourites={favourites}
                                    setFavourites={setFavourites}
                                    isLoggedIn={isLoggedIn}
                                    setIsLoggedIn={setIsLoggedIn}
                                />
                            ),
                        },
                        {
                            title: 'Wishlist',
                            component: (
                                <View>
                                    <Text>Wishlist</Text>
                                </View>
                            ),
                        },
                        {
                            title: 'Lists',
                            component: (
                                <View>
                                    <Text>Lists</Text>
                                </View>
                            ),
                        },
                    ]}
                />
            </View>
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageContainer: {
        flex: 1,
        width: '100%',
    },

    cancelContainer: {
        paddingLeft: ICON_PADDING,
        flex: 1,
    },
    createContainer: {
        paddingRight: ICON_PADDING,
        flex: 1,
        alignItems: 'flex-end',
    },
});
