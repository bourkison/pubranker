import React from 'react';
import { View } from 'react-native';
import SearchSuggestionItem from '@/components/Filters/SearchSuggestionItem';

export default function SearchSuggestionList() {
    return (
        <View>
            <SearchSuggestionItem
                title="Star By Hackney Downs"
                subtitle="Hackney Downs"
                type="pub"
            />
        </View>
    );
}
