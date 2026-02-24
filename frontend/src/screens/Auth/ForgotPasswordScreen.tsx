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

import { forgotPassword } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';
import CustomInput from '../../components/Common/CustomInput';
import CustomButton from '../../components/Common/CustomButton';
import Colors from '../../constants/Colors';

const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
        .email('Please enter a valid email')
        .required('Email address is required'),
});

const ForgotPasswordScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.auth);

    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(50));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleForgot = async (values: { email: string }) => {
        try {
            await dispatch(forgotPassword(values.email) as any);
            // navigation.navigate('ResetPassword'); // We can navigate if we want them to enter token immediately
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
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons name="arrow-left" size={28} color={Colors.darkGreen} />
                </TouchableOpacity>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View
                            style={[
                                styles.formContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            <View style={styles.headerSection}>
                                <View style={styles.logoCircle}>
                                    <MaterialCommunityIcons name="lock-reset" size={50} color={Colors.primary} />
                                </View>
                                <Text style={styles.title}>Forgot Password?</Text>
                                <Text style={styles.subtitle}>Enter your email address to receive a reset token</Text>
                            </View>

                            <Formik
                                initialValues={{ email: '' }}
                                validationSchema={forgotPasswordSchema}
                                onSubmit={handleForgot}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched
                                }) => (
                                    <View style={styles.card}>
                                        <View style={styles.inputGroup}>
                                            <CustomInput
                                                label="Email Address"
                                                placeholder="Enter your email"
                                                value={values.email}
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                                leftComponent={
                                                    <MaterialCommunityIcons name="email-outline" size={20} color={Colors.mediumGray} />
                                                }
                                            />
                                            <View style={styles.errorContainer}>
                                                {touched.email && errors.email ? (
                                                    <Text style={styles.errorText}>{errors.email}</Text>
                                                ) : (
                                                    <Text style={styles.errorPlaceholder}>.</Text>
                                                )}
                                            </View>
                                        </View>

                                        <CustomButton
                                            title="Send Reset Token"
                                            onPress={handleSubmit as any}
                                            loading={loading}
                                        />

                                        <TouchableOpacity
                                            style={styles.resetNavButton}
                                            onPress={() => navigation.navigate('ResetPassword')}
                                        >
                                            <Text style={styles.resetNavText}>Already have a token?</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Formik>
                        </Animated.View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    backgroundGradient: {
        flex: 1,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
        justifyContent: 'center',
    },
    formContainer: {
        width: '100%',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: Colors.blackShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.darkGreen,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.grey,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 24,
        shadowColor: Colors.blackShadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
    },
    inputGroup: {
        marginBottom: 15,
    },
    errorContainer: {
        minHeight: 20,
        marginTop: 2,
        marginLeft: 4,
    },
    errorText: {
        color: Colors.coral,
        fontSize: 12,
        fontWeight: '500',
    },
    errorPlaceholder: {
        opacity: 0,
        fontSize: 12,
    },
    resetNavButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    resetNavText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
    }
});

export default ForgotPasswordScreen;
