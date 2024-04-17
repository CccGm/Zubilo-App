import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.content}>
        These terms and conditions Terms are an agreement between Zubilo App our
        and you User. This Agreement sets forth the general terms and conditions
        of your use of the Zubilo mobile application and any of its products or
        services collectively.
      </Text>
      <Text style={styles.content}>
        If you create an account in the App, you are responsible for maintaining
        the security of your account and you are fully responsible for all
        activities that occur under the account and any other actions taken in
        connection with it. We may, but have no obligation to, monitor and
        review new accounts before you may sign in and use our Services.
      </Text>
      <Text style={styles.content}>
        Providing false contact information of any kind may result in the
        termination of your account. You must immediately notify us of any
        unauthorized uses of your account or any other breaches of security. We
        will not be liable for any acts or omissions by you, including any
        damages of any kind incurred as a result of such acts or omissions.
      </Text>
      <Text style={styles.content}>
        By using the App, you consent to the collection and use of certain
        information about you and your use of the App, including but not limited
        to your device identifier, usage statistics, and personal information.
        For more information regarding the collection and use of your
        information, please refer to our Privacy Policy.
      </Text>
      <Text style={styles.content}>
        Zubilo may offer features allowing users to earn coins through various
        activities within the App. These coins may be exchanged for rewards or
        withdrawn as money, subject to the terms and conditions outlined in the
        App. Zubilo reserves the right to modify or discontinue any earning,
        exchanging, or withdrawal features at any time without prior notice.
      </Text>
      <Text style={styles.content}>
        The App and its original content (excluding content provided by users),
        features, and functionality are and will remain the exclusive property
        of Zubilo and its licensors. The App is protected by copyright,
        trademark, and other laws of both the United States and foreign
        countries. Our trademarks and trade dress may not be used in connection
        with any product or service without the prior written consent of Zubilo.
      </Text>
      <Text style={styles.content}>
        Zubilo reserves the right to modify these Terms and Conditions at any
        time. We do so by posting and drawing attention to the updated terms on
        the App. Your decision to continue to visit and make use of the App
        after such changes have been made constitutes your formal acceptance of
        the new Terms and Conditions.
      </Text>
      <Text style={styles.contact}>
        If you have any questions about these Terms and Conditions, you can
        contact us at [contact email].
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  contact: {
    marginTop: 30,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
});

export default TermsAndConditions;
