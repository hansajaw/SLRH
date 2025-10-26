import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../context/ThemeContext";

export default function PrivacyPolicy() {
  const { palette } = useTheme();

  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: palette.background }]}
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={[s.container, { paddingBottom: 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[s.title, { color: palette.text }]}>Privacy Policy</Text>
        <Text style={[s.date, { color: palette.textSecondary }]}>
          Effective Date: January 1, 2025
        </Text>

        {/* 1. Overview */}
        <Section
          heading="1. Introduction"
          text="At Sri Lanka Racing Hub (SLRH), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our mobile application and related services."
          palette={palette}
        />

        {/* 2. Data Collected */}
        <Section
          heading="2. Information We Collect"
          text={`We may collect the following types of data:\n
• Personal Details – such as your name, email address, phone number, and profile photo.\n
• Account Data – such as login credentials and preferences.\n
• Usage Data – including your app interactions, viewed content, and device information.\n
• Location Data – if you choose to share your location for event participation or community features.\n
• Media Uploads – such as profile avatars or photos you voluntarily provide.`}
          palette={palette}
        />

        {/* 3. How We Use Data */}
        <Section
          heading="3. How We Use Your Information"
          text={`We use collected information to:\n
• Provide and personalize your app experience.\n
• Manage your user account and community interactions.\n
• Send updates, notifications, and relevant racing news.\n
• Improve app performance and security.\n
• Comply with legal obligations and prevent misuse.`}
          palette={palette}
        />

        {/* 4. Data Sharing */}
        <Section
          heading="4. Data Sharing and Disclosure"
          text={`We do not sell or rent your personal information. However, we may share limited data with:\n
• Service Providers – trusted partners who assist in hosting, analytics, or communication.\n
• Legal Authorities – when required by law or to protect our users.\n
• Third-Party APIs – such as Google or Facebook (if used for authentication or analytics).`}
          palette={palette}
        />

        {/* 5. Cookies */}
        <Section
          heading="5. Cookies and Tracking"
          text="SLRH may use cookies or similar tracking technologies to remember user preferences, improve usability, and analyze engagement. You can control or disable cookies via your device settings."
          palette={palette}
        />

        {/* 6. Data Retention */}
        <Section
          heading="6. Data Retention"
          text="We retain your data only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. You may request deletion of your data at any time through the app’s support section."
          palette={palette}
        />

        {/* 7. Security */}
        <Section
          heading="7. Security"
          text="We implement technical and organizational measures such as encryption, secure storage, and limited access to protect your data. However, no system is 100% secure, and we cannot guarantee absolute protection."
          palette={palette}
        />

        {/* 8. Your Rights */}
        <Section
          heading="8. Your Rights and Choices"
          text={`As a user, you have the right to:\n
• Access or correct your personal data.\n
• Request deletion of your account and stored information.\n
• Withdraw consent for optional data processing.\n
• Contact us regarding privacy-related concerns.`}
          palette={palette}
        />

        {/* 9. Children's Privacy */}
        <Section
          heading="9. Children's Privacy"
          text="SLRH does not knowingly collect data from children under 13. If you believe a child has provided us with personal data, please contact us for immediate removal."
          palette={palette}
        />

        {/* 10. Updates */}
        <Section
          heading="10. Policy Updates"
          text="We may update this Privacy Policy periodically. Any changes will be communicated via in-app notifications or updates to this page. Continued use of the app indicates acceptance of the revised policy."
          palette={palette}
        />

        {/* 11. Contact */}
        <Section
          heading="11. Contact Us"
          text="If you have questions or concerns about this Privacy Policy, please contact us at: support@slracinghub.com"
          palette={palette}
        />

        <View style={{ marginTop: 30 }}>
          <Text style={[s.footer, { color: palette.textSecondary }]}>
            © 2025 Sri Lanka Racing Hub. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({
  heading,
  text,
  palette,
}: {
  heading: string;
  text: string;
  palette: any;
}) {
  return (
    <View style={s.section}>
      <Text style={[s.heading, { color: palette.accent }]}>{heading}</Text>
      <Text style={[s.text, { color: palette.textSecondary }]}>{text}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  safe: { paddingTop:-50 },
  container: { paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 26, fontWeight: "900", marginBottom: 4 },
  date: { fontSize: 14, marginBottom: 16 },
  section: { marginBottom: 18 },
  heading: { fontSize: 17, fontWeight: "800", marginBottom: 6 },
  text: { fontSize: 15, lineHeight: 22 },
  footer: { fontSize: 13, textAlign: "center", marginTop: 12 },
});
