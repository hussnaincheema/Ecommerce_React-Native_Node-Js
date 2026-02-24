import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

import { register } from '../../redux/actions/authActions';
import { RootState } from '../../redux/reducers';
import CustomInput from '../../components/Common/CustomInput';
import CustomButton from '../../components/Common/CustomButton';
import Colors from '../../constants/Colors';
import { signupValidationSchema } from '../../utils/Validations';

const SignupScreen = ({ navigation }: any) => {
    const [avatar, setAvatar] = useState<string | null>(null);
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

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSignup = async (values: any) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('email', values.email);
        formData.append('password', values.password);

        if (avatar) {
            const filename = avatar.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('avatar', {
                uri: Platform.OS === 'ios' ? avatar.replace('file://', '') : avatar,
                name: filename,
                type,
            } as any);
        }

        try {
            await (dispatch(register(formData) as any));
            navigation.navigate('VerifyEmail', { email: values.email });
        } catch (err: any) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: err.message || 'Check your details and try again',
            });
        }
    };

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
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Sign up to get started</Text>
                            </View>

                            <Formik
                                initialValues={{ name: '', email: '', password: '', securePassword: true }}
                                validationSchema={signupValidationSchema}
                                onSubmit={handleSignup}
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
                                        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                                            {avatar ? (
                                                <Image source={{ uri: avatar }} style={styles.avatar} />
                                            ) : (
                                                <View style={styles.avatarPlaceholder}>
                                                    <MaterialCommunityIcons name="camera-plus-outline" size={30} color={Colors.grey} />
                                                    <Text style={styles.avatarText}>Add Photo</Text>
                                                </View>
                                            )}
                                        </TouchableOpacity>

                                        <View style={styles.inputGroup}>
                                            <CustomInput
                                                label="Full Name"
                                                placeholder="Enter your full name"
                                                value={values.name}
                                                onChangeText={handleChange('name')}
                                                onBlur={handleBlur('name')}
                                                leftComponent={
                                                    <MaterialCommunityIcons name="account-outline" size={20} color={Colors.mediumGray} />
                                                }
                                            />
                                            <View style={styles.errorContainer}>
                                                {touched.name && errors.name ? (
                                                    <Text style={styles.errorText}>{errors.name}</Text>
                                                ) : (
                                                    <Text style={styles.errorPlaceholder}>.</Text>
                                                )}
                                            </View>
                                        </View>

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
                                                placeholder="Create a password"
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

                                        <CustomButton
                                            title="Sign Up"
                                            onPress={handleSubmit as any}
                                            loading={loading}
                                            style={{ marginTop: 10 }}
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
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.linkText}>Login</Text>
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
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.lightGrey,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
    },
    avatarText: {
        fontSize: 12,
        color: Colors.grey,
        marginTop: 5,
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

export default SignupScreen;
