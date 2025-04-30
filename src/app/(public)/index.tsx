import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthHeader from '@/components/ui/AuthHeader';
import PrivacyTerms from '@/components/ui/PrivacyTerms';
import { styles } from '@/styles/public/LoginScreen.styles';
import { LoginFormData, schema } from '@/validations/public/LoginScreen.validation';
import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Custom link component to wrap the text
const ForgotPasswordLink = () => (
  <Link href={'/(public)/forgotPassword'} style={styles.forgotLabel}>
    <Text>forgot password?</Text>
  </Link>
);

const LoginScreen = () => {
  const { isLoaded, signIn, setActive } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (!isLoaded) return;
      const { email, password } = data;

      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error) {
      console.log('Login error', error);
      Alert.alert('Login failed', 'Please check your credentials and try again.');
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
        showBackButton={false}
        title="Login to your account"
        description="Discover your next shocking confession"
      />
      <View style={styles.formContainer}>
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
        <ForgotPasswordLink />
      </View>
      <View style={styles.socialOptionsContainer}>
        <Button
          onPress={handleSubmit(onSubmit)}
          isSubmitting={isSubmitting}
          isValid={isValid}
          label={'Login'}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>

          <Text style={styles.footerText2} onPress={() => router.navigate('/(public)/signup')}>
            Sign up
          </Text>
        </View>
      </View>
      <PrivacyTerms />
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;
