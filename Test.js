import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { View } from "react-native";


export default function Test() {

    useEffect(
        () => {

            async function test() {
             let name =   await AsyncStorage.getItem("name");
             
            }
            test();

        }, []
    );


    return (
        <View>

        </View>
    );

}
