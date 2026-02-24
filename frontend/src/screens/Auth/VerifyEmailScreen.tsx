import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity,
    Animated,
    SafeAreaView
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';

import { verifyEmail, resendVerification } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';
import CustomInput from '../../components/Common/CustomInput';
import CustomButton from '../../components/Common/CustomButton';
import Colors from '../../constants/Colors';

const verifySchema = Yup.object().shape({
    token: Yup.string().required('Verification token is required'),
});

const resendSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
});

const VerifyEmailScreen = ({ navigation, route }: any) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.auth);
    const [showResend, setShowResend] = useState(false);

    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1, duration: 800, useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0, duration: 800, useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleVerify = async (values: { token: string }) => {
        try {
            await dispatch(verifyEmail(values.token) as any);
            navigation.navigate('Login');
        } catch (err) {
            // Error handled by action toast
        }
    };

    const handleResend = async (values: { email: string }) => {
        try {
            await dispatch(resendVerification(values.email) as any);
            setShowResend(false);
        } catch (err) {
            // Error handled by action toast
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#f8fffe', '#f0f9ff', '#e6f7ff']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color={Colors.darkGreen} />
                </TouchableOpacity>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboardView}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                            <View style={styles.headerSection}>
                                <View style={styles.logoCircle}>
                                    <MaterialCommunityIcons name="email-check-outline" size={50} color={Colors.primary} />
                                </View>
                                <Text style={styles.title}>{showResend ? 'Resend Verification' : 'Verify Email'}</Text>
                                <Text style={styles.subtitle}>
                                    {showResend
                                        ? 'Enter your email to receive a new verification token'
                                        : 'Enter the verification token sent to your email address'
                                    }
                                </Text>
                            </View>

                            <View style={styles.card}>
                                {!showResend ? (
                                    <Formik
                                        initialValues={{ token: '' }}
                                        validationSchema={verifySchema}
                                        onSubmit={handleVerify}
                                    >
                                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                            <View>
                                                <View style={styles.inputGroup}>
                                                    <CustomInput
                                                        label="Verification Token"
                                                        placeholder="Enter token"
                                                        value={values.token}
                                                        onChangeText={handleChange('token')}
                                                        onBlur={handleBlur('token')}
                                                        autoCapitalize="none"
                                                        leftComponent={<MaterialCommunityIcons name="ticket-outline" size={20} color={Colors.mediumGray} />}
                                                    />
                                                    {touched.token && errors.token && <Text style={styles.errorText}>{errors.token as string}</Text>}
                                                </View>
                                                <CustomButton title="Verify Now" onPress={handleSubmit as any} loading={loading} />
                                                <TouchableOpacity style={styles.toggleButton} onPress={() => setShowResend(true)}>
                                                    <Text style={styles.toggleText}>Didn't receive a token? Resend</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </Formik>
                                ) : (
                                    <Formik
                                        initialValues={{ email: route.params?.email || '' }}
                                        validationSchema={resendSchema}
                                        onSubmit={handleResend}
                                    >
                                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                            <View>
                                                <View style={styles.inputGroup}>
                                                    <CustomInput
                                                        label="Email Address"
                                                        placeholder="Enter your email"
                                                        value={values.email}
                                                        onChangeText={handleChange('email')}
                                                        onBlur={handleBlur('email')}
                                                        autoCapitalize="none"
                                                        keyboardType="email-address"
                                                        leftComponent={<MaterialCommunityIcons name="email-outline" size={20} color={Colors.mediumGray} />}
                                                    />
                                                    {touched.email && errors.email && <Text style={styles.errorText}>{errors.email as string}</Text>}
                                                </View>
                                                <CustomButton title="Send Verification Token" onPress={handleSubmit as any} loading={loading} />
                                                <TouchableOpacity style={styles.toggleButton} onPress={() => setShowResend(false)}>
                                                    <Text style={styles.toggleText}>Back to Verification</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </Formik>
                                )}
                            </View>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.white },
    backgroundGradient: { flex: 1 },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8 },
    keyboardView: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40, justifyContent: 'center' },
    formContainer: { width: '100%' },
    headerSection: { alignItems: 'center', marginBottom: 30 },
    logoCircle: {
        width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.white,
        justifyContent: 'center', alignItems: 'center', elevation: 8,
        shadowColor: Colors.blackShadow, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15, shadowRadius: 12, marginBottom: 15,
    },
    title: { fontSize: 26, fontWeight: 'bold', color: Colors.darkGreen, marginBottom: 5 },
    subtitle: { fontSize: 14, color: Colors.grey, textAlign: 'center', paddingHorizontal: 20 },
    card: {
        backgroundColor: Colors.white, borderRadius: 20, padding: 24, elevation: 8,
        shadowColor: Colors.blackShadow, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1, shadowRadius: 16,
    },
    inputGroup: { marginBottom: 15 },
    errorText: { color: Colors.coral, fontSize: 12, fontWeight: '500', marginTop: 4, marginLeft: 4 },
    toggleButton: { marginTop: 20, alignItems: 'center' },
    toggleText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
});

export default VerifyEmailScreen;
