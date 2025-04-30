import * as Application from 'expo-application';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Fonts } from '@/constants/Fonts';

const PrivacyTerms = () => {
  const openPrivacyPolicy = () => {
    router.push('/(public)/privacy-policy');
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.versionCodeText}>{Application.nativeApplicationVersion}</Text>

      <Text style={styles.versionCodeText}>By using, you agree to our</Text>
      <TouchableOpacity
        hitSlop={10}
        activeOpacity={0.8}
        style={styles.footerTextContainer}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.footerText}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrivacyTerms;

const styles = StyleSheet.create(theme => ({
  footer: {
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 20,
  },
  footerTextContainer: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  footerText: {
    textDecorationLine: 'underline',
    fontSize: 10,
    color: theme.Colors.primary,
    fontFamily: Fonts.Regular,
  },
  versionCodeText: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.Colors.gray[500],
  },
}));
