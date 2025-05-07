import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { router, SplashScreen, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export let loadChatId;

export default function Chat() {

    const logoPath = require('../assets/images/unknownuser.png');

    const item = useLocalSearchParams();

    const [getChatArray, setChatArray] = useState([]);
    const [getChatText, setChatText] = useState("");


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

    const flatListRef = useRef(null);
    const [isListMounted, setIsListMounted] = useState(false); // Track if the list has mounted

    useEffect(() => {
        // Scroll to end only if the list has been mounted and there are items in the array
        if (isListMounted && flatListRef.current && getChatArray.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [isListMounted, getChatArray]); // Effect depends on list mount status and chat array change


    async function fetchChatArray() {

        let userJson = await AsyncStorage.getItem("user");

        let user = JSON.parse(userJson);

        let response = await fetch("http://192.168.8.187:8080/CyberChat/LoadChat?loggedUserMobile=" + user.mobile + "&&otherUserMobile=" + item.otherUserMobile);

        if (response.ok) {
            let chatArray = await response.json();
            // console.log(chatArray);
            setChatArray(chatArray);
        }

    }

    useEffect(
        () => {
            fetchChatArray();
            loadChatId = setInterval(
                () => {
                    fetchChatArray();
                }, 3000
            );
        }, []
    );

    return (
        <SafeAreaView style={stylesheet.container}>
            <View style={stylesheet.body}>

                <View style={stylesheet.chatHeaderView} >

                    <View style={stylesheet.chatHeaderSubView1}>
                        <Pressable style={stylesheet.backBtn} onPress={
                            () => {
                                router.back();
                            }
                        }>
                            <FontAwesome6 name={"arrow-left"} color={"#002B5B"} size={30} />
                        </Pressable>
                        <View style={stylesheet.chatProfilePictureView} >
                            {item.profileImageFound ?
                                <Image source={"http://192.168.8.187:8080/CyberChat/profile-images/profile"
                                    + item.otherUserMobile + "/image" + item.otherUserMobile + ".png"}
                                    style={stylesheet.chatProfilePicture} contentFit="contain" />
                                :
                                <Image source={logoPath} style={stylesheet.chatProfilePicture} contentFit="contain" />
                            }
                        </View>
                    </View>


                    <View style={stylesheet.chatHeaderSubView2} >

                        <View style={stylesheet.chatHeaderTitleView} >

                            <View style={stylesheet.chatHeaderTitleSubView1} >
                                <Text style={stylesheet.chatName}>{item.otherUserName}</Text>
                            </View>
                            <View style={stylesheet.chatHeaderBodySubView1} >
                                <Text style={stylesheet.chatUserStatus}>{item.otherUserStatusId == 1 ? "Online" : "Offline"}</Text>
                            </View>

                        </View>
                        <View style={stylesheet.chatHeaderBodyView} >

                            <View style={stylesheet.headerMenuBtnView}>
                                <Pressable style={stylesheet.headerBtn}>
                                    <FontAwesome6 name={"bars"} color={"#002B5B"} size={25} />
                                </Pressable>
                            </View>

                        </View>

                    </View>

                </View>


                <View style={stylesheet.chatBodyView}>

                    <View style={stylesheet.chatBodyView}>

                        {/* <View style={"right" == "right" ? stylesheet.msgViewTo : stylesheet.msgViewFrom}>
                            <Text style={stylesheet.msgText}>
                                Hey, how's it going? I just wanted to check in and see how everything is going on your end.
                                If you’re free later today, maybe we can have a call to discuss the project details and finalize our next steps.
                                I think we should also talk about the upcoming deadlines and make sure we're on the same page
                            </Text>
                            <View style={stylesheet.msgSubViewTo}>
                                <Text style={stylesheet.text}>10:36 PM</Text>
                                {
                                    "right" == "right" ?
                                        <FontAwesome6 name={"check"} color={1 == 2 ? "#002B5B" : "gray"} size={18} />
                                        : null
                                }
                            </View>
                        </View>

                        <View style={"left" == "right" ? stylesheet.msgViewTo : stylesheet.msgViewFrom}>
                            <Text style={stylesheet.msgText}>
                                Thanks so much for the birthday wishes! 😊 I’m really looking forward to celebrating with friends and family.
                                It means a lot to me that you remembered. Let’s definitely plan that dinner soon;
                                I’d love to catch up and share some stories about what’s been happening in our lives lately."
                            </Text>
                            <View style={stylesheet.msgSubViewTo}>
                                <Text style={stylesheet.text}>10:36 PM</Text>
                                {
                                    "left" == "right" ?
                                        <FontAwesome6 name={"check"} color={1 == 2 ? "#002B5B" : "black"} size={18} />
                                        : null
                                }
                            </View>
                        </View> */}


                        <FlashList
                            ref={flatListRef}
                            data={getChatArray}
                            renderItem={
                                ({ item }) =>
                                    <View style={item.side == "right" ? stylesheet.msgViewTo : stylesheet.msgViewFrom}>
                                        <Text style={stylesheet.msgText}>
                                            {item.message}
                                        </Text>
                                        <View style={stylesheet.msgSubViewTo}>
                                            <Text style={stylesheet.text}>{item.dateTime}</Text>
                                            {
                                                item.side == "right" ?
                                                    <FontAwesome6 name={"check"} color={item.status == 2 ? "#002B5B " : "gray"} size={18} />
                                                    : null
                                            }
                                        </View>
                                    </View>
                            }

                            keyExtractor={(item, index) => index.toString()}
                            estimatedItemSize={200}
                            // Called whenever the content size changes, which means the list has been measured
                            onContentSizeChange={() => {
                                setIsListMounted(true); // List has been rendered and measured
                                if (flatListRef.current && getChatArray.length > 0) {
                                    flatListRef.current.scrollToEnd({ animated: true });
                                }
                            }}
                            // Also set the mount status when the layout is set
                            onLayout={() => {
                                setIsListMounted(true);
                            }}
                        />

                    </View>

                    <View style={stylesheet.chatBodyInputView}>
                        <View style={stylesheet.InputView}>
                            <TextInput style={stylesheet.input} value={getChatText} placeholder={"Type a message ..."} onChangeText={
                                (text) => {
                                    setChatText(text);
                                }
                            } />
                        </View>
                        <View style={stylesheet.sendBtnView}>
                            <Pressable style={stylesheet.sendBtn} onPress={
                                async () => {

                                    if (getChatText.length == 0) {
                                        Alert.alert("Warning", "Please enter your message");
                                    } else {
                                        let userJson = await AsyncStorage.getItem("user");

                                        let user = JSON.parse(userJson);

                                        let response = await fetch("http://192.168.8.187:8080/CyberChat/SendChat?loggedUserMobile=" + user.mobile + "&&otherUserMobile=" + item.otherUserMobile + "&&message=" + getChatText);

                                        if (response.ok) {
                                            let json = await response.json();

                                            if (json.success) {
                                                setChatText("");
                                                fetchChatArray();
                                                console.log("Message sent");

                                            }
                                        }
                                    }

                                }
                            } >
                                <FontAwesome6 name={"circle-arrow-right"} color={"#002B5B"} size={35} />
                            </Pressable>
                        </View>
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
        justifyContent: "center",
        marginTop: "-2.5%"
    },
    chatHeaderView: {
        width: "100%",
        height: 70,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: "row",
        columnGap: 15,
        borderBottomWidth: 3,
        borderBottomColor: "#002B5B",
        // backgroundColor:"#D0D0D0"
    },
    chatHeaderSubView1: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 5,
    },
    backBtn: {
        width: "auto",
        height: "auto",
    },
    chatProfilePictureView: {
        width: 55,
        height: 55,
        borderRadius: 27,
    },
    chatProfilePicture: {
        width: "100%",
        height: 55,
        borderRadius: 27,
        backgroundColor: "#E0E0E0",
        borderWidth: 3,
        borderColor: "#002B5B",
    },
    chatHeaderSubView2: {
        flex: 1,
        height: 55,
        flexDirection: "row",
    },

    chatHeaderTitleView: {
        width: "70%",
        height: 55,
        justifyContent: "center",
    },
    chatHeaderTitleSubView1: {
        flex: 1,
        height: "50%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    chatHeaderBodySubView1: {
        flex: 1,
        height: "50%",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    chatHeaderBodyView: {
        flexDirection: "row",
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    headerMenuBtnView: {
        width: "auto",
        height: "auto",
    },
    headerBtn: {
        width: "auto",
        height: "auto",
    },
    chatName: {
        fontSize: 25,
        fontFamily: "fontBold",
    },
    chatUserStatus: {
        fontSize: 18,
        fontFamily: "fontMedium",
        color: "black"
    },
    chatBodyView: {
        flex: 1,
        backgroundColor: "#EEEEEE",
    },
    chatBodyInputView: {
        height: "auto",
        width: "100%",
        flexDirection: "row",
        marginBottom: 20,
    },
    InputView: {
        width: "85%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: "95%",
        height: 40,
        borderRadius: 20,
        paddingStart: 15,
        fontSize: 18,
        borderWidth: 2,
        borderColor: "#002B5B",
        backgroundColor: "white",
    },
    sendBtnView: {
        width: "15%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    sendBtn: {
        width: "auto",
        height: "auto",
        borderRadius: 30,
        backgroundColor: "white",
    },
    msgViewFrom: {
        backgroundColor: "#B3E5E7",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 10,
        justifyContent: "center",
        alignSelf: "flex-start",
        rowGap: 5,
        width: "auto",
        maxWidth: 300,
    },
    msgViewTo: {
        backgroundColor: "#D0EAF1",
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 10,
        justifyContent: "center",
        alignSelf: "flex-end",
        rowGap: 5,
        width: "auto",
        maxWidth: 300,
    },
    msgSubViewTo: {
        flexDirection: "row",
        columnGap: 10,
        alignSelf: "flex-end"
    },
    msgText: {
        fontSize: 18,
        fontFamily: "fontMedium",
        marginBottom: 10,
        color: "black",
    },
    text: {
        fontSize: 16,
        fontFamily: "fontRegular",
        color: "black",
    },
});