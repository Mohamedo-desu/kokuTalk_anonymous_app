import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import AuthHeader from '@/components/ui/AuthHeader';
import { styles } from '@/styles/public/VerificationModal.styles';
import { schema, VerificationFormData } from '@/validations/public/VerificationModal.validation';
import { useSignUp } from '@clerk/clerk-expo';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Keyboard, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const VerificationModal = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: { code: '' },
    shouldFocusError: true,
  });

  const onSubmit = async (data: VerificationFormData) => {
    try {
      const { code } = data;
      if (!isLoaded) return;

      Keyboard.dismiss();

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (error) {
      console.log('Verification error', error);
      Alert.alert('Verification failed', 'Please check your verification code and try again.');
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
      <AuthHeader />
      <View style={styles.formContainer}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Verify Your Email</Text>
          <Input
            label="Code"
            control={control}
            errors={errors.code}
            name={'code'}
            placeholder={'Enter your verification code'}
          />
          <Button
            onPress={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            isValid={isValid}
            label={'Verify'}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default VerificationModal;
