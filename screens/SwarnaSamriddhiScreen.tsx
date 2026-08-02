import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Linking, Dimensions, Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: W } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const GOLD_DIM    = 'rgba(201,168,76,0.25)';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const GREEN       = '#16a34a';

const UPI_ID      = 'shekharraja@upi';
const WHATSAPP_NO = '918377911745';
const PHONE_NO    = '+918377911745';

const EMI_OPTIONS = [2000, 3000, 5000, 7000, 10000, 15000, 20000];

function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

function Calculator() {
  const [monthly, setMonthly] = useState(5000);
  const customerTotal = monthly * 10;
  const srjBonus      = monthly * 2;
  const grandTotal    = customerTotal + srjBonus;

  return (
    <View style={styles.calcCard}>
      <Text style={styles.calcTitle}>💡 अपना लाभ जानें</Text>
      <Text style={styles.calcSub}>मासिक किस्त चुनें</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {EMI_OPTIONS.map(amt => (
            <TouchableOpacity
              key={amt}
              style={[styles.emiChip, monthly === amt && styles.emiChipActive]}
              onPress={() => setMonthly(amt)}
            >
              <Text style={[styles.emiChipTxt, monthly === amt && styles.emiChipTxtActive]}>
                ₹{amt.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={styles.calcRow}>
        <View style={styles.calcItem}>
          <Text style={styles.calcLabel}>आपकी 10 किस्तें</Text>
          <Text style={styles.calcValue}>₹{customerTotal.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.calcPlus}>
          <Text style={{ color: GOLD, fontSize: 22, fontWeight: '900' }}>+</Text>
        </View>
        <View style={styles.calcItem}>
          <Text style={styles.calcLabel}>हमारी 2 किस्तें (FREE)</Text>
          <Text style={[styles.calcValue, { color: GREEN }]}>₹{srjBonus.toLocaleString('en-IN')}</Text>
        </View>
      </View>
      <View style={styles.calcTotal}>
        <Text style={styles.calcTotalLabel}>कुल आभूषण मूल्य</Text>
        <Text style={styles.calcTotalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
      </View>
    </View>
  );
}

function PaymentModal({ visible, onClose, monthly }: {
  visible: boolean; onClose: () => void; monthly: number;
}) {
  const [step, setStep]     = useState<'amount' | 'upi' | 'screenshot'>('amount');
  const [custAmt, setCustAmt] = useState(String(monthly));
  const [name, setName]     = useState('');

  const openUPI = () => {
    const amt    = parseInt(custAmt) || monthly;
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Shekhar%20Raja%20Jewellers&am=${amt}&cu=INR&tn=Swarna%20Samriddhi%20Yojana%20EMI`;
    Linking.openURL(upiUrl).catch(() => {
      Alert.alert('UPI App नहीं मिला', 'कृपया PhonePe, Google Pay या Paytm से भुगतान करें।\nUPI ID: ' + UPI_ID);
    });
    setStep('screenshot');
  };

  const shareScreenshot = () => {
    const msg =
      `नमस्ते Shekhar Raja Jewellers 🙏\n\n` +
      `मैं *स्वर्ण समृद्धि योजना* में शामिल होना चाहता/चाहती हूँ।\n\n` +
      `👤 नाम: ${name || '(कृपया भरें)'}\n` +
      `💰 मासिक किस्त: ₹${custAmt}\n\n` +
      `मैंने भुगतान का स्क्रीनशॉट संलग्न कर रहा/रही हूँ।\n` +
      `कृपया मेरी योजना सक्रिय करें। धन्यवाद!`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`).catch(() =>
      Alert.alert('WhatsApp', PHONE_NO)
    );
    onClose();
    setStep('amount');
  };

  const reset = () => { setStep('amount'); onClose(); };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={reset}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          {step === 'amount' && (
            <>
              <Text style={styles.modalTitle}>किस्त भुगतान</Text>
              <Text style={styles.modalSub}>स्वर्ण समृद्धि योजना</Text>
              <View style={styles.goldTopBar} />
              <View style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>आपका नाम</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="person-outline" size={16} color={TEXT_LIGHT} />
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="पूरा नाम दर्ज करें"
                    placeholderTextColor={TEXT_LIGHT}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>किस्त राशि (₹)</Text>
                <View style={styles.fieldRow}>
                  <Text style={styles.rupee}>₹</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="जैसे 5000"
                    placeholderTextColor={TEXT_LIGHT}
                    keyboardType="numeric"
                    value={custAmt}
                    onChangeText={setCustAmt}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.payBtn} onPress={() => setStep('upi')}>
                <Ionicons name="card-outline" size={20} color="#fff" />
                <Text style={styles.payBtnTxt}>UPI से भुगतान करें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={reset}>
                <Text style={styles.cancelLinkTxt}>रद्द करें</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'upi' && (
            <>
              <Text style={styles.modalTitle}>UPI भुगतान</Text>
              <Text style={styles.modalSub}>नीचे UPI ऐप से ₹{custAmt} भेजें</Text>
              <View style={styles.goldTopBar} />
              <View style={styles.upiBox}>
                <Ionicons name="qr-code-outline" size={48} color={GOLD} />
                <Text style={styles.upiIdLabel}>UPI ID</Text>
                <Text style={styles.upiId}>{UPI_ID}</Text>
                <Text style={styles.upiNote}>PhonePe · GPay · Paytm · BHIM</Text>
              </View>
              <View style={styles.upiApps}>
                {[
                  { name: 'PhonePe', icon: 'phone-portrait-outline' },
                  { name: 'GPay',    icon: 'logo-google'            },
                  { name: 'Paytm',   icon: 'wallet-outline'         },
                ].map(app => (
                  <TouchableOpacity key={app.name} style={styles.upiAppBtn} onPress={openUPI}>
                    <Ionicons name={app.icon as any} size={22} color={PURPLE_MID} />
                    <Text style={styles.upiAppName}>{app.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.payBtn} onPress={openUPI}>
                <Ionicons name="open-outline" size={20} color="#fff" />
                <Text style={styles.payBtnTxt}>UPI ऐप खोलें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={() => setStep('amount')}>
                <Text style={styles.cancelLinkTxt}>← वापस जाएं</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'screenshot' && (
            <>
              <Text style={styles.modalTitle}>भुगतान हो गया? 🎉</Text>
              <Text style={styles.modalSub}>स्क्रीनशॉट WhatsApp पर भेजें</Text>
              <View style={styles.goldTopBar} />
              <View style={styles.screenshotBox}>
                <Ionicons name="checkmark-circle" size={52} color={GREEN} />
                <Text style={styles.screenshotText}>
                  भुगतान का स्क्रीनशॉट हमें{'\n'}WhatsApp पर भेजें।{'\n'}
                  हम आपकी किस्त 24 घंटे में{'\n'}दर्ज कर देंगे।
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.payBtn, { backgroundColor: '#25D366' }]}
                onPress={shareScreenshot}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.payBtnTxt}>WhatsApp पर स्क्रीनशॉट भेजें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={reset}>
                <Text style={styles.cancelLinkTxt}>बाद में भेजूँगा / भेजूँगी</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function SwarnaSamriddhiScreen() {
  const [showPayment, setShowPayment] = useState(false);

  const callShowroom = () => Linking.openURL(`tel:${PHONE_NO}`);
  const openWA = () => {
    const msg = 'नमस्ते! मुझे स्वर्ण समृद्धि योजना के बारे में जानकारी चाहिए।';
    Linking.openURL(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeTxt}>SR</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerEyebrow}>शेखर राजा ज्वेलर्स प्रस्तुत करता है</Text>
          <Text style={styles.headerTitle}>स्वर्ण समृद्धि योजना</Text>
          <Text style={styles.headerTagline}>✦ विश्वास  ·  शुद्धता  ·  गुणवत्ता ✦</Text>
        </View>
      </View>
      <View style={styles.goldLine} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HERO */}
        <View style={styles.heroCard}>
          <Text style={styles.heroMain}>10 किस्तें आपकी</Text>
          <View style={styles.heroDivider} />
          <Text style={styles.heroBonus}>2 किस्तें हमारी 🎁</Text>
          <Text style={styles.heroSub}>
            अपने सपनों के सोने के आभूषण{'\n'}अब आसान किस्तों में खरीदें!
          </Text>
        </View>

        {/* FEATURES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="diamond-outline" size={16} color={GOLD} />
            <Text style={styles.sectionTitle}>योजना की विशेषताएँ</Text>
          </View>
          <View style={styles.featCard}>
            {[
              'ग्राहक केवल 10 मासिक किस्तें जमा करेगा।',
              'अंतिम 2 किस्तों का भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।',
              'कुल 12 किस्तों के मूल्य का सोने का आभूषण खरीदने का अवसर।',
              'अपनी सुविधानुसार मासिक किस्त राशि चुनें।',
              'योजना पूरी होने पर अपनी पसंद के सोने के आभूषण खरीदें।',
              '100% पारदर्शी एवं विश्वसनीय योजना।',
            ].map((t, i) => <Bullet key={i} text={t} />)}
          </View>
        </View>

        {/* CALCULATOR */}
        <Calculator />

        {/* PAY NOW */}
        <View style={styles.paySection}>
          <TouchableOpacity
            style={styles.payNowBtn}
            onPress={() => setShowPayment(true)}
            activeOpacity={0.88}
          >
            <Ionicons name="card" size={22} color={PURPLE_DARK} />
            <View style={{ flex: 1 }}>
              <Text style={styles.payNowTitle}>किस्त जमा करें</Text>
              <Text style={styles.payNowSub}>UPI · PhonePe · GPay · Paytm</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={PURPLE_DARK} />
          </TouchableOpacity>
        </View>

        {/* TERMS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="document-text-outline" size={16} color={GOLD} />
            <Text style={styles.sectionTitle}>नियम एवं शर्तें</Text>
          </View>
          <View style={styles.featCard}>
            {[
              'योजना की अवधि 12 माह होगी।',
              'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी।',
              'अंतिम 2 किस्तों का लाभ केवल योजना की सभी शर्तें पूरी करने पर मिलेगा।',
              'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।',
              'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।',
              'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।',
            ].map((t, i) => <Bullet key={i} text={t} />)}
          </View>
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>आज ही जुड़ें! 🌟</Text>
          <Text style={styles.ctaSub}>
            अपने सपनों के गहनों की शुरुआत करें।{'\n'}
            ज्वेलरी बुकिंग एवं अधिक जानकारी के लिए{'\n'}
            हमारे शोरूम से संपर्क करें।
          </Text>
          <TouchableOpacity style={styles.waBtn} onPress={openWA} activeOpacity={0.88}>
            <Ionicons name="logo-whatsapp" size={20} color="#fff" />
            <Text style={styles.waBtnTxt}>WhatsApp पर संपर्क करें</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callBtn} onPress={callShowroom} activeOpacity={0.88}>
            <Ionicons name="call-outline" size={18} color={PURPLE_MID} />
            <Text style={styles.callBtnTxt}>+91 83779 11745</Text>
          </TouchableOpacity>
          <Text style={styles.websiteLink}>www.shekharrajajewellers.com</Text>
        </View>
      </ScrollView>

      <PaymentModal
        visible={showPayment}
        onClose={() => setShowPayment(false)}
        monthly={5000}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  header: {
    backgroundColor: PURPLE_DARK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerBadge:    { width: 52, height: 52, borderRadius: 26, backgroundColor: GOLD, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: GOLD_LIGHT },
  headerBadgeTxt: { color: PURPLE_DARK, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  headerEyebrow:  { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  headerTitle:    { color: '#FFFFFF', fontSize: 22, fontWeight: '900', lineHeight: 28, marginTop: 2 },
  headerTagline:  { color: GOLD, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 4 },
  goldLine:       { height: 3, backgroundColor: GOLD },

  heroCard: {
    backgroundColor: PURPLE_DARK,
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.6)',
    shadowColor: GOLD,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heroMain:    { color: GOLD_LIGHT, fontSize: 28, fontWeight: '900', letterSpacing: 0.5, textAlign: 'center' },
  heroDivider: { width: 60, height: 2, backgroundColor: GOLD, marginVertical: 12, borderRadius: 1 },
  heroBonus:   { color: '#FFFFFF', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  heroSub:     { color: 'rgba(255,255,255,0.7)', fontSize: 14, textAlign: 'center', marginTop: 12, lineHeight: 22 },

  section:       { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle:  { color: TEXT_DARK, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  featCard:      { backgroundColor: BG_CARD, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: BORDER },

  bulletRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  bulletDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: GOLD, marginTop: 6, flexShrink: 0 },
  bulletText: { flex: 1, color: TEXT_MID, fontSize: 13, lineHeight: 20 },

  calcCard: {
    backgroundColor: PURPLE_DARK,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  calcTitle:       { color: '#FFFFFF', fontSize: 16, fontWeight: '900', marginBottom: 4 },
  calcSub:         { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 },
  emiChip:         { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  emiChipActive:   { backgroundColor: GOLD, borderColor: GOLD },
  emiChipTxt:      { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' },
  emiChipTxtActive:{ color: PURPLE_DARK },
  calcRow:         { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  calcItem:        { flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 12, alignItems: 'center' },
  calcLabel:       { color: 'rgba(255,255,255,0.6)', fontSize: 11, textAlign: 'center', marginBottom: 4 },
  calcValue:       { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  calcPlus:        { alignItems: 'center' },
  calcTotal:       { backgroundColor: GOLD, borderRadius: 12, padding: 14, marginTop: 14, alignItems: 'center' },
  calcTotalLabel:  { color: PURPLE_DARK, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  calcTotalValue:  { color: PURPLE_DARK, fontSize: 26, fontWeight: '900', marginTop: 4 },

  paySection: { marginHorizontal: 16, marginBottom: 16 },
  payNowBtn:  {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: GOLD,
    borderRadius: 16,
    padding: 18,
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  payNowTitle: { color: PURPLE_DARK, fontSize: 16, fontWeight: '900' },
  payNowSub:   { color: 'rgba(45,27,94,0.7)', fontSize: 11, marginTop: 2 },

  ctaCard: {
    backgroundColor: PURPLE_DARK,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.4)',
  },
  ctaTitle:   { color: GOLD, fontSize: 22, fontWeight: '900', marginBottom: 10 },
  ctaSub:     { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', lineHeight: 22, marginBottom: 20 },
  waBtn:      { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#25D366', borderRadius: 28, paddingVertical: 13, paddingHorizontal: 28, marginBottom: 12, width: '100%', justifyContent: 'center' },
  waBtnTxt:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  callBtn:    { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 28, paddingVertical: 12, paddingHorizontal: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', marginBottom: 14, width: '100%', justifyContent: 'center' },
  callBtnTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  websiteLink:{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 1 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet:    { backgroundColor: BG_CARD, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHandle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: 'center', marginBottom: 16 },
  modalTitle:    { color: TEXT_DARK, fontSize: 20, fontWeight: '900', textAlign: 'center' },
  modalSub:      { color: TEXT_LIGHT, fontSize: 13, textAlign: 'center', marginTop: 4, marginBottom: 12 },
  goldTopBar:    { height: 2, backgroundColor: GOLD, borderRadius: 1, marginBottom: 20 },

  fieldWrap:  { marginBottom: 8 },
  fieldLabel: { color: TEXT_LIGHT, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  fieldRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: BG, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: BORDER, marginBottom: 4 },
  fieldInput: { flex: 1, color: TEXT_DARK, fontSize: 16, fontWeight: '700' },
  rupee:      { color: GOLD, fontSize: 18, fontWeight: '900' },

  payBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: PURPLE_DARK, borderRadius: 28, paddingVertical: 15, marginTop: 16 },
  payBtnTxt:     { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  cancelLink:    { alignItems: 'center', marginTop: 14 },
  cancelLinkTxt: { color: TEXT_LIGHT, fontSize: 13 },

  upiBox:    { alignItems: 'center', backgroundColor: BG, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: BORDER, marginBottom: 16 },
  upiIdLabel:{ color: TEXT_LIGHT, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginTop: 12, marginBottom: 4 },
  upiId:     { color: TEXT_DARK, fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  upiNote:   { color: TEXT_LIGHT, fontSize: 11, marginTop: 6 },
  upiApps:   { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  upiAppBtn: { alignItems: 'center', gap: 6, backgroundColor: BG, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18, borderWidth: 1, borderColor: BORDER },
  upiAppName:{ color: TEXT_DARK, fontSize: 11, fontWeight: '700' },

  screenshotBox:  { alignItems: 'center', backgroundColor: '#f0fdf4', borderRadius: 16, padding: 24, marginVertical: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  screenshotText: { color: TEXT_MID, fontSize: 14, textAlign: 'center', lineHeight: 24, marginTop: 12 },
});
