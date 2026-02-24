import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';

interface CustomInputProps extends TextInputProps {
    label?: string;
    error?: string;
    hasLabel?: boolean;
    leftComponent?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    error,
    hasLabel = true,
    leftComponent,
    rightIcon,
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {hasLabel && label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                {leftComponent && <View style={styles.leftIcon}>{leftComponent}</View>}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor="#999"
                    {...props}
                />
                {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 8,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: Colors.white,
        paddingHorizontal: 12,
        minHeight: 55,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: Colors.text,
    },
    inputError: {
        borderColor: Colors.error,
    },
    leftIcon: {
        marginRight: 10,
    },
    rightIcon: {
        marginLeft: 10,
    },
});

export default CustomInput;
