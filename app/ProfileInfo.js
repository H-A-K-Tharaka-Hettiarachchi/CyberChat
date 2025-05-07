
import { registerRootComponent } from 'expo';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import CustomAlert from './MyAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileInfo() {


    const parameters = useLocalSearchParams();

    const userObject = JSON.parse(parameters.user);

    const logoPath = require('../assets/images/cameraIcon.png');

    const [getName, setName] = useState("");
    const [getImage, setImage] = useState(null);
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
                    <Text style={stylesheet.title}>Profile Info</Text>
                </View>
                <Text style={stylesheet.text}>Please provide your name and optional profile photo.</Text>
                <Pressable style={stylesheet.imagePicker} onPress={async () => {
                    let result = await ImagePicker.launchImageLibraryAsync({
                        allowsEditing: true,
                        quality: 1,
                    });


                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                    } 
                    // else {
                    //     setImage(logoPath);
                    // }

                }}>
                    <Image source={getImage == null ? logoPath : getImage} style={stylesheet.imagePickerImage} contentFit="contain" />
                </Pressable>
                <View style={stylesheet.bodyMain}>
                    <View style={stylesheet.bodySub1}>
                        <TextInput style={stylesheet.input} placeholder={"Type your name here"} onChangeText={(text) => {
                            setName(text);
                        }} />
                    </View>
                    <View style={stylesheet.bodySub2}>
                        <Pressable style={stylesheet.btn} onPress={
                            async () => {

                                if (getName == "" || getName.trim().length === 0) {
                                    Alert.alert("Info", "Please Enter Name");
                                } else {
                                    userObject.name = getName;

                                    const showCustomAlert = () => {
                                        alertRef.current.showAlert(
                                            'Add Email to Protect Your Account',
                                            "Verify Your Account, even without SMS",
                                            handleYes,
                                            handleSkip,
                                        );
                                    };

                                    const handleSkip = async () => {
                                        // router.replace("/Home?user=" + JSON.stringify(userObject));
                                        async function SignUp() {

                                            try {
                                                let formData = new FormData();

                                                formData.append("mobile", userObject.mobile);
                                                formData.append("name", getName);
                                                formData.append("country", userObject.country);
                                                formData.append("mobileOtp", userObject.mobileOtp);

                                                if (userObject.email != null || userObject.email != "") {
                                                    formData.append("email", userObject.email);
                                                    formData.append("emailOtp", userObject.emailOtp);
                                                }

                                                // formData.append("user", userObject);

                                                if (getImage != null) {
                                                    formData.append("profileImage",
                                                        {
                                                            name: "profileImage.png",
                                                            type: "image/png",
                                                            uri: getImage,
                                                        }
                                                    );
                                                }

                                                let response = await fetch(
                                                    "http://192.168.8.187:8080/CyberChat/SignUp",
                                                    {
                                                        method: "POST",
                                                        body: formData,
                                                        headers: {
                                                            'Content-Type': 'multipart/form-data'
                                                        }
                                                    }

                                                );

                                                if (response.ok) {

                                                    // let json = await response.json();

                                                    // if (json.success) {
                                                        await AsyncStorage.setItem("user", JSON.stringify(userObject));
                                                        router.replace("/Home");
                                                    // }

                                                }
                                            } catch (error) {
                                                console.log(error);
                                            }

                                        }
                                        SignUp();
                                        console.log("Skip")
                                    };

                                    const handleYes = () => {
                                        async function SignUp() {

                                            try {
                                                let formData = new FormData();

                                                formData.append("mobile", userObject.mobile);
                                                formData.append("name", getName);
                                                formData.append("country", userObject.country);
                                                formData.append("mobileOtp", userObject.mobileOtp);
                                                // formData.append("user", userObject);

                                              
                                                
                                                if (getImage != null) {
                                                    formData.append("profileImage",
                                                        {
                                                            name: "profileImage.png",
                                                            type: "image/png",
                                                            uri: getImage,
                                                        }
                                                    );
                                                }

                                                let response = await fetch(
                                                    "http://192.168.8.187:8080/CyberChat/SignUp",
                                                    {
                                                        method: "POST",
                                                        body: formData,
                                                        headers: {
                                                            'Content-Type': 'multipart/form-data'
                                                        }
                                                    }

                                                );

                                                if (response.ok) {

                                                    // console.log("OK");
                                                    // let json = await response.json();
                                                    // console.log("OK");
                                                    // console.log(json);

                                                    // if (json.success) {
                                                    //     console.log("OK");

                                                    // router.replace("/AddEmail?user=" + JSON.stringify(userObject));
                                                    // }
                                                    console.log("OK");
                                                    router.replace("/AddEmail?user=" + JSON.stringify(userObject));
                                                    console.log("OK");
                                                }
                                            } catch (error) {
                                                console.log(error);
                                            }

                                        }
                                        SignUp();

                                        console.log("Yes")
                                    };

                                    if (userObject.email == null || userObject.email == "") {
                                        showCustomAlert();
                                    } else {
                                        handleSkip();
                                    }


                                }

                            }
                        } >
                            <Text style={stylesheet.btnText}>Next</Text>
                        </Pressable>

                        <CustomAlert
                            ref={alertRef}
                            initialTitle='Add Email to Protect Your Account'
                            initialMessage={"Verify Your Account,even withot SMS"}
                            ActionLText={"Yes"}
                            ActionRText={"Skip"}
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
        paddingVertical: 0,
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
    imagePicker: {
        width: 125,
        height: 125,
        borderRadius: 75,
        backgroundColor: "#E0E0E0",
        justifyContent: "center",
        alignSelf: "center",
    },
    imagePickerImage: {
        width: "100%",
        height: "100%",
        borderRadius: 75,
        justifyContent: "center",
        alignSelf: "center",

    },
});
