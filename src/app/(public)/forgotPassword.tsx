import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthHeader from '@/components/ui/AuthHeader';
import useNetworkCheck from '@/hooks/useNetworkCheck';
import { styles } from '@/styles/public/ForgotPasswordScreen.styles';
import {
  ForgotPasswordFormData,
  schema,
} from '@/validations/public/ForgotPasswordScreen.validation';
import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ForgotPassword = () => {
  const { isLoaded, signIn } = useSignIn();
  const { checkNetwork } = useNetworkCheck();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      if (!isLoaded) return;
      if (!checkNetwork()) return;

      Keyboard.dismiss();

      const { email } = data;
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      router.navigate('/(public)/resetPassword');
    } catch (error: any) {
      console.log('forgot password error', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <AuthHeader
        title="Reset Password"
        description="Enter your email address to reset your password"
      />
      <View style={styles.formContainer}>
        <Input
          label="Email"
          control={control}
          errors={errors.email}
          name={'email'}
          placeholder={'johndoe@gmail.com'}
        />
      </View>
      <View style={styles.height} />
      <Button
        onPress={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        isValid={isValid}
        label={'Reset Password'}
      />
    </KeyboardAwareScrollView>
  );
};

export default ForgotPassword;
