import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import SearchBar from '@/components/Filters/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FiltersContainer() {
    const insets = useSafeAreaInsets();
    const { height } = useWindowDimensions();

    return (
        <View>
            <View
                style={{
                    height: height * 0.1 - 8,
                    justifyContent: 'flex-end',
                    width: '100%',
                }}>
                <SearchBar />
            </View>
        </View>
    );
}
