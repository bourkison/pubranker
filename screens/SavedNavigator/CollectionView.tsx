import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, View, TouchableOpacity, StyleSheet } from 'react-native';
import { PRIMARY_COLOR } from '@/constants';
import CollectionList from '@/components/Collections/CollectionList';
import Header from '@/components/Utility/Header';

export default function CollectionView({
    navigation,
    route,
}: StackScreenProps<SavedNavigatorStackParamList, 'CollectionView'>) {
    return (
        <SafeAreaView style={styles.container}>
            <Header
                header="List"
                leftColumn={
                    <TouchableOpacity
                        style={styles.settingsContainer}
                        onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={14} />
                    </TouchableOpacity>
                }
                rightColumn={<View style={styles.menuContainer} />}
            />

            <CollectionList collectionId={route.params.collectionId} />
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
    listHeaderContainer: {
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userNameText: {
        marginLeft: 5,
        fontWeight: '300',
        fontSize: 14,
    },
    collectionNameText: {
        fontSize: 18,
        fontWeight: '500',
        fontFamily: 'Jost',
        marginTop: 10,
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: '300',
        marginTop: 20,
    },
    topListHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    followContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    followText: {
        marginLeft: 4,
        color: PRIMARY_COLOR,
        fontWeight: '500',
    },
    privacyContainer: {
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    privacyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 3,
    },
    privacyItemText: {
        fontSize: 12,
        fontWeight: '300',
        letterSpacing: -0.4,
        marginLeft: 2,
    },
});
