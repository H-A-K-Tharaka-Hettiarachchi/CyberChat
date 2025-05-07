

import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from 'expo-router';
import CustomAlert from './MyAlert';

export default function AddEmail() {

    const parameters = useLocalSearchParams();

    const userObject = JSON.parse(parameters.user);


    const [getEmail, setEmail] = useState("");

    const [loaded, error] = useFonts({
        'fontBold': require('../assets/fonts/Rajdhani-Bold.ttf'),
        'fontLight': require('../assets/fonts/Rajdhani-Light.ttf'),
        'fontMedium': require('../assets/fonts/Rajdhani-Medium.ttf'),
        'fontRegular': require('../assets/fonts/Rajdhani-Regular.ttf'),
    });

    const alertRef = useRef(null);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);
    if (!loaded && !error) {
        return null;
    }


    return (
        <SafeAreaView style={stylesheet.container}>
            <View style={stylesheet.body}>

                <View style={stylesheet.titleView}>
                    <Text style={stylesheet.title}>Enter your Email</Text>
                </View>
                <Text style={stylesheet.text}>We'll send a verification code to this email address.</Text>

                <View style={stylesheet.bodyMain}>
                    <View style={stylesheet.bodySub1}>
                        <TextInput style={stylesheet.input} placeholder={"Email"} inputMode={"email"} onChangeText={(text) => {
                            setEmail(text);
                        }} />
                    </View>
                    <View style={stylesheet.bodySub2}>
                        <Pressable style={stylesheet.btn} onPress={
                            async () => {

                                if (getEmail == "" || getEmail.trim().length === 0) {
                                    Alert.alert("Warning", "Please Enter Email Address");
                                } else {

                                    userObject.email = getEmail;
                                    console.log(userObject)

                                    const showCustomAlert = () => {
                                        alertRef.current.showAlert(
                                            'Is this Correct Email ?',
                                            getEmail,
                                            handleEdit,
                                            handleYes,
                                        );
                                    };

                                    const handleYes = async () => {
                                        let response = await fetch("http://192.168.8.187:8080/CyberChat/CheckEmail",
                                            {
                                                method: "POST",
                                                body: JSON.stringify(userObject),
                                            }
                                        );

                                        if (response.ok) {

                                            let json = await response.json();

                                            if (json.success) {

                                                if (json.msg == "new") {
                                                    router.replace("/VerifyEmail?user=" + JSON.stringify(userObject));
                                                }
                                                else if (json.msg == "using") {
                                                    router.replace("/AddEmail?user=" + JSON.stringify(userObject));
                                                    Alert.alert("Error", "This Email Address id Already Using.");
                                                    
                                                }
                                            }


                                        }
                                    };

                                    const handleEdit = () => {
                                        router.replace("/AddEmail?user=" + JSON.stringify(userObject));
                                        // Add additional actions for the Edit button here
                                    };

                                    showCustomAlert();


                                }


                            }
                        }>
                            <Text style={stylesheet.btnText}>Next</Text>
                        </Pressable>

                        <CustomAlert
                            ref={alertRef}
                            initialTitle="Is this Correct Email ?"
                            initialMessage={getEmail}
                            ActionLText={"Edit"}
                            ActionRText={"Yes"}
                        />


                    </View>
                </View>

            </View>
        </SafeAreaView>
    );
}


const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
        backgroundColor: "white",
        rowGap: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    titleView: {
        paddingVertical: 15,
    },
    title: {
        fontSize: 20,
        fontFamily: "fontBold",
        color: "#002B5B",
    },
    text: {
        fontSize: 17,
        color: "black",
        fontFamily: "fontMedium",
        // marginBottom: 150,
    },
    bodyMain: {
        flex: 1,
        width: "100%",
        alignItems: "center",
    },
    bodySub1: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        rowGap: 5,
    },
    bodySub2: {
        flex: 1,
        width: "100%",
        justifyContent: "flex-end",
    },
    inputView: {
        width: "100%",
        justifyContent: "center",
        flexDirection: "row"
    },
    input: {
        width: "95%",
        height: 50,
        borderStyle: "solid",
        borderWidth: 2,
        paddingStart: 10,
        fontSize: 20,
        fontFamily: "fontRegular",
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderColor: "#002B5B",
        color: "#4A5568"
    },
    btn: {
        height: 35,
        backgroundColor: "#002B5B",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginBottom: 20,
    },
    btnText: {
        fontSize: 20,
        fontFamily: "fontMedium",
        color: "white",
    },

});
