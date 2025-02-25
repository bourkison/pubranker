import { supabase } from '@/services/supabase';
import { Database } from '@/types/schema';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import BeerPill from '@/components/Beers/BeerPill';

type DraughtBeersListProps = {
    pubId: number;
};

type Beer = Database['public']['Tables']['beers']['Row'];

export default function DraughtBeersList({ pubId }: DraughtBeersListProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [beers, setBeers] = useState<Beer[]>([]);

    useEffect(() => {
        const fetchBeers = async () => {
            setIsLoading(true);

            // TODO: Could do server side using views.
            // First load relationships.
            const { data: relationships, error: relationshipsError } =
                await supabase
                    .from('beer_pub_relationships')
                    .select()
                    .eq('pub_id', pubId);

            if (relationshipsError) {
                // TODO: Handle error
                console.error(relationshipsError);
                return;
            }

            // Then load data.
            const { data, error } = await supabase
                .from('beers')
                .select()
                .in(
                    'id',
                    relationships.map(r => r.beer_id),
                );

            if (error) {
                // TODO: Handle error
                console.error(error);
                return;
            }

            setBeers(data);
            setIsLoading(false);
        };

        fetchBeers();
    }, [pubId]);

    return (
        <>
            <View style={styles.container}>
                {/* <View>
                    <Text style={styles.header}>Draught</Text>
                </View> */}
                {!isLoading ? (
                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        horizontal={true}
                        data={beers}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => <BeerPill beer={item} />}
                    />
                ) : (
                    <ActivityIndicator />
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 25,
    },
    listContainer: {
        paddingRight: 10,
    },
    header: {
        fontWeight: '500',
        fontSize: 16,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
});
