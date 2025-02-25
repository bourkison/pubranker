import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, Feather, Fontisto } from '@expo/vector-icons';
import { supabase } from '@/services/supabase';
import { FetchPubType } from '@/services/queries/pub';

type TopSectionProps = {
    pub: FetchPubType;
    navigateToAddToCollection: () => void;
    setSaved: (saved: boolean) => void;
    setWishlisted: (wishlisted: boolean) => void;
};

const ICON_SIZE = 40;

export default function TopSection({
    pub,
    navigateToAddToCollection,
    setSaved,
    setWishlisted,
}: TopSectionProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [isWishlisting, setIsWishlisting] = useState(false);

    const saved = useMemo(() => pub.saved[0].count > 0, [pub]);
    const wishlisted = useMemo(() => pub.wishlisted[0].count > 0, [pub]);

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

        if (!saved) {
            setSaved(true);

            const { error } = await supabase.from('saves').insert({
                pub_id: pub.id,
            });

            setIsSaving(false);

            if (error) {
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

            if (error) {
                setSaved(true);
                console.error(error);
            }
        }
    }, [isSaving, setSaved, saved, pub]);

    const toggleWishlistLocal = useCallback(async () => {
        if (isWishlisting) {
            return;
        }

        setIsWishlisting(true);

        const { data: userData, error: userError } =
            await supabase.auth.getUser();

        if (userError) {
            console.error(userError);
            return;
        }

        if (!wishlisted) {
            setWishlisted(true);

            const { error } = await supabase
                .from('wishlists')
                .insert({ pub_id: pub.id, user_id: userData.user.id });

            if (error) {
                setWishlisted(false);
                console.error(error);
            }
        } else {
            setWishlisted(false);

            const { error } = await supabase
                .from('wishlists')
                .delete()
                .eq('pub_id', pub.id)
                .eq('user_id', userData.user.id);

            if (error) {
                setWishlisted(false);
                console.error(error);
            }
        }

        setIsWishlisting(false);
    }, [isWishlisting, setWishlisted, wishlisted, pub]);

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

            <TouchableOpacity
                style={styles.column}
                onPress={toggleWishlistLocal}>
                {wishlisted ? (
                    <Fontisto
                        name="bookmark-alt"
                        size={ICON_SIZE}
                        color={'#000'}
                    />
                ) : (
                    <Fontisto name="bookmark" size={ICON_SIZE} color={'#000'} />
                )}
                <Text style={styles.headerText}>
                    Wishlist{wishlisted ? 'ed' : ''}
                </Text>
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
