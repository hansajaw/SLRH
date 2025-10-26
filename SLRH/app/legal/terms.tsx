import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../context/ThemeContext";

export default function TermsAndConditions() {
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
        <Text style={[s.title, { color: palette.text }]}>Terms & Conditions</Text>
        <Text style={[s.date, { color: palette.textSecondary }]}>
          Effective Date: January 1, 2025
        </Text>

        <Section
          heading="1. Acceptance of Terms"
          text="By downloading, accessing, or using the Sri Lanka Racing Hub (SLRH) mobile app, you agree to comply with these Terms & Conditions. If you do not agree, please uninstall or discontinue use of the app immediately."
          palette={palette}
        />

        <Section
          heading="2. Eligibility"
          text="You must be at least 13 years old to use SLRH. By using the app, you represent that you meet this minimum age requirement and have the legal capacity to agree to these terms."
          palette={palette}
        />

        <Section
          heading="3. Account Responsibilities"
          text={`You are responsible for maintaining the confidentiality of your account credentials. 
You agree not to share your password or allow others to use your account. 
SLRH is not responsible for losses resulting from unauthorized use of your account.`}
          palette={palette}
        />

        <Section
          heading="4. User Conduct"
          text={`You agree not to:\n
• Use the app for unlawful, fraudulent, or harmful activities.\n
• Upload or distribute offensive, abusive, or illegal content.\n
• Attempt to hack, reverse engineer, or damage SLRH systems.\n
• Impersonate other users, racers, or organizations.`}
          palette={palette}
        />

        <Section
          heading="5. Intellectual Property"
          text="All content, trademarks, logos, and assets within SLRH are the property of their respective owners. You may not reproduce, modify, or redistribute any materials without prior written consent from SLRH."
          palette={palette}
        />

        <Section
          heading="6. In-App Purchases and Transactions"
          text="Any purchases made within the app are final and non-refundable except as required by law. Ensure that your payment information is accurate and that you understand the purchase details before confirming."
          palette={palette}
        />

        <Section
          heading="7. Data Usage and Privacy"
          text="Your personal data is collected and used in accordance with our Privacy Policy. By using SLRH, you consent to such data collection and usage practices as described therein."
          palette={palette}
        />

        <Section
          heading="8. Third-Party Links"
          text="SLRH may contain links to third-party websites or services. We are not responsible for the content, accuracy, or practices of these external platforms. Use them at your own risk."
          palette={palette}
        />

        <Section
          heading="9. Disclaimer of Warranties"
          text="The SLRH app is provided 'as is' and 'as available' without any warranties, express or implied. We do not guarantee uninterrupted access, accuracy of data, or error-free performance."
          palette={palette}
        />

        <Section
          heading="10. Limitation of Liability"
          text="SLRH and its affiliates are not liable for any damages arising from your use of the app, including but not limited to data loss, device damage, or third-party misuse."
          palette={palette}
        />

        <Section
          heading="11. Termination"
          text="We reserve the right to suspend or terminate your access to SLRH at any time if we suspect misuse, violation of terms, or illegal activity."
          palette={palette}
        />

        <Section
          heading="12. Updates to These Terms"
          text="We may modify these Terms & Conditions at any time. Updated versions will be posted in the app or on our website. Your continued use of SLRH constitutes acceptance of the new terms."
          palette={palette}
        />

        <Section
          heading="13. Contact Information"
          text="If you have questions about these Terms & Conditions, please contact us at: support@slracinghub.com"
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
