import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthHeader from '@/components/ui/AuthHeader';
import { styles } from '@/styles/public/ResetPasswordScreen.styles';
import { ResetPasswordFormData, schema } from '@/validations/public/ResetPasswordScreen.validation';
import { useSignIn } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ResetPasswordScreen = () => {
  const { isLoaded, signIn, setActive } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      code: '',
    },
    shouldFocusError: true,
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      if (!isLoaded) {
        return null;
      }
      const { newPassword, code } = data;

      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code,
        password: newPassword,
      });

      if (result?.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      } else {
        console.log('Reset password result:', result);
      }
    } catch (error) {
      console.log('Reset password error', error);
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
        title="Create new password"
        description="Create a strong password to secure your account"
      />
      <View style={styles.formContainer}>
        <Input
          label="Code"
          control={control}
          errors={errors.code}
          name={'code'}
          placeholder={'Enter your reset code'}
        />
        <Input
          label="New Password"
          control={control}
          errors={errors.newPassword}
          name={'newPassword'}
          placeholder={'••••••••••••'}
        />
        <Input
          label="Confirm Password"
          control={control}
          errors={errors.confirmPassword}
          name={'confirmPassword'}
          placeholder={'••••••••••••'}
        />
      </View>
      <View style={styles.height} />
      <Button
        onPress={handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
        isValid={isValid}
        label={'Create Password'}
      />
    </KeyboardAwareScrollView>
  );
};

export default ResetPasswordScreen;
