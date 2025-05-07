import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect } from "react";

export default function index() {

    useEffect(
        () => {
            async function checkUser() {
                try {
                    let userJson = await AsyncStorage.getItem("user");
                    if (userJson != null) {
                        router.replace("/Home");
                    } else {
                        router.replace("/Welcome");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            checkUser();
        }, []
    );


}