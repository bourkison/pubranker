import { OpeningHoursType } from '@/types';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Collapsible from 'react-native-collapsible';
import OpeningHoursComponent from '@/components/Pubs/PubView/OpeningHoursComponent';
import { checkIfOpen, timeString } from '@/services';
import dayjs from 'dayjs';
import { Entypo } from '@expo/vector-icons';

type HoursCollapsibleProps = {
    openingHours: OpeningHoursType[];
};

export default function HoursCollapsible({
    openingHours,
}: HoursCollapsibleProps) {
    const [collapsed, setCollapsed] = useState(true);
    const { isOpen } = checkIfOpen(openingHours);

    const todaysHours = openingHours.filter(
        oh => oh.open_day === dayjs().day(),
    );

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.pressableContainer}
                onPress={() => setCollapsed(!collapsed)}>
                <View>
                    <View>
                        <Text style={styles.header}>Hours</Text>
                    </View>
                    <View>
                        <Text>
                            {todaysHours.length > 0
                                ? `${timeString(
                                      todaysHours[0].open_hour,
                                  )} - ${timeString(todaysHours[0].close_hour)}`
                                : 'Closed All Day'}
                        </Text>
                    </View>
                    <View>
                        {isOpen ? (
                            <Text style={styles.openText}>Open</Text>
                        ) : (
                            <Text style={styles.closedText}>Closed</Text>
                        )}
                    </View>
                </View>
                <View>
                    {collapsed ? (
                        <Entypo
                            name="chevron-down"
                            size={16}
                            style={styles.chevron}
                        />
                    ) : (
                        <Entypo
                            name="chevron-up"
                            size={16}
                            style={styles.chevron}
                        />
                    )}
                </View>
            </Pressable>
            <Collapsible collapsed={collapsed} align="bottom">
                <OpeningHoursComponent openingHours={openingHours} />
            </Collapsible>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    header: {
        fontSize: 14,
        fontWeight: '500',
    },
    openText: {
        color: '#16A34A',
    },
    closedText: {
        color: '#dc2626',
    },
    pressableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chevron: {
        marginTop: 5,
    },
});
