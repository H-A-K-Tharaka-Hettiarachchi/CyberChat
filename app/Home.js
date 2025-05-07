import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, AppState, Button, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadChatId } from "./Chat";


export default function Home() {


    const logoPath = require('../assets/images/unknownuser.png');

    const [getChatArray, setChatArray] = useState([]);


    const [loaded, error] = useFonts({
        'fontBold': require('../assets/fonts/Rajdhani-Bold.ttf'),
        'fontLight': require('../assets/fonts/Rajdhani-Light.ttf'),
        'fontMedium': require('../assets/fonts/Rajdhani-Medium.ttf'),
        'fontRegular': require('../assets/fonts/Rajdhani-Regular.ttf'),
    });


    const [appState, setAppState] = useState(AppState.currentState); // Get initial state

    useEffect(() => {
        // Define a handler to listen to state changes
        const handleAppStateChange = (nextAppState) => {

            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                updateUserStatus("online");
                loadHome();
                console.log('App has come to the foreground!');

            } else if (nextAppState === 'background') {
                updateUserStatus("offline");
                loadHome();
                console.log('App is in the background or closed!');
            }

            // Update the state with the new value
            setAppState(nextAppState);
        };

        // Subscribe to AppState changes
        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            // Cleanup the listener on component unmount
            subscription.remove();
        };
    }, [appState]);

    async function loadHome() {

        let userJson = await AsyncStorage.getItem("user");

        let user = JSON.parse(userJson);

        let response = await fetch("http://192.168.8.187:8080/CyberChat/LoadHome?mobile=" + user.mobile);
        if (response.ok) {

            let json = await response.json();

            if (json.success) {
                let chatArray = json.chatArray;
                // console.log(chatArray);
                setChatArray(JSON.parse(chatArray));
                await AsyncStorage.setItem("chatArray", JSON.stringify(getChatArray));
            }
        } else {
            let chatArray = await AsyncStorage.getItem("chatArray");
            let chatArrayObject = JSON.parse(chatArray);

            setChatArray(chatArrayObject);
        }

    }
    let loadHomeId;
    useEffect(() => {
        updateUserStatus("online");
        loadHome();
        loadHomeId = setInterval(
            () => {
                loadHome();
            }, 1000
        );
    }, []);


    useEffect(
        () => {
            // updateUserStatus("online");
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


    async function updateUserStatus(status) {

        let userJson = await AsyncStorage.getItem("user");

        let userObject = JSON.parse(userJson);

        let response = await fetch("http://192.168.8.187:8080/CyberChat/UpdateUserStatus?mobile=" + userObject.mobile + "&&status=" + status);

        if (response.ok) {

            let json = await response.json();

            if (json.success) {

                console.log(json.msg);


            }

        }

    }

    return (
        <SafeAreaView style={stylesheet.container}>
            <View style={stylesheet.body}>

                <View style={stylesheet.headerView}>
                    <View style={stylesheet.headerSubView1}>
                        <Text style={stylesheet.titleText}>CyberChat</Text>
                    </View>
                    <View style={stylesheet.headerSubView2}>
                        <Pressable style={stylesheet.headerBtn} onPress={
                            async () => {
                                await AsyncStorage.setItem("user", "");
                                clearInterval(loadHomeId);
                                clearInterval(loadChatId);
                                router.replace("/Welcome");
                            }
                        }>
                            <FontAwesome6 name={"bars"} color={"#002B5B"} size={30} />
                        </Pressable>
                    </View>
                </View>




                <FlashList
                    data={getChatArray}
                    renderItem={
                        ({ item }) =>

                            <Pressable onPress={
                                () => {
                                    router.push(
                                        {
                                            pathname: "/Chat",
                                            params: item,
                                        }
                                    );
                                }
                            }>

                                <View style={stylesheet.chatItemView} >

                                    <View style={stylesheet.chatItemSubView1} >
                                        {item.profileImageFound ?
                                            <Image source={"http://192.168.8.187:8080/CyberChat/profile-images/profile"
                                                + item.otherUserMobile + "/image" + item.otherUserMobile + ".png"}
                                                style={stylesheet.chatItemProfilePicture} contentFit="contain" />
                                            :
                                            <Image source={logoPath} style={stylesheet.chatItemProfilePicture} contentFit="contain" />
                                        }

                                    </View>

                                    <View style={stylesheet.chatItemSubView2} >

                                        <View style={stylesheet.chatItemTitleView} >

                                            <View style={stylesheet.chatItemTitleSubView1} >
                                                <Text style={stylesheet.chatName}>{item.otherUserName}</Text>
                                            </View>

                                            <View style={stylesheet.chatItemTitleSubView2} >
                                                <Text style={stylesheet.chatDate}>{item.dateTime}</Text>
                                            </View>

                                        </View>

                                        <View style={stylesheet.chatItemBodyView} >

                                            <View style={stylesheet.chatItemBodySubView1} >
                                                {item.chatStatusId != 0 ?
                                                    <FontAwesome6 name={"check"} color={item.chatStatusId == 1 ? "gray" : "#002B5B"} size={17} />
                                                    :
                                                    null
                                                }
                                                <Text style={stylesheet.chatMessage} numberOfLines={1} ellipsizeMode="tail">
                                                    {item.message}
                                                </Text>
                                            </View>

                                            <View style={stylesheet.chatItemBodySubView2} >
                                                {item.chatCount != 0 ?
                                                    <View style={stylesheet.chatCountView}>
                                                        <Text style={stylesheet.chatCount}>{item.chatCount}</Text>

                                                    </View>
                                                    :
                                                    null
                                                }
                                            </View>

                                        </View>

                                    </View>

                                </View>
                            </Pressable>



                    }
                    estimatedItemSize={200}
                />

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
        // marginTop: "-2.5%",
        backgroundColor: "#EEEEEE",
    },
    headerView: {
        height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 2,
        paddingBottom: 10,
        borderBottomColor: "#002B5B",
        backgroundColor: "white"
    },
    headerSubView1: {
        height: 40,
        width: "50%",
        alignItems: "flex-start",
        paddingHorizontal: 10,
    },
    headerSubView2: {
        height: 40,
        width: "50%",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    headerBtn: {
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
    },
    titleText: {
        fontSize: 35,
        color: "#002B5B",
        fontFamily: "fontBold",
    },
    text: {
        fontSize: 17,
        color: "black",
        fontFamily: "fontMedium",
        marginBottom: 150,
    },
    chatItemView: {
        width: "100%",
        height: 90,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        columnGap: 15,
        marginVertical: 10,
    },
    chatItemSubView1: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    chatItemProfilePicture: {
        width: "100%",
        height: 80,
        borderRadius: 40,
        backgroundColor: "#E0E0E0",
        borderWidth: 3,
        borderColor: "#002B5B",
    },
    chatItemSubView2: {
        flex: 1,
        height: 80,
    },
    chatItemTitleView: {
        flex: 1,
        height: 40,
        flexDirection: "row",
    },
    chatItemBodyView: {
        flex: 1,
        height: 40,
        flexDirection: "row",
    },
    chatItemTitleSubView1: {
        width: "70%",
        height: "100%",
        justifyContent: "center",
    },
    chatItemTitleSubView2: {
        width: "30%",
        height: "100%",
        justifyContent: "center",
        alignItems: "flex-end",
    },

    chatItemBodySubView1: {
        width: "70%",
        height: "100%",
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center"
    },
    chatItemBodySubView2: {
        width: "30%",
        height: "100%",
        justifyContent: "center",
        alignItems: "flex-end",
    },
    chatCountView: {
        width: "auto",
        height: 25,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        backgroundColor: "#002B5B",
        paddingHorizontal: 5
    },
    chatName: {
        fontSize: 20,
        fontFamily: "fontBold",
    },
    chatDate: {
        fontSize: 17,
        fontFamily: "fontMedium",
    },
    chatMessage: {
        fontSize: 17,
        fontFamily: "fontMedium",
        color: "gray",
        // overflow: "hidden",
    },
    chatCount: {
        fontSize: 16,
        fontFamily: "fontBold",
        color: "white",
    },


});