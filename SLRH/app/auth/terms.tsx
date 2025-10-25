import React from "react";
import { ScrollView, Text, StyleSheet } from "react-native";
import SafeScreen from "../../components/SafeScreen";
import Header from "../../components/Header";

export default function TermsAndConditionsScreen() {
  return (
    <SafeScreen>
      <Header title="Terms & Conditions" />
      <ScrollView contentContainerStyle={s.container}>
        <Text style={s.heading}>1. Acceptance of Terms</Text>
        <Text style={s.paragraph}>
          By accessing and using the SLRH mobile application (&quot;the App&quot;), you agree to be bound by these Terms and Conditions, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this App.
        </Text>

        <Text style={s.heading}>2. Use License</Text>
        <Text style={s.paragraph}>
          Permission is granted to temporarily download one copy of the materials (information or software) on SLRH&apos;s App for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </Text>
        <Text style={s.listItem}>• modify or copy the materials;</Text>
        <Text style={s.listItem}>• use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</Text>
        <Text style={s.listItem}>• attempt to decompile or reverse engineer any software contained on SLRH&apos;s App;</Text>
        <Text style={s.listItem}>• remove any copyright or other proprietary notations from the materials; or</Text>
        <Text style={s.listItem}>• transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</Text>
        <Text style={s.paragraph}>
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by SLRH at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
        </Text>

        <Text style={s.heading}>3. Disclaimer</Text>
        <Text style={s.paragraph}>
          The materials on SLRH&apos;s App are provided on an &apos;as is&apos; basis. SLRH makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Text>
        <Text style={s.paragraph}>
          Further, SLRH does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its App or otherwise relating to such materials or on any sites linked to this App.
        </Text>

        <Text style={s.heading}>4. Limitations</Text>
        <Text style={s.paragraph}>
          In no event shall SLRH or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SLRH&apos;s App, even if SLRH or a SLRH authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
        </Text>

        <Text style={s.heading}>5. Accuracy of Materials</Text>
        <Text style={s.paragraph}>
          The materials appearing on SLRH&apos;s App could include technical, typographical, or photographic errors. SLRH does not warrant that any of the materials on its App are accurate, complete or current. SLRH may make changes to the materials contained on its App at any time without notice. However SLRH does not make any commitment to update the materials.
        </Text>

        <Text style={s.heading}>6. Links</Text>
        <Text style={s.paragraph}>
          SLRH has not reviewed all of the sites linked to its App and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by SLRH of the site. Use of any such linked website is at the user&apos;s own risk.
        </Text>

        <Text style={s.heading}>7. Modifications</Text>
        <Text style={s.paragraph}>
          SLRH may revise these Terms and Conditions for its App at any time without notice. By using this App you are agreeing to be bound by the then current version of these Terms and Conditions.
        </Text>

        <Text style={s.heading}>8. Governing Law</Text>
        <Text style={s.paragraph}>
          These terms and conditions are governed by and construed in accordance with the laws of Sri Lanka and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </Text>
      </ScrollView>
    </SafeScreen>
  );
}

const s = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 10,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: "#ccc",
    marginLeft: 15,
    marginBottom: 5,
    lineHeight: 20,
  },
});
