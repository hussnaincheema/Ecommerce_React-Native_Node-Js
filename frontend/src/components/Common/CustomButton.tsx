import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';

interface CustomButtonProps extends TouchableOpacityProps {
    title: string;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    loading,
    variant = 'primary',
    style,
    disabled,
    ...props
}) => {
    const getButtonStyle = (): ViewStyle => {
        switch (variant) {
            case 'secondary':
                return styles.secondaryButton;
            case 'outline':
                return styles.outlineButton;
            case 'danger':
                return styles.dangerButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextColor = () => {
        if (variant === 'outline') return Colors.primary;
        return Colors.white;
    };

    return (
        <TouchableOpacity
            style={[styles.button, getButtonStyle(), disabled || loading ? styles.disabledButton : null, style]}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.buttonText, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 55,
    },
    primaryButton: {
        backgroundColor: Colors.primary,
    },
    secondaryButton: {
        backgroundColor: Colors.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    dangerButton: {
        backgroundColor: Colors.error,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CustomButton;
