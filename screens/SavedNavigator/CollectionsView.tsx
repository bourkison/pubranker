import { SavedNavigatorStackParamList } from '@/nav/SavedNavigator';
import { supabase } from '@/services/supabase';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function CollectionsView({
    navigation,
    route,
}: StackScreenProps<SavedNavigatorStackParamList, 'CollectionsView'>) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCollection = async () => {
            setIsLoading(true);

            const { data, error } = await supabase
                .from('collections')
                .select(
                    `
                id,
                name,
                pubs(id, name, saves(count))
                `,
                )
                .eq('id', route.params.collectionId);

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            setIsLoading(false);
            console.log('data', JSON.stringify(data));
        };

        fetchCollection();
    }, []);

    return (
        <SafeAreaView>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.settingsContainer}
                    onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={14} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>{}</Text>
                </View>

                <View style={styles.menuContainer} />
            </View>
        </SafeAreaView>
    );
}

const ICON_PADDING = 10;

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Jost',
        textAlign: 'center',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
    },
});
