// CustomAlert.js
import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAlert = forwardRef(({ initialTitle, initialMessage, ActionLText, ActionRText }, ref) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState(initialTitle);
    const [alertMessage, setAlertMessage] = useState(initialMessage);
    const [onActionR, setActionR] = useState(() => () => { }); // Callback for Edit button
    const [onActionL, setOnActionL] = useState(() => () => { }); // Callback for Yes button

    const [getActionLText, setActionLText] = useState(ActionLText); // Initial value set to an empty string
    const [getActionRText, setActionRText] = useState(ActionRText); // Initial value set to an empty string


    useImperativeHandle(ref, () => ({
        showAlert: (title, message, ActionR, ActionL) => {
            setAlertTitle(title);
            setAlertMessage(message);
            setActionR(() => ActionR); // Set the edit action
            setOnActionL(() => ActionL); // Set the yes action
            setModalVisible(true);
        },
        hideAlert: () => {
            setModalVisible(false);
        },
    }));

    return (
        <Modal transparent={true} animationType="slide" visible={modalVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>{alertTitle}</Text>
                    <Text style={styles.message}>{alertMessage}</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => { onActionR(); setModalVisible(false); }}>
                            <Text style={styles.buttonText}>{getActionLText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => { onActionL(); setModalVisible(false); }}>
                            <Text style={styles.buttonText}>{getActionRText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 17, // Low font size for title
        fontFamily: "fontMedium",
        marginBottom: 10,
    },
    message: {
        fontSize: 20, // High font size for message
        marginBottom: 20,
        fontFamily: "fontBold",
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        padding: 8, // Smaller padding for small buttons
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',


    },
    buttonText: {
        fontFamily: "fontBold",
        fontSize: 17,
        textAlign: 'center',
        color: "#002B5B",
    },
});

export default CustomAlert;
