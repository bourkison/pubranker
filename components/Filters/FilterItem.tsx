import React, { useState, useRef, useCallback, useEffect } from 'react';
import { TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';

type FilterItemProps = {
    ButtonContent: JSX.Element;
    ModalContent: JSX.Element;
};

export default function FilterItem({
    ButtonContent,
    ModalContent,
}: FilterItemProps) {
    const touchableRef = useRef<TouchableOpacity>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [modalTop, setModalTop] = useState(0);

    const measureModalTop = useCallback(() => {
        return new Promise<number>((resolve, reject) => {
            if (!touchableRef || !touchableRef.current) {
                reject();
                return;
            }

            touchableRef.current.measure(
                (x, y, width, height, pageX, pageY) => {
                    resolve(pageY + height);
                },
            );
        });
    }, [touchableRef]);

    // Set modal top on first load.
    useEffect(() => {
        if (!modalTop) {
            measureModalTop();
        }
    }, [modalTop, measureModalTop]);

    const expandModal = useCallback(() => {
        const expand = async () => {
            const top = await measureModalTop();
            setModalTop(top);
            setModalVisible(true);
        };

        expand();
    }, [measureModalTop]);

    return (
        <>
            <TouchableOpacity ref={touchableRef} onPress={expandModal}>
                {ButtonContent}
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                animationType="none"
                transparent={true}>
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setModalVisible(false)}>
                    <Pressable
                        style={[styles.modalContainer, { top: modalTop }]}>
                        {ModalContent}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
});
