import { PRIMARY_COLOR } from '@/constants';
import { PubSchema } from '@/types';
import React, { useRef } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons';
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import TopSection from './TopSection';
import RateSection from './RateSection';

type RateButtonProps = {
    pub: PubSchema;
};

export default function RateButtonModal({ pub }: RateButtonProps) {
    // const [isLoading, setIsLoading] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    return (
        <>
            <Pressable
                style={styles.button}
                onPress={() => bottomSheetRef.current?.present()}>
                <Text style={styles.buttonText}>Rate, save or add to list</Text>
                <SimpleLineIcons name="options" color={'#fff'} size={10} />
            </Pressable>

            <BottomSheetModal
                backgroundStyle={styles.backgroundModal}
                ref={bottomSheetRef}
                handleComponent={props => (
                    <View {...props}>
                        <Text>{pub.name}</Text>
                    </View>
                )}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        pressBehavior="close"
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.8}
                    />
                )}
                snapPoints={[420]}>
                <View>
                    <View style={styles.modalSection}>
                        <View style={styles.modalSubsection}>
                            <TopSection pub={pub} />
                        </View>

                        <View style={styles.modalSubsection}>
                            <RateSection pub={pub} />
                        </View>

                        <View style={styles.modalSubsection}>
                            <Text style={styles.modalOptionText}>Review</Text>
                        </View>

                        <View style={styles.modalSubsection}>
                            <Text style={styles.modalOptionText}>Share</Text>
                        </View>
                    </View>
                    <View style={styles.modalSection}>
                        <Pressable>
                            <Text style={styles.modalOptionText}>Done</Text>
                        </Pressable>
                    </View>
                </View>
            </BottomSheetModal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: `${PRIMARY_COLOR}ef`,
        height: 30,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        borderRadius: 3,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    },
    backgroundModal: {
        backgroundColor: 'transparent',
    },
    modalSection: {
        backgroundColor: '#fff',
        borderRadius: 6,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        marginBottom: 20,
    },
    modalOptionText: {
        paddingVertical: 15,
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '600',
    },
    modalSubsection: {
        borderBottomWidth: 1,
        borderColor: '#E5E7EB',
    },
});
