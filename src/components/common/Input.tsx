import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';
import { withUnistyles } from 'react-native-unistyles';
import { styles } from '@/styles/components/Input.styles';
import { InputProps } from '@/types/Input.types';

const TextInputUnistyles = withUnistyles(TextInput, theme => ({
  placeholderTextColor: theme.Colors.gray[400],
  cursorColor: theme.Colors.secondary,
}));

const Input: FC<InputProps> = ({ control, errors, label, name, placeholder }) => {
  if (!control) {
    throw new Error('Control prop is required for Input component');
  }
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputUnistyles
            style={styles.input}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      {errors && <Text style={styles.errorLabel}>{errors.message}</Text>}
    </View>
  );
};

export default Input;
