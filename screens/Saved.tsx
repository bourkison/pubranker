import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    View,
    StyleSheet,
    RefreshControl,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import Unauthorized from '@/screens/Unauthorized';

import { Database } from '@/types/schema';
import { supabase } from '@/services/supabase';
import { convertFormattedPubsToPubSchema } from '@/services';
import { Text } from 'react-native';
import { Feather, SimpleLineIcons } from '@expo/vector-icons';
import BottomSheetPubItem from '@/components/Pubs/BottomSheetPubItem';

export default function SavedPubs() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pubs, setPubs] = useState<
        Database['public']['Tables']['pub_schema']['Row'][]
    >([]);

    const { width } = useWindowDimensions();

    useEffect(() => {
        const fetchSaved = async () => {
            setIsLoading(true);
            setIsLoggedIn(false);

            const { data: userData, error: userError } =
                await supabase.auth.getUser();

            if (userError) {
                console.warn(userError);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);

            const { data: savesData, error: savesError } = await supabase
                .from('saves')
                .select()
                .eq('user_id', userData.user.id)
                .order('created_at', { ascending: false });

            if (savesError) {
                console.error(savesError);
                setIsLoading(false);
                return;
            }

            console.log('saves', savesData);

            const { data, error } = await supabase
                .from('formatted_pubs')
                .select()
                .in(
                    'id',
                    savesData.map(s => s.pub_id),
                );

            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            console.log('pubs', data);

            setIsLoading(false);
            setPubs(data.map(d => convertFormattedPubsToPubSchema(d)));
        };

        fetchSaved();
    }, []);

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (!isLoggedIn) {
        return <Unauthorized type="saved" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.settingsContainer}>
                    <Feather name="settings" size={18} />
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Saved</Text>
                </View>

                <TouchableOpacity style={styles.menuContainer}>
                    <SimpleLineIcons name="options" size={18} />
                </TouchableOpacity>
            </View>
            <FlatList
                ListEmptyComponent={
                    <View>
                        <Text>Empty</Text>
                    </View>
                }
                ListHeaderComponent={<View style={styles.marginTopView} />}
                data={pubs}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width,
                        }}>
                        <BottomSheetPubItem pub={item} />
                    </View>
                )}
                keyExtractor={item => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        onRefresh={() => {
                            setIsRefreshing(false);
                            console.log('refresh');
                        }}
                        refreshing={isRefreshing}
                    />
                }
            />
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
    marginTopView: {
        marginTop: 10,
    },
    headerContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    settingsContainer: {
        paddingLeft: ICON_PADDING,
    },
    menuContainer: {
        paddingRight: ICON_PADDING,
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
});
