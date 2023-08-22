import { dayString, timeString } from '@/services';
import { OpeningHoursType } from '@/types';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OpeningHoursComponentProps = {
    openingHours: OpeningHoursType[];
};

export default function OpeningHoursComponent({
    openingHours,
}: OpeningHoursComponentProps) {
    const testing = useMemo(() => {
        const today = dayjs().day();

        return Array.from(Array(7)).map((_, index) => {
            let dayNum = index + 1;
            if (dayNum > 6) {
                dayNum = 0;
            }

            const openingHour = openingHours.find(oh => oh.open_day === dayNum);

            if (!openingHour) {
                return (
                    <View key={index} style={styles.rowContainer}>
                        <View style={styles.columnContainer}>
                            <Text
                                style={[
                                    styles.valuesText,
                                    today === dayNum
                                        ? styles.todayText
                                        : undefined,
                                ]}>
                                {dayString(dayNum)}
                            </Text>
                        </View>
                        <View style={styles.columnContainer}>
                            <Text
                                style={[
                                    styles.valuesText,
                                    today === dayNum
                                        ? styles.todayText
                                        : undefined,
                                ]}>
                                Closed
                            </Text>
                        </View>
                    </View>
                );
            }

            return (
                <View key={index} style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <Text
                            style={[
                                styles.valuesText,
                                today === dayNum ? styles.todayText : undefined,
                            ]}>
                            {dayString(openingHour.open_day)}
                        </Text>
                    </View>
                    <View style={styles.columnContainer}>
                        <Text
                            style={[
                                styles.valuesText,
                                today === dayNum ? styles.todayText : undefined,
                            ]}>
                            {timeString(openingHour.open_hour)} -{' '}
                            {timeString(openingHour.close_hour)}
                        </Text>
                    </View>
                </View>
            );
        });
    }, [openingHours]);

    return <View>{testing}</View>;
}

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    columnContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    valuesText: {
        color: '#A3A3A3',
    },
    todayText: {
        fontWeight: 'bold',
    },
});
