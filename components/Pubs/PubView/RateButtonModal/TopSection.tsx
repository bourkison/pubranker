import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch } from '@/store/hooks';
import { supabase } from '@/services/supabase';
import { setPubSave } from '@/store/slices/explore';
import { FetchPubType } from '@/services/queries/pub';

type TopSectionProps = {
    pub: FetchPubType;
    navigateToAddToCollection: () => void;
};

const ICON_SIZE = 40;

export default function TopSection({
    pub,
    navigateToAddToCollection,
}: TopSectionProps) {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSaved(pub.saved[0].count > 0);
    }, [pub]);

    const toggleSaveLocal = useCallback(async () => {
        if (isSaving) {
            return;
        }

        setIsSaving(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            return;
        }

        if (!pub.saved) {
            setSaved(true);

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (!error) {
                dispatch(setPubSave({ id: pub.id, value: true }));
            } else {
                setSaved(false);

                console.error(error);
            }
        } else {
            setSaved(false);

            const { error } = await supabase
                .from('saves')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            setIsSaving(false);

            if (!error) {
                dispatch(setPubSave({ id: pub.id, value: false }));
            } else {
                setSaved(true);
                console.error(error);
            }
        }
    }, [dispatch, isSaving, pub]);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.column} onPress={toggleSaveLocal}>
                {saved ? (
                    <Ionicons name="heart" size={ICON_SIZE} color="#dc2626" />
                ) : (
                    <Ionicons
                        name="heart-outline"
                        size={ICON_SIZE}
                        color="#dc2626"
                    />
                )}
                <Text style={styles.headerText}>Favourite</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.column}
                onPress={navigateToAddToCollection}>
                <Feather name="plus" size={ICON_SIZE} color={'#000'} />
                <Text style={styles.headerText}>Add to List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.column}>
                <MaterialIcons
                    name="location-history"
                    size={ICON_SIZE}
                    color={'#000'}
                />
                <Text style={styles.headerText}>Check In</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 20,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        marginTop: 5,
        fontWeight: '300',
        fontSize: 12,
    },
});
