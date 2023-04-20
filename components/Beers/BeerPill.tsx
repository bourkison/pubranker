import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type Beer = Database['public']['Tables']['beers']['Row'];

type BeerPillProps = {
    beer: Beer;
};

export default function BeerPill({ beer }: BeerPillProps) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (beer.logo) {
            setImageUrl(
                supabase.storage.from('beers').getPublicUrl(beer.logo).data
                    .publicUrl,
            );
        }
    }, [beer]);

    return (
        <View style={styles.container}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.logo} />
            ) : undefined}
            <Text style={styles.title}>{beer.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 6,
        borderColor: '#a3a3a3',
        borderRadius: 20,
        borderWidth: 1,
        marginLeft: 10,
    },
    logo: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    title: {
        marginLeft: 4,
    },
});
