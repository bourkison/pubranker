import { supabase } from '@/services/supabase';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

type ProfileTopBarProps = {
    userId: string;
};

export default function ProfileTopBar({ userId }: ProfileTopBarProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [numReviews, setNumReviews] = useState(0);

    useEffect(() => {
        const fetchAmounts = async () => {
            setIsLoading(true);

            const { count, error } = await supabase
                .from('reviews')
                .select('', { count: 'exact' })
                .eq('user_id', userId);

            setIsLoading(false);

            if (error) {
                console.warn(error);
                return;
            }

            setNumReviews(count ?? 0);
        };

        fetchAmounts();
    }, [userId]);

    if (isLoading) {
        return (
            <View style={styles.topBarContainer}>
                <ActivityIndicator style={styles.activityIndicator} />
            </View>
        );
    }

    return (
        <View style={styles.topBarContainer}>
            <View style={styles.topBarColumn}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>{numReviews}</Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>Reviews</Text>
                </View>
            </View>

            <View style={styles.topBarColumn}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>0</Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>Followers</Text>
                </View>
            </View>

            <View style={styles.topBarColumn}>
                <View style={styles.topBarValueContainer}>
                    <Text style={styles.topBarValueText}>0</Text>
                </View>

                <View style={styles.topBarHeaderContainer}>
                    <Text style={styles.topBarHeaderText}>Following</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBarContainer: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    activityIndicator: {
        paddingVertical: 14,
    },
    topBarColumn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBarValueContainer: {},
    topBarValueText: {
        fontSize: 20,
    },
    topBarHeaderContainer: {
        marginTop: 4,
    },
    topBarHeaderText: {
        fontSize: 12,
        fontWeight: '300',
    },
});
