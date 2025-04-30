import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Fonts } from '@/constants/Fonts';

const PrivacyPolicyContent = () => {
  return (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Privacy Policy for Todo Now App</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Todo Now App (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Your privacy
          is important to us. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our mobile application Todo Now App (the
          &quot;App&quot;).
        </Text>
        <Text style={styles.paragraph}>
          Please read this Privacy Policy carefully. If you do not agree with the terms of this
          Privacy Policy, please do not access the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.subSectionTitle}>2.1 Personal Information</Text>
        <Text style={styles.paragraph}>
          When you use our App, we may collect the following personal information:
        </Text>
        <Text style={styles.bulletPoint}>
          • Account Information: When you register for an account, we collect your name, email
          address, and profile picture (if provided through Google sign-in).
        </Text>
        <Text style={styles.bulletPoint}>
          • User Content: Tasks, descriptions, due dates, and priority settings you create within
          the App.
        </Text>
        <Text style={styles.bulletPoint}>
          • Authentication Data: Information required to verify your identity when you sign in,
          including through third-party authentication services like Google.
        </Text>

        <Text style={styles.subSectionTitle}>2.2 Automatically Collected Information</Text>
        <Text style={styles.paragraph}>
          When you use our App, certain information may be collected automatically, including:
        </Text>
        <Text style={styles.bulletPoint}>
          • Device Information: Type of device, operating system, and device identifiers.
        </Text>
        <Text style={styles.bulletPoint}>
          • Log Data: App usage, crash reports, and performance data.
        </Text>
        <Text style={styles.bulletPoint}>
          • Usage Information: How you interact with the App, including features used and actions
          taken.
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect for various purposes, including to:
        </Text>
        <Text style={styles.bulletPoint}>• Create and maintain your account</Text>
        <Text style={styles.bulletPoint}>• Provide, maintain, and improve our App</Text>
        <Text style={styles.bulletPoint}>• Process and complete your tasks and to-do items</Text>
        <Text style={styles.bulletPoint}>• Respond to your comments, questions, and requests</Text>
        <Text style={styles.bulletPoint}>
          • Send you technical notices, updates, security alerts, and support messages
        </Text>
        <Text style={styles.bulletPoint}>
          • Monitor and analyze trends, usage, and activities in connection with our App
        </Text>
        <Text style={styles.bulletPoint}>
          • Detect, investigate, and prevent fraudulent transactions and other illegal activities
        </Text>
        <Text style={styles.bulletPoint}>
          • Protect the rights and property of Todo Now App and others
        </Text>

        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.paragraph}>We may share information as follows:</Text>
        <Text style={styles.bulletPoint}>
          • Service Providers: We may share your information with third-party vendors, service
          providers, contractors, or agents who perform services for us or on our behalf.
        </Text>
        <Text style={styles.bulletPoint}>
          • Business Transfers: If we are involved in a merger, acquisition, or sale of all or a
          portion of our assets, your information may be transferred as part of that transaction.
        </Text>
        <Text style={styles.bulletPoint}>
          • Legal Requirements: We may disclose your information if required to do so by law or in
          response to valid requests by public authorities.
        </Text>

        <Text style={styles.subSectionTitle}>4.1 Third-Party Services</Text>
        <Text style={styles.paragraph}>Our App uses the following third-party services:</Text>
        <Text style={styles.bulletPoint}>
          • Clerk: For user authentication and identity management
        </Text>
        <Text style={styles.bulletPoint}>• Convex: For backend data storage and management</Text>
        <Text style={styles.bulletPoint}>
          • Google Sign-In: For authentication via Google accounts
        </Text>
        <Text style={styles.paragraph}>
          Each of these services collects and processes data according to their own privacy
          policies.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.paragraph}>
          We use appropriate technical and organizational measures designed to protect the
          information that we collect and store about you. However, no security system is
          impenetrable, and we cannot guarantee the security of your information.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Retention</Text>
        <Text style={styles.paragraph}>
          We will retain your personal information only for as long as is necessary for the purposes
          set out in this Privacy Policy. We will retain and use your information to the extent
          necessary to comply with our legal obligations, resolve disputes, and enforce our
          policies.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have certain rights regarding your personal
          information, including:
        </Text>
        <Text style={styles.bulletPoint}>
          • The right to access the personal information we hold about you
        </Text>
        <Text style={styles.bulletPoint}>
          • The right to request correction of your personal information
        </Text>
        <Text style={styles.bulletPoint}>
          • The right to request deletion of your personal information
        </Text>
        <Text style={styles.bulletPoint}>
          • The right to object to processing of your personal information
        </Text>
        <Text style={styles.bulletPoint}>• The right to data portability</Text>
        <Text style={styles.bulletPoint}>• The right to withdraw consent</Text>

        <Text style={styles.sectionTitle}>8. Children&apos;s Privacy</Text>
        <Text style={styles.paragraph}>
          Our App is not intended for children under the age of 13. We do not knowingly collect
          personally identifiable information from children under 13. If you are a parent or
          guardian and you are aware that your child has provided us with personal information,
          please contact us.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by
          posting the new Privacy Policy on this page and updating the &quot;Effective Date&quot; at
          the top of this Privacy Policy.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to
          contact us.
        </Text>

        <Text style={styles.sectionTitle}>11. Consent</Text>
        <Text style={styles.paragraph}>
          By using our App, you consent to our Privacy Policy and agree to its terms and conditions.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PrivacyPolicyContent;

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.Colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.Bold,
    marginBottom: 10,
    color: theme.Colors.typography,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.Bold,
    marginTop: 16,
    marginBottom: 8,
    color: theme.Colors.typography,
  },
  subSectionTitle: {
    fontSize: 14,
    fontFamily: Fonts.Medium,
    marginTop: 12,
    marginBottom: 6,
    color: theme.Colors.typography,
  },
  paragraph: {
    fontSize: 13,
    fontFamily: Fonts.Regular,
    marginBottom: 8,
    lineHeight: 20,
    color: theme.Colors.darkGray[400],
  },
  bulletPoint: {
    fontSize: 13,
    fontFamily: Fonts.Regular,
    marginLeft: 8,
    marginBottom: 4,
    lineHeight: 20,
    color: theme.Colors.darkGray[400],
  },
}));
