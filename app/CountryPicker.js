import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from 'react-native-vector-icons'; // Make sure to have react-native-vector-icons installed

// Sample list of countries for dropdown
// const data = [
//     { name: 'Java', code: '+94' },
//     { name: 'United States', code: '+1' },
//     { name: 'Canada', code: '+1' },
//     { name: 'India', code: '+91' },
//     { name: 'United Kingdom', code: '+44' },
//     { name: 'Australia', code: '+61' },
//     { name: 'Germany', code: '+49' },
// ];

export default function CountryPicker({ onSelectCountry }) {


    const [selectedCountry, setSelectedCountry] = useState({ name: 'Select Country', code: '0' });
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [countryList, setCountryList] = useState([]); // State to hold countries
    const [loading, setLoading] = useState(true); // State for loading status

    // Fetch countries from the database
    useEffect(() => {
        async function fetchCountries() {


            try {
                let response = await fetch('http://192.168.8.187:8080/CyberChat/LoadCountry'); // Replace with your API URL
                const data = await response.json();
                setCountryList(data); // Set the country list with the fetched data
            } catch (error) {
                console.error('Error fetching countries:', error);
            } finally {
                setLoading(false); // Set loading to false once done
            }
        };

        fetchCountries();
    }, []);

    const filteredCountries = countryList.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        console.log('Selected Country:', country); // Log the selected country
        onSelectCountry(country); // Call the callback function with the selected country
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            {/* Country dropdown */}
            <TouchableOpacity style={styles.dropdown} onPress={() => setModalVisible(true)}>
                <Text style={styles.dropdownText}>{selectedCountry.name}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={20} color="#777" />
            </TouchableOpacity>

            <View style={styles.underline} />

            {/* Modal for Country Picker */}
            <Modal animationType="slide" transparent={true} visible={modalVisible}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a Country</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        {loading ? ( // Show loading indicator while fetching
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <FlatList
                                data={filteredCountries}
                                keyExtractor={(item) => `${item.code}-${item.name}`}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.countryItem} onPress={() => handleCountrySelect(item)}>
                                        <Text style={styles.countryText}>{item.name} ({item.code})</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles to match the design you provided
const styles = StyleSheet.create({

    container: {
        width: "50%",
        height: 50,
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
        alignItems: "center"
    },
    dropdown: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        width: '90%',
    },
    dropdownText: {
        color: '#003764', // Dark blue text color
        fontSize: 25,
        fontFamily: "fontRegular",

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        height: '95%',
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        color: '#003764',
        marginBottom: 16,
        fontFamily: "fontBold",
    },
    searchInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#DDD',
        padding: 8,
        marginBottom: 16,
        borderRadius: 6,
        color: '#333',
        fontFamily: "fontMedium",
        fontSize: 18,
    },
    countryItem: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
        width: '100%',
        alignItems: 'center',
    },
    countryText: {
        fontSize: 20,
        color: '#003764',
        fontFamily: "fontMedium",
    },
    closeButton: {
        marginTop: 16,
        backgroundColor: '#003764',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 18,
        // fontWeight: 'bold',
        fontFamily: "fontBold",
    },
});


