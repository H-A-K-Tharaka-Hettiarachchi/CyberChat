
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from "react";
import CountryPicker from './CountryPicker';
import { router } from 'expo-router';
import CustomAlert from './MyAlert';




export default function SignIn() {


    const [selectedCountry, setSelectedCountry] = useState({});

    const [getMobile, setMobile] = useState(null);
    const [getCountryCode, setCountryCode] = useState(null);



    const handleCountrySelect = (country) => {
        setSelectedCountry(country); // Update the selected country
        setCountryCode(country.code);
    };


    const alertRef = useRef(null);

    const [loaded, error] = useFonts({
        'fontBold': require('../assets/fonts/Rajdhani-Bold.ttf'),
        'fontLight': require('../assets/fonts/Rajdhani-Light.ttf'),
        'fontMedium': require('../assets/fonts/Rajdhani-Medium.ttf'),
        'fontRegular': require('../assets/fonts/Rajdhani-Regular.ttf'),
    });

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
                    <Text style={stylesheet.title}>Enter your phone number</Text>
                </View>
                <Text style={stylesheet.text}>CyberChat will need to verify your phone number. Carrier charges may apply.</Text>

                <View style={stylesheet.bodyMain}>
                    <View style={stylesheet.bodySub1}>

                        <CountryPicker onSelectCountry={handleCountrySelect} />

                        <View style={stylesheet.inputView}>
                            <TextInput style={stylesheet.input1} editable={false} value={selectedCountry.code} onChangeText={(text) => {
                                setCountryCode(text);
                            }} />
                            <TextInput style={stylesheet.input2} inputMode={"tel"} maxLength={9} onChangeText={(text) => {
                                setMobile(text);
                            }} />
                        </View>
                    </View>
                    <View style={stylesheet.bodySub2}>
                        <Pressable style={stylesheet.btn} onPress={
                            async () => {

                                if (getCountryCode == null) {
                                    console.log(getCountryCode)
                                    Alert.alert("Warning", "Please Select Country Code");
                                } else if (getMobile == null) {
                                    Alert.alert("Warning", "Please Enter Mobile Number");
                                } else if (getMobile.length < 9) {
                                    Alert.alert("Warning", "Please Enter Valid Mobile Number");
                                } else {
                                    let response = await fetch("http://192.168.8.187:8080/CyberChat/CheckMobile?cid="
                                        + selectedCountry.id + "&&mobile=" + getMobile);

                                    if (response.ok) {

                                        let userObject = await response.json();

                                        if (userObject.email == null || userObject.email == "") {

                                            const showCustomAlert = () => {
                                                alertRef.current.showAlert(
                                                    'Is this Correct Number ?',
                                                    getCountryCode + " " + getMobile,
                                                    handleEdit,
                                                    handleYes,
                                                );
                                            };

                                            const handleYes = () => {
                                                router.replace("/VerifyNumber?user=" + JSON.stringify(userObject));
                                                // Add additional actions for the Yes button here
                                            };

                                            const handleEdit = () => {
                                                router.replace("/SignIn");// Confirm action
                                                // Add additional actions for the Edit button here
                                            };

                                            showCustomAlert();

                                        } else {
                                            router.replace("/VerifyByEmail?user=" + JSON.stringify(userObject));
                                        }



                                    }
                                }



                            }
                        } >
                            <CustomAlert
                                ref={alertRef}
                                initialTitle="Is this Correct Number ?"
                                initialMessage={getCountryCode + getMobile}
                                ActionLText={"Edit"}
                                ActionRText={"Yes"}
                            />

                            <Text style={stylesheet.btnText}>Next</Text>
                        </Pressable>
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
    selectorView: {
        width: "50%",
        height: 56,
        borderStyle: "solid",
        borderWidth: 2,
        fontSize: 25,
        fontFamily: "fontRegular",
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 2,
        borderColor: "#002B5B",
        color: "#4A5568",
    },
    selector: {
        width: "100%",
        // height: 10,
        borderStyle: "solid",
        borderWidth: 2,
        // paddingStart: 10,
        fontSize: 25,
        fontFamily: "fontRegular",
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 2,
        borderColor: "#002B5B",
        color: "#4A5568",
        // backgroundColor: "red"
    },
    input1: {
        width: "15%",
        height: 50,
        borderStyle: "solid",
        borderWidth: 2,
        paddingStart: 10,
        fontSize: 25,
        fontFamily: "fontRegular",
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        marginRight: 5,
        borderColor: "#002B5B",
        color: "#4A5568"
    },
    input2: {
        width: "35%",
        height: 50,
        borderStyle: "solid",
        borderWidth: 2,
        paddingStart: 10,
        fontSize: 25,
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
