import OpeningHoursComponent from '@/components/Pubs/OpeningHoursComponent';
import { BottomSheetStackParamList } from '@/nav/BottomSheetNavigator';
import { parseOpeningHours } from '@/services';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';

export default function OpeningHours({
    route,
}: StackScreenProps<BottomSheetStackParamList, 'OpeningHours'>) {
    return (
        <View>
            <OpeningHoursComponent
                openingHours={parseOpeningHours(route.params.pub.opening_hours)}
            />
        </View>
    );
}
