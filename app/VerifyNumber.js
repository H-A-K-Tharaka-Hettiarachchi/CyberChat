
import { registerRootComponent } from 'expo';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams } from 'expo-router';


export default function VerifyNumber() {

    const [otp, setOtp] = useState(['', '', '', '', '', '']); // State to store each OTP digit
    const inputRefs = useRef([]); // References to all input fields

    // Function to handle text change
    const handleChangeText = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Automatically move to the next input if a digit is entered
        if (text && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Function to handle backspace
    const handleBackspace = (text, index) => {
        if (text === '' && index > 0) {
            inputRefs.current[index - 1].focus(); // Move to the previous field on backspace
        }
    };

    // Function to get the final OTP value as a string
    const getOtpValue = () => {
        return otp.join(''); // Joins the array elements into a single string
    };


    const parameters = useLocalSearchParams();

    const userObject = JSON.parse(parameters.user);

    const [getMobile, setMobile] = useState("+" + userObject.countryCode + " " + userObject.mobile);

    const [getMobileOtp, setMobileOtp] = useState("");

    const [status, setStatus] = useState("Ready");

    const [time, setTime] = useState("00:00");



    const [loaded, error] = useFonts({
        'fontBold': require('../assets/fonts/Rajdhani-Bold.ttf'),
        'fontLight': require('../assets/fonts/Rajdhani-Light.ttf'),
        'fontMedium': require('../assets/fonts/Rajdhani-Medium.ttf'),
        'fontRegular': require('../assets/fonts/Rajdhani-Regular.ttf'),
    });


    let countdownTime = 1 * 60; // 3 minutes in seconds
    let countdownInterval;
    let countdownStatus = false; // Initialize status as false

    function startCountdown() {

        setTimeout(() => {

            countdownInterval = setInterval(() => {
                if (countdownTime > 0) {
                    setStatus("Running");
                    countdownTime--;
                    // console.log(formatTime(countdownTime));
                    setTime(formatTime(countdownTime));
                    countdownStatus = false; // Countdown is in progress
                } else {
                    clearInterval(countdownInterval);
                    setStatus("Complete");
                    countdownStatus = true; // Countdown completed
                    console.log("Time's up! Status: " + countdownStatus);
                }
            }, 1000);
        }, 1000); // 1-second delay before starting the countdown
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }


    async function sendOtp() {

        console.log(countdownStatus);

        let response = await fetch(
            "http://192.168.8.187:8080/CyberChat/SendMobileOtp",
            {
                method: "POST",
                body: JSON.stringify(userObject),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.ok) {
            let user = await response.json();
            setMobileOtp(user.mobileOtp);
            console.log(user);
            startCountdown();
        }

    }

    useEffect(
        () => {
            if (status == "Ready") {
                sendOtp();
            }
        }, []
    );


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
                    <Text style={stylesheet.title}>Verifying your number</Text>
                </View>
                <Text style={stylesheet.text}>Waiting to automatically detect an SMS sent to
                    <Text style={stylesheet.textMobile}>{" " + getMobile + " "}
                        <Text style={[stylesheet.text, { color: "blue" }]} onPress={() => {
                            router.replace("/SignIn");
                        }}> Wrong number?</Text>
                    </Text>
                </Text>

                <View style={stylesheet.bodyMain}>
                    <View style={stylesheet.bodySub1}>

                        <View style={stylesheet.otpInputView}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    style={stylesheet.otpInput}
                                    keyboardType="number-pad"
                                    maxLength={1} // Each input only takes one digit
                                    value={digit}
                                    onChangeText={(text) => {
                                        handleChangeText(text, index);
                                    }}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace') {
                                            handleBackspace('', index);
                                        }
                                    }}
                                    ref={(ref) => (inputRefs.current[index] = ref)} // Set input field references

                                />
                            ))}
                        </View>

                        <Text style={[stylesheet.text, { color: status == "Running" ? "gray" : "blue", marginTop: 10 }]} onPress={() => {
                            if (status == "Complete") {
                                sendOtp();
                            }
                        }} disabled={status == "Running" ? true : false} > Didn't receive code? <Text style={stylesheet.text}>{time}</Text> </Text>

                        {/* <Text style={[stylesheet.text, { color: "blue", marginTop: 10 }]} onPress={() => {
                            router.replace("/AddEmail?user=" + JSON.stringify(userObject));
                        }}> Continue Verification with emai?</Text> */}


                    </View>
                    <View style={stylesheet.bodySub2}>
                        <Pressable style={stylesheet.btn} onPress={
                            () => {
                                const finalOtp = getOtpValue();

                                if (finalOtp.length === 6) {

                                    if (finalOtp == getMobileOtp) {

                                        console.log("Match found: " + getMobileOtp + " OK");
                                        userObject.mobileOtp = getMobileOtp;
                                        console.log(userObject);

                                        router.replace("/ProfileInfo?user=" + JSON.stringify(userObject));

                                    } else {
                                        Alert.alert("Error", "Invalid OTP");
                                    }

                                }
                            }
                        }>
                            <Text style={stylesheet.btnText}>Verify</Text>
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
    textMobile: {
        fontSize: 18,
        color: "black",
        fontFamily: "fontBold",
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
    otpInputView: {
        flexDirection: 'row', // Arrange input fields in a row
        justifyContent: 'center',
        alignItems: 'center',
    },
    otpInput: {
        width: 40, // Adjust width of each input field
        height: 50, // Adjust height of each input field
        borderWidth: 1,
        borderColor: '#002B5B', // Change the border color as needed
        margin: 5,
        textAlign: 'center', // Center the text inside input
        fontSize: 25, // Adjust font size
        borderRadius: 5, // Rounded corners for input fields
        backgroundColor: '#f8f8f8', // Background color of each input
        color: "#4A5568",
        fontFamily: "fontRegular",
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
