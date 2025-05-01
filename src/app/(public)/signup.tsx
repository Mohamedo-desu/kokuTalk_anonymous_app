import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthHeader from '@/components/ui/AuthHeader';
import PrivacyTerms from '@/components/ui/PrivacyTerms';
import useNetworkCheck from '@/hooks/useNetworkCheck';
import { styles } from '@/styles/public/LoginScreen.styles';
import { schema, SignUpFormData } from '@/validations/public/SignUpScreen.validation';
import { useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const { checkNetwork } = useNetworkCheck();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: { username: '', email: '', password: '' },
    shouldFocusError: true,
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (!isLoaded) return;
      if (!checkNetwork()) return;

      Keyboard.dismiss();

      const { username, email, password } = data;

      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          username,
        },
      });
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      router.push('/(public)/verificationModal');
    } catch (error) {
      console.log('signup error', error);
      Alert.alert('Signup failed', 'Please check your credentials and try again.');
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
      <AuthHeader title="Create your new account" />
      <View style={styles.formContainer}>
        <Input
          label="Username"
          control={control}
          errors={errors.username}
          name={'username'}
          placeholder={'johndoe'}
        />
        <Input
          label="Email"
          control={control}
          errors={errors.email}
          name={'email'}
          placeholder={'johndoe@gmail.com'}
        />
        <Input
          label="Password"
          control={control}
          errors={errors.password}
          name={'password'}
          placeholder={'••••••••••••'}
        />
      </View>
      <View style={styles.socialOptionsContainer}>
        <Button
          onPress={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          label={'Signup'}
        />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Text style={styles.footerText2} onPress={() => router.back()}>
            Login
          </Text>
        </View>
      </View>

      <PrivacyTerms />
    </KeyboardAwareScrollView>
  );
}
