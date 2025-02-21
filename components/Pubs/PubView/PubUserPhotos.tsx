import Gallery from '@/components/Utility/Gallery';
import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

type PubUserPhotosType = {
    pubId: number;
};

export default function PubUserPhotos({ pubId }: PubUserPhotosType) {
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const { data, error } = await supabase.rpc('get_pub_user_photos', {
                pub_id: pubId,
            });

            if (error) {
                console.error(error);
                return;
            }

            setPhotos(data.map(d => d.photos));
            setIsLoading(false);
        })();
    }, [pubId]);

    if (isLoading) {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <View>
            <Gallery type="reviews" photos={photos} />
        </View>
    );
}
