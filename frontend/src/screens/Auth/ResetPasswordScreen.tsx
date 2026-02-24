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

import { resetPassword } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';
import CustomInput from '../../components/Common/CustomInput';
import CustomButton from '../../components/Common/CustomButton';
import Colors from '../../constants/Colors';

const resetPasswordSchema = Yup.object().shape({
    token: Yup.string()
        .required('Reset token is required'),
    password: Yup.string()
        .min(6, ({ min }) => `Password must be at least ${min} characters`)
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Please confirm your new password'),
});

const ResetPasswordScreen = ({ navigation }: any) => {
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

    const handleReset = async (values: any) => {
        try {
            await dispatch(resetPassword(values.token, values.password) as any);
            navigation.navigate('Login');
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
                                    <MaterialCommunityIcons name="key-variant" size={50} color={Colors.primary} />
                                </View>
                                <Text style={styles.title}>Reset Password</Text>
                                <Text style={styles.subtitle}>Enter the token from your email and your new password</Text>
                            </View>

                            <Formik
                                initialValues={{ token: '', password: '', confirmPassword: '', securePassword: true }}
                                validationSchema={resetPasswordSchema}
                                onSubmit={handleReset}
                            >
                                {({
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    values,
                                    errors,
                                    touched,
                                    setFieldValue
                                }) => (
                                    <View style={styles.card}>
                                        <View style={styles.inputGroup}>
                                            <CustomInput
                                                label="Reset Token"
                                                placeholder="Enter token from email"
                                                value={values.token}
                                                onChangeText={handleChange('token')}
                                                onBlur={handleBlur('token')}
                                                autoCapitalize="none"
                                                leftComponent={
                                                    <MaterialCommunityIcons name="ticket-outline" size={20} color={Colors.mediumGray} />
                                                }
                                            />
                                            <View style={styles.errorContainer}>
                                                {touched.token && errors.token ? (
                                                    <Text style={styles.errorText}>{errors.token}</Text>
                                                ) : (
                                                    <Text style={styles.errorPlaceholder}>.</Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <CustomInput
                                                label="New Password"
                                                placeholder="Enter new password"
                                                value={values.password}
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                secureTextEntry={values.securePassword}
                                                leftComponent={
                                                    <MaterialCommunityIcons name="lock-outline" size={20} color={Colors.mediumGray} />
                                                }
                                                rightIcon={
                                                    <TouchableOpacity onPress={() => setFieldValue('securePassword', !values.securePassword)}>
                                                        <MaterialCommunityIcons
                                                            name={values.securePassword ? "eye-outline" : "eye-off-outline"}
                                                            size={20}
                                                            color={Colors.mediumGray}
                                                        />
                                                    </TouchableOpacity>
                                                }
                                            />
                                            <View style={styles.errorContainer}>
                                                {touched.password && errors.password ? (
                                                    <Text style={styles.errorText}>{errors.password}</Text>
                                                ) : (
                                                    <Text style={styles.errorPlaceholder}>.</Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.inputGroup}>
                                            <CustomInput
                                                label="Confirm Password"
                                                placeholder="Confirm new password"
                                                value={values.confirmPassword}
                                                onChangeText={handleChange('confirmPassword')}
                                                onBlur={handleBlur('confirmPassword')}
                                                secureTextEntry={values.securePassword}
                                                leftComponent={
                                                    <MaterialCommunityIcons name="lock-check-outline" size={20} color={Colors.mediumGray} />
                                                }
                                            />
                                            <View style={styles.errorContainer}>
                                                {touched.confirmPassword && errors.confirmPassword ? (
                                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                                ) : (
                                                    <Text style={styles.errorPlaceholder}>.</Text>
                                                )}
                                            </View>
                                        </View>

                                        <CustomButton
                                            title="Reset Password"
                                            onPress={handleSubmit as any}
                                            loading={loading}
                                        />
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
        marginBottom: 10,
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
});

export default ResetPasswordScreen;
