import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/actions/authActions';
import { RootState } from '../redux/reducers';
import Colors from '../constants/Colors';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome, {user?.name}!</Text>
                <Text style={styles.subtitle}>This is your home screen.</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => dispatch(logout() as any)}
                >
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.black,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.grey,
        marginBottom: 20,
    },
    button: {
        backgroundColor: Colors.error,
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
