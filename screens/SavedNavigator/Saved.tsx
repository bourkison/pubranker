import React, { useMemo, useState } from 'react';
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
import { ListCollectionType } from '@/services/queries/collections';
import CollectionsHome from './CollectionsHome';

export default function SavedPubs({
    navigation,
}: SavedNavigatorScreenProps<'SavedHome'>) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedPage, setSelectedPage] = useState(0);

    const [favourites, setFavourites] = useState<SavedType['pub'][]>([]);
    const [hasLoadedFavourites, setHasLoadedFavourites] = useState(false);

    const [collections, setCollections] = useState<ListCollectionType[]>([]);
    const [hasLoadedCollections, setHasLoadedCollections] = useState(false);

    const rightColumn = useMemo<JSX.Element>(() => {
        if (selectedPage === 2) {
            return (
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateCollection')}
                    style={styles.createContainer}>
                    <Feather name="plus" size={HEADER_ICON_SIZE} />
                </TouchableOpacity>
            );
        }

        return <View style={styles.cancelContainer} />;
    }, [selectedPage, navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="Saved"
                leftColumn={<View style={styles.cancelContainer} />}
                rightColumn={rightColumn}
            />

            <View style={styles.pageContainer}>
                <PageTabs
                    selectedPage={selectedPage}
                    setSelectedPage={setSelectedPage}
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
                                <CollectionsHome
                                    hasLoaded={hasLoadedCollections}
                                    setHasLoaded={setHasLoadedCollections}
                                    collections={collections}
                                    setCollections={setCollections}
                                />
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
