import { SECONDARY_COLOR } from '@/constants';
import { MainNavigatorStackParamList } from '@/nav/MainNavigator';
import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function CreateReview({
    route,
    navigation,
}: StackScreenProps<MainNavigatorStackParamList, 'CreateReview'>) {
    const [isLoading, setIsLoading] = useState(false);
    const [pub, setPub] =
        useState<Database['public']['Tables']['pubs']['Row']>();

    const [review, setReview] =
        useState<Database['public']['Tables']['reviews']['Insert']>();

    useEffect(() => {
        const fetchData = async () => {
            const fetchPub = () => {
                return new Promise<void>(async (resolve, reject) => {
                    const { data, error } = await supabase
                        .from('pubs')
                        .select()
                        .eq('id', route.params.pubId)
                        .limit(1)
                        .single();

                    if (error) {
                        reject(error);
                        return;
                    }

                    setPub(data);
                    resolve();
                });
            };

            const fetchReview = () => {
                return new Promise<void>(async (resolve, reject) => {
                    const { data: userData, error: userError } =
                        await supabase.auth.getUser();

                    if (userError) {
                        console.error(userError);
                        reject(userError);
                        return;
                    }

                    const { data, error } = await supabase
                        .from('reviews')
                        .select()
                        .eq('pub_id', route.params.pubId)
                        .eq('user_id', userData.user.id)
                        .limit(1)
                        .single();

                    if (error) {
                        setReview({
                            pub_id: route.params.pubId,
                            content: '',
                            rating: 0,
                        });
                        resolve();
                        return;
                    }

                    setReview(data);
                    resolve();
                });
            };

            await Promise.allSettled([fetchPub(), fetchReview()]);
            setIsLoading(false);
        };

        fetchData();
    }, [route]);

    return (
        <View>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.cancelContainer}
                    onPress={() => navigation.goBack()}>
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>Review</Text>
                </View>

                <TouchableOpacity style={styles.saveContainer}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? <ActivityIndicator /> : <View></View>}
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
    saveContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    saveText: {
        color: SECONDARY_COLOR,
        fontWeight: 'bold',
    },
    cancelContainer: {
        flex: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
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
