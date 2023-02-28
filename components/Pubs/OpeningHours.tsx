import { dayString, timeString } from '@/services';
import { OpeningHoursType } from '@/types';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type OpeningHoursProps = {
    openingHours: OpeningHoursType[];
};

export default function OpeningHours({ openingHours }: OpeningHoursProps) {
    const testing = useMemo(() => {
        return Array.from(Array(7)).map((_, index) => {
            console.log('INDEX:', index);
            let dayNum = index + 1;
            if (dayNum > 6) {
                dayNum = 0;
            }

            const openingHour = openingHours.find(oh => oh.open_day === dayNum);

            if (!openingHour) {
                console.log('CLOSED:', openingHours);

                return (
                    <View key={index} style={styles.rowContainer}>
                        <View style={styles.columnContainer}>
                            <Text style={styles.valuesText}>
                                {dayString(dayNum)}
                            </Text>
                        </View>
                        <View style={styles.columnContainer}>
                            <Text style={styles.valuesText}>Closed</Text>
                        </View>
                    </View>
                );
            }

            return (
                <View key={index} style={styles.rowContainer}>
                    <View style={styles.columnContainer}>
                        <Text style={styles.valuesText}>
                            {dayString(openingHour.open_day)}
                        </Text>
                    </View>
                    <View style={styles.columnContainer}>
                        <Text style={styles.valuesText}>
                            {timeString(openingHour.open_hour)} -{' '}
                            {timeString(openingHour.close_hour)}
                        </Text>
                    </View>
                </View>
            );
        });
    }, [openingHours]);

    return (
        <View>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                    <Text>Day</Text>
                </View>
                <View style={styles.columnContainer}>
                    <Text>Hours</Text>
                </View>
            </View>
            {testing}
        </View>
    );
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
});
