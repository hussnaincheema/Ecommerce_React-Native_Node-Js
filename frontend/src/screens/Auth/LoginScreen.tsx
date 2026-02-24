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
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import { login } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';
import CustomInput from '../../components/Common/CustomInput';
import CustomButton from '../../components/Common/CustomButton';
import Colors from '../../constants/Colors';
import { loginValidationSchema } from '../../utils/Validations';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state: RootState) => state.auth);

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

    const handleLogin = async (values: any) => {
        try {
            await (dispatch(login(values) as any));
            // Success is handled by state change and navigation
            // Note: In authActions, we should probably throw an error if login fails
            // to let the catch block here show the toast, OR check state after dispatch
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: err.message || 'Incorrect email or password',
            });
        }
    };

    // Showing error from Redux state using Toast
    useEffect(() => {
        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
            });
        }
    }, [error]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#f8fffe', '#f0f9ff', '#e6f7ff']}
                style={styles.backgroundGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
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
                                    <MaterialCommunityIcons name="shopping" size={50} color={Colors.primary} />
                                </View>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>Professional shopping made simple</Text>
                            </View>

                            <Formik
                                initialValues={{ email: '', password: '', securePassword: true }}
                                validationSchema={loginValidationSchema}
                                onSubmit={handleLogin}
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
                                        <Text style={styles.cardTitle}>Sign In</Text>
                                        <Text style={styles.cardSubtitle}>Enter your credentials to access your account</Text>

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

                                        <View style={styles.inputGroup}>
                                            <CustomInput
                                                label="Password"
                                                placeholder="Enter your password"
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

                                        <TouchableOpacity style={styles.forgotPassword}>
                                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                                        </TouchableOpacity>

                                        <CustomButton
                                            title="Sign In"
                                            onPress={handleSubmit as any}
                                            loading={loading}
                                        />
                                    </View>
                                )}
                            </Formik>

                            <View style={styles.footer}>
                                <View style={styles.dividerContainer}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>or</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <View style={styles.signUpContainer}>
                                    <Text style={styles.footerText}>Don't have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                        <Text style={styles.linkText}>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
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
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    formContainer: {
        flex: 1,
    },
    headerSection: {
        alignItems: 'center',
        marginTop: 40,
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
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.darkGreen,
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 13,
        color: Colors.grey,
        textAlign: 'center',
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 5,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotPasswordText: {
        color: Colors.darkGreen,
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        marginTop: 30,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.lightGray,
    },
    dividerText: {
        fontSize: 14,
        color: Colors.mediumGray,
        marginHorizontal: 16,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    footerText: {
        color: Colors.grey,
        fontSize: 15,
    },
    linkText: {
        color: Colors.darkGreen,
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
