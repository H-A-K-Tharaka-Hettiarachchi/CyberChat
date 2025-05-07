
import { registerRootComponent } from 'expo';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { router } from 'expo-router';

export default function Welcome() {

    const logoPath = require('../assets/blueIcon.png');

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
                <View style={stylesheet.logoView}>
                    <Image source={logoPath} style={stylesheet.logo} contentFit="contain" />
                </View>
                <Text style={stylesheet.welcomeText}>Welcome to CyberChat</Text>
                <Text style={stylesheet.text}>Read our <Text style={{ color: "blue" }}>Privacy Policy</Text>.
                 Tap "Agree and continue" to accept the <Text style={{ color: "blue" }}>Terms of Service</Text> .</Text>

                <Pressable style={stylesheet.btn}  onPress={
                    ()=>{
                        router.replace("/SignIn");
                    }
                } >
                    <Text style={stylesheet.btnText}>Agree and continue</Text>
                </Pressable>

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
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems:"center",
    },
    logoView: {
        width: 300,
        height: 300,
        borderRadius: 50,
        // backgroundColor: "white",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 75,
        marginTop: 25,
    },
    logo: {
        width: "100%",
        height: "100%",
        borderRadius: 50,
        justifyContent: "center",
        alignSelf: "center"
    },
    welcomeText: {
        fontSize: 30,
        color: "black",
        alignSelf: "center",
        fontFamily: "fontBold",
    }, text: {
        fontSize: 17,
        color: "black",
        fontFamily: "fontMedium",
        marginBottom: 150,
    },
    btn: {
        height: 35,
        backgroundColor: "#002B5B",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        width:"90%"

    },
    btnText: {
        fontSize: 20,
        fontFamily: "fontMedium",
        color: "white",
    },

});
