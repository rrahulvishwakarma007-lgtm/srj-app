import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Linking, Dimensions, Modal, Animated, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';

const { width: W } = Dimensions.get('window');

// ── Colour palette (unchanged) ────────────────────────────────────────────────
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

const UPI_ID      = 'eazypay.9TF00QR5BL4W0IS@icici';
const WHATSAPP_NO = '918377911745';
const PHONE_NO    = '+918377911745';

const EMI_OPTIONS = [2000, 3000, 5000, 7000, 10000, 15000, 20000];

// ── Skeleton shimmer ──────────────────────────────────────────────────────────
function useShimmer() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.75] });
  return opacity;
}

function SkeletonBlock({
  width = '100%', height = 16, radius = 8, style = {},
}) {
  const opacity = useShimmer();
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: PURPLE_MID,
          opacity,
        },
        style,
      ]}
    />
  );
}

function SkeletonScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* skeleton header */}
      <View style={styles.header}>
        <View style={[styles.headerBadge, { backgroundColor: PURPLE_MID, opacity: 0.5 }]} />
        <View style={{ flex: 1, gap: 6 }}>
          <SkeletonBlock width="55%" height={10} />
          <SkeletonBlock width="80%" height={20} radius={6} />
          <SkeletonBlock width="60%" height={10} />
        </View>
      </View>
      <View style={[styles.goldLine, { opacity: 0.3 }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* skeleton hero card */}
        <View style={[styles.heroCard, { gap: 14, paddingVertical: 28 }]}>
          <SkeletonBlock width="65%" height={28} radius={8} />
          <SkeletonBlock width={60} height={3} radius={2} />
          <SkeletonBlock width="70%" height={24} radius={8} />
          <SkeletonBlock width="80%" height={14} radius={6} />
          <SkeletonBlock width="55%" height={14} radius={6} />
        </View>

        {/* skeleton features */}
        <View style={[styles.section, { gap: 10 }]}>
          <SkeletonBlock width="45%" height={18} radius={6} />
          <View style={[styles.featCard, { gap: 12 }]}>
            {[...Array(6)].map((_, i) => (
              <SkeletonBlock key={i} width={`${70 + (i % 3) * 10}%`} height={13} radius={5} />
            ))}
          </View>
        </View>

        {/* skeleton calculator */}
        <View style={[styles.calcCard, { gap: 12 }]}>
          <SkeletonBlock width="50%" height={18} radius={6} />
          <SkeletonBlock width="40%" height={12} radius={5} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[...Array(4)].map((_, i) => (
              <SkeletonBlock key={i} width={72} height={34} radius={20} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <View style={[styles.calcItem, { flex: 1, gap: 8 }]}>
              <SkeletonBlock width="80%" height={11} radius={4} />
              <SkeletonBlock width="60%" height={22} radius={6} />
            </View>
            <SkeletonBlock width={24} height={24} radius={12} />
            <View style={[styles.calcItem, { flex: 1, gap: 8 }]}>
              <SkeletonBlock width="80%" height={11} radius={4} />
              <SkeletonBlock width="60%" height={22} radius={6} />
            </View>
          </View>
          <SkeletonBlock width="100%" height={64} radius={12} />
        </View>

        {/* skeleton pay button */}
        <View style={styles.paySection}>
          <SkeletonBlock width="100%" height={64} radius={16} />
        </View>

        {/* skeleton CTA card */}
        <View style={[styles.ctaCard, { gap: 12 }]}>
          <SkeletonBlock width="45%" height={24} radius={8} />
          <SkeletonBlock width="75%" height={13} radius={5} />
          <SkeletonBlock width="65%" height={13} radius={5} />
          <SkeletonBlock width="100%" height={48} radius={28} style={{ marginTop: 8 }} />
          <SkeletonBlock width="100%" height={44} radius={28} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Bullet ────────────────────────────────────────────────────────────────────
function Bullet({ text, index }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletNumberBadge}>
        <Text style={styles.bulletNumber}>{index + 1}</Text>
      </View>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

// ── Step indicator for hero ───────────────────────────────────────────────────
function StepPill({ label, sub, accent }) {
  return (
    <View style={[styles.stepPill, accent && styles.stepPillAccent]}>
      <Text style={[styles.stepLabel, accent && styles.stepLabelAccent]}>{label}</Text>
      <Text style={[styles.stepSub, accent && styles.stepSubAccent]}>{sub}</Text>
    </View>
  );
}

// ── Calculator ────────────────────────────────────────────────────────────────
function Calculator() {
  const [monthly, setMonthly] = useState(5000);
  const valueAnim = useRef(new Animated.Value(1)).current;

  const customerTotal = monthly * 10;
  const srjBonus      = monthly * 2;
  const grandTotal    = customerTotal + srjBonus;

  const selectAmount = (amt) => {
    setMonthly(amt);
    Animated.sequence([
      Animated.timing(valueAnim, { toValue: 0.85, duration: 100, useNativeDriver: true }),
      Animated.timing(valueAnim, { toValue: 1,    duration: 180, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.calcCard}>
      {/* header */}
      <View style={styles.calcHeader}>
        <View style={styles.calcIconWrap}>
          <Ionicons name="calculator-outline" size={18} color={GOLD} />
        </View>
        <View>
          <Text style={styles.calcTitle}>अपना लाभ जानें</Text>
          <Text style={styles.calcSub}>मासिक किस्त चुनें</Text>
        </View>
      </View>

      {/* EMI chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {EMI_OPTIONS.map(amt => (
            <TouchableOpacity
              key={amt}
              style={[styles.emiChip, monthly === amt && styles.emiChipActive]}
              onPress={() => selectAmount(amt)}
              activeOpacity={0.8}
            >
              <Text style={[styles.emiChipTxt, monthly === amt && styles.emiChipTxtActive]}>
                ₹{amt.toLocaleString('en-IN')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* breakdown */}
      <Animated.View style={[styles.calcRow, { transform: [{ scale: valueAnim }] }]}>
        <View style={styles.calcItem}>
          <Text style={styles.calcLabel}>आपकी 10 किस्तें</Text>
          <Text style={styles.calcValue}>₹{customerTotal.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.calcPlus}>
          <Ionicons name="add-circle" size={26} color={GOLD} />
        </View>
        <View style={styles.calcItem}>
          <Text style={styles.calcLabel}>हमारी 2 किस्तें</Text>
          <Text style={[styles.calcValue, { color: '#4ade80' }]}>
            ₹{srjBonus.toLocaleString('en-IN')}
          </Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeTxt}>FREE</Text>
          </View>
        </View>
      </Animated.View>

      {/* total */}
      <Animated.View style={[styles.calcTotal, { transform: [{ scale: valueAnim }] }]}>
        <View style={styles.calcTotalInner}>
          <View>
            <Text style={styles.calcTotalLabel}>कुल आभूषण मूल्य</Text>
            <Text style={styles.calcTotalSub}>12 किस्तों के बराबर</Text>
          </View>
          <Text style={styles.calcTotalValue}>₹{grandTotal.toLocaleString('en-IN')}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ── Payment Modal ─────────────────────────────────────────────────────────────
function PaymentModal({ visible, onClose, monthly }) {
  const [step, setStep]       = useState('amount');
  const [custAmt, setCustAmt] = useState(String(monthly));
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slideAnim             = useRef(new Animated.Value(0)).current;

  // Webhook URL provided[cite: 1]
  const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyM6bnBK_ndiWcuUIu9VMacz93T85q0OSrLFXSU06boG8tfGQJbyV6pDPaEmrabfuSHUg/exec';

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 1, useNativeDriver: true, tension: 65, friction: 11 }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  const handleFormSubmit = async () => {
    // Form Validation
    if (!name.trim() || !phone.trim() || !address.trim() || !custAmt.trim()) {
      Alert.alert('ध्यान दें', 'कृपया भुगतान से पहले सभी जानकारी (नाम, नंबर, पता और राशि) भरें।');
      return;
    }

    setIsSubmitting(true);

    // Format date as DD/MM/YYYY HH:MM
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const readableDate = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    try {
      const emiAmount   = parseInt(custAmt.trim()) || 0;
      const userPays    = emiAmount * 10;           // 10 instalments by customer
      const srjBonus    = emiAmount * 2;            // 2 instalments by SRJ
      const totalValue  = userPays + srjBonus;      // 12 instalments total

      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          date:       readableDate,
          fullName:   name.trim(),
          phone:      phone.trim(),
          city:       address.trim(),
          emi:        emiAmount,
          userPays:   userPays,
          srjBonus:   srjBonus,
          totalValue: totalValue,
        }),
      });

      // Assuming the submission is successful, move to UPI step
      setStep('upi');
    } catch (error) {
      console.error(error);
      Alert.alert('त्रुटि', 'डेटा सबमिट करने में विफल। कृपया अपना इंटरनेट कनेक्शन जांचें और पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openUPI = () => {
    const amt    = parseInt(custAmt) || monthly;
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Shekhar%20Raja%20Jewellers&am=${amt}&cu=INR&tn=Swarna%20Samriddhi%20Yojana%20EMI`;
    Linking.openURL(upiUrl).catch(() => {
      Alert.alert('UPI App नहीं मिला', `कृपया PhonePe, Google Pay या Paytm से भुगतान करें।\nUPI ID: ${UPI_ID}`);
    });
    setStep('screenshot');
  };

  const shareScreenshot = () => {
    const msg =
      `नमस्ते Shekhar Raja Jewellers 🙏\n\n` +
      `मैं *स्वर्ण समृद्धि योजना* में शामिल होना चाहता/चाहती हूँ।\n\n` +
      `👤 नाम: ${name || '(कृपया भरें)'}\n` +
      `📞 नंबर: ${phone}\n` +
      `🏠 पता: ${address}\n` +
      `💰 मासिक किस्त: ₹${custAmt}\n\n` +
      `मैंने भुगतान का स्क्रीनशॉट संलग्न कर रहा/रही हूँ।\n` +
      `कृपया मेरी योजना सक्रिय करें। धन्यवाद!`;
    Linking.openURL(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`).catch(() =>
      Alert.alert('WhatsApp', PHONE_NO)
    );
    onClose(); setStep('amount');
  };

  const reset = () => { 
    setStep('amount'); 
    setName('');
    setPhone('');
    setAddress('');
    onClose(); 
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1], outputRange: [600, 0], // Increased to 600 for taller sheet
  });

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={reset}>
      <View style={styles.modalBackdrop}>
        <Animated.View style={[styles.modalSheet, { transform: [{ translateY }], maxHeight: '90%' }]}>
          <View style={styles.modalHandle} />

          {step === 'amount' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalTitleRow}>
                <View style={styles.modalIconWrap}>
                  <Ionicons name="card" size={20} color={GOLD} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>योजना पंजीकरण</Text>
                  <Text style={styles.modalSub}>स्वर्ण समृद्धि योजना</Text>
                </View>
              </View>
              <View style={styles.goldTopBar} />

              <View style={styles.fieldWrap}>
                {/* Name Field */}
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

                {/* Phone Field */}
                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>मोबाइल नंबर</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="call-outline" size={16} color={TEXT_LIGHT} />
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    placeholderTextColor={TEXT_LIGHT}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                {/* Address Field */}
                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>आपका पता</Text>
                <View style={styles.fieldRow}>
                  <Ionicons name="home-outline" size={16} color={TEXT_LIGHT} />
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="शहर / पूरा पता"
                    placeholderTextColor={TEXT_LIGHT}
                    value={address}
                    onChangeText={setAddress}
                  />
                </View>

                {/* Amount Field */}
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

              <TouchableOpacity 
                style={[styles.payBtn, isSubmitting && { opacity: 0.7 }]} 
                onPress={handleFormSubmit} 
                activeOpacity={0.88}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="card-outline" size={20} color="#fff" />
                    <Text style={styles.payBtnTxt}>UPI से भुगतान करें</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={reset}>
                <Text style={styles.cancelLinkTxt}>रद्द करें</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 'upi' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalTitleRow}>
                <View style={styles.modalIconWrap}>
                  <Ionicons name="qr-code-outline" size={20} color={GOLD} />
                </View>
                <View>
                  <Text style={styles.modalTitle}>UPI भुगतान</Text>
                  <Text style={styles.modalSub}>₹{custAmt} भेजें</Text>
                </View>
              </View>
              <View style={styles.goldTopBar} />

              <View style={styles.upiBox}>
                <View style={styles.upiQrCircle}>
                  <Ionicons name="qr-code-outline" size={52} color={GOLD} />
                </View>
                <Text style={styles.upiIdLabel}>UPI ID</Text>
                <View style={styles.upiIdRow}>
                  <Text style={styles.upiId}>{UPI_ID}</Text>
                </View>
                <Text style={styles.upiNote}>PhonePe · GPay · Paytm · BHIM</Text>
              </View>

              <View style={styles.upiApps}>
                {[
                  { name: 'PhonePe', icon: 'phone-portrait-outline' },
                  { name: 'GPay',    icon: 'logo-google'            },
                  { name: 'Paytm',   icon: 'wallet-outline'         },
                ].map(app => (
                  <TouchableOpacity key={app.name} style={styles.upiAppBtn} onPress={openUPI} activeOpacity={0.8}>
                    <Ionicons name={app.icon} size={22} color={PURPLE_MID} />
                    <Text style={styles.upiAppName}>{app.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.payBtn} onPress={openUPI} activeOpacity={0.88}>
                <Ionicons name="open-outline" size={20} color="#fff" />
                <Text style={styles.payBtnTxt}>UPI ऐप खोलें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={() => setStep('amount')}>
                <Text style={styles.cancelLinkTxt}>← वापस जाएं</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {step === 'screenshot' && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalTitle, { textAlign: 'center', marginBottom: 4 }]}>भुगतान हो गया! 🎉</Text>
              <Text style={[styles.modalSub, { textAlign: 'center', marginBottom: 14 }]}>स्क्रीनशॉट WhatsApp पर भेजें</Text>
              <View style={styles.goldTopBar} />
              <View style={styles.screenshotBox}>
                <View style={styles.successCircle}>
                  <Ionicons name="checkmark" size={36} color={GREEN} />
                </View>
                <Text style={styles.screenshotText}>
                  भुगतान का स्क्रीनशॉट हमें{'\n'}WhatsApp पर भेजें।{'\n'}
                  हम आपकी किस्त 24 घंटे में{'\n'}दर्ज कर देंगे।
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.payBtn, { backgroundColor: '#25D366' }]}
                onPress={shareScreenshot}
                activeOpacity={0.88}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.payBtnTxt}>WhatsApp पर स्क्रीनशॉट भेजें</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelLink} onPress={reset}>
                <Text style={styles.cancelLinkTxt}>बाद में भेजूँगा / भेजूँगी</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
function SectionHeader({ icon, title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIconBadge}>
        <Ionicons name={icon} size={14} color={GOLD} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SwarnaSamriddhiScreen() {
  const [loading,     setLoading]     = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate a brief load (replace with real data fetch if needed)
    const t = setTimeout(() => {
      setLoading(false);
      Animated.timing(fadeIn, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  const callShowroom = () => Linking.openURL(`tel:${PHONE_NO}`);
  const openWA = () => {
    const msg = 'नमस्ते! मुझे स्वर्ण समृद्धि योजना के बारे में जानकारी चाहिए।';
    Linking.openURL(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`);
  };

  if (loading) return <SkeletonScreen />;

  return (
    <Animated.View style={[{ flex: 1 }, { opacity: fadeIn }]}>
      <SafeAreaView style={styles.container} edges={['top']}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeTxt}>SR</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerEyebrow}>SHEKHAR RAJA JEWELLERS  ·  EST. 1987</Text>
            <Text style={styles.headerTitle}>स्वर्ण समृद्धि योजना</Text>
            <Text style={styles.headerTagline}>✦ विश्वास  ·  शुद्धता  ·  गुणवत्ता ✦</Text>
          </View>
        </View>
        <View style={styles.goldLine} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 48 }}
        >

          {/* ── HERO VIDEO (clean, full-width, no overlay) ────────────────── */}
          <View style={styles.heroVideoWrap}>
            <Video
              source={{ uri: 'https://shekharrajajewellers.com/goldoffer.mp4' }}
              style={styles.heroVideo}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
              useNativeControls={false}
            />
            {/* thin gold border bottom accent */}
            <View style={styles.heroVideoBorder} />
          </View>

          {/* ── HERO CONTENT (below video) ───────────────────────────────── */}
          <View style={styles.heroCard}>
            {/* decorative corner marks */}
            <View style={styles.cornerTL} /><View style={styles.cornerTR} />
            <View style={styles.cornerBL} /><View style={styles.cornerBR} />

            <Text style={styles.heroEyebrow}>✦  योजना का लाभ  ✦</Text>
            <Text style={styles.heroMain}>10 किस्तें आपकी</Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroBonus}>2 किस्तें हमारी 🎁</Text>

            <View style={styles.heroPillRow}>
              <StepPill label="आप देते हैं" sub="10 किस्त" />
              <View style={styles.plusCircle}>
                <Text style={styles.plusTxt}>+</Text>
              </View>
              <StepPill label="हम देते हैं" sub="2 किस्त FREE" accent />
            </View>

            <Text style={styles.heroSub}>
              अपने सपनों के सोने के आभूषण{'\n'}अब आसान किस्तों में खरीदें!
            </Text>
          </View>

          {/* ── FEATURES ─────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <SectionHeader icon="diamond-outline" title="योजना की विशेषताएँ" />
            <View style={styles.featCard}>
              {[
                'ग्राहक केवल 10 मासिक किस्तें जमा करेगा।',
                'अंतिम 2 किस्तों का भुगतान शेखर राजा ज्वेलर्स द्वारा किया जाएगा।',
                'कुल 12 किस्तों के मूल्य का सोने का आभूषण खरीदने का अवसर।',
                'अपनी सुविधानुसार मासिक किस्त राशि चुनें।',
                'योजना पूरी होने पर अपनी पसंद के सोने के आभूषण खरीदें।',
                '100% पारदर्शी एवं विश्वसनीय योजना।',
              ].map((t, i) => <Bullet key={i} text={t} index={i} />)}
            </View>
          </View>

          {/* ── CALCULATOR ───────────────────────────────────────────────── */}
          <Calculator />

          {/* ── PAY NOW ──────────────────────────────────────────────────── */}
          <View style={styles.paySection}>
            <TouchableOpacity
              style={styles.payNowBtn}
              onPress={() => setShowPayment(true)}
              activeOpacity={0.88}
            >
              <View style={styles.payNowIconWrap}>
                <Ionicons name="card" size={22} color={PURPLE_DARK} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.payNowTitle}>किस्त जमा करें</Text>
                <Text style={styles.payNowSub}>UPI · PhonePe · GPay · Paytm</Text>
              </View>
              <View style={styles.payArrow}>
                <Ionicons name="arrow-forward" size={16} color={PURPLE_DARK} />
              </View>
            </TouchableOpacity>
          </View>

          {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
          <View style={styles.section}>
            <SectionHeader icon="git-commit-outline" title="यह कैसे काम करता है" />
            <View style={styles.howCard}>
              {[
                { step: '1', text: 'योजना में नामांकन करें', icon: 'person-add-outline' },
                { step: '2', text: 'हर माह किस्त जमा करें', icon: 'calendar-outline' },
                { step: '3', text: '10 किस्त पूरी करें',     icon: 'checkmark-done-outline' },
                { step: '4', text: 'पसंद के गहने खरीदें',    icon: 'bag-check-outline' },
              ].map((item, i, arr) => (
                <View key={item.step} style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ alignItems: 'center', width: 36 }}>
                    <View style={styles.howStepCircle}>
                      <Text style={styles.howStepNum}>{item.step}</Text>
                    </View>
                    {i < arr.length - 1 && <View style={styles.howStepLine} />}
                  </View>
                  <View style={styles.howStepContent}>
                    <Ionicons name={item.icon} size={16} color={GOLD} />
                    <Text style={styles.howStepText}>{item.text}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ── TERMS ────────────────────────────────────────────────────── */}
          <View style={styles.section}>
            <SectionHeader icon="document-text-outline" title="नियम एवं शर्तें" />
            <View style={styles.termsCard}>
              {[
                'योजना की अवधि 12 माह होगी।',
                'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होगी।',
                'अंतिम 2 किस्तों का लाभ केवल योजना की सभी शर्तें पूरी करने पर मिलेगा।',
                'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।',
                'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।',
                'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।',
                '२४ कैरेट गोल्ड और गोल्ड बिस्किट्स में यह योजना मान्य नहीं होगी।',
              ].map((t, i) => (
                <View key={i} style={styles.termRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={TEXT_LIGHT} style={{ marginTop: 2, flexShrink: 0 }} />
                  <Text style={styles.termText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── CTA ──────────────────────────────────────────────────────── */}
          <View style={styles.ctaCard}>
            <View style={styles.ctaTopAccent} />
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
              <Ionicons name="call-outline" size={18} color="#fff" />
              <Text style={styles.callBtnTxt}>+91 83779 11745</Text>
            </TouchableOpacity>

            <View style={styles.ctaDivider}>
              <View style={styles.ctaDividerLine} />
              <Text style={styles.ctaDividerTxt}>या</Text>
              <View style={styles.ctaDividerLine} />
            </View>

            <Text style={styles.websiteLink}>🌐  www.shekharrajajewellers.com</Text>
          </View>

        </ScrollView>

        <PaymentModal
          visible={showPayment}
          onClose={() => setShowPayment(false)}
          monthly={5000}
        />
      </SafeAreaView>
    </Animated.View>
  );
}

// ── StyleSheet ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    backgroundColor: PURPLE_DARK,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  headerBadge: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: GOLD_LIGHT,
    shadowColor: GOLD, shadowOpacity: 0.5, shadowRadius: 8, elevation: 6,
  },
  headerBadgeTxt: { color: PURPLE_DARK, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  headerEyebrow:  { color: 'rgba(255,255,255,0.5)', fontSize: 9.5, fontWeight: '700', letterSpacing: 1.5 },
  headerTitle:    { color: '#FFFFFF', fontSize: 21, fontWeight: '900', lineHeight: 28, marginTop: 2 },
  headerTagline:  { color: GOLD, fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginTop: 4 },
  goldLine:       { height: 3, backgroundColor: GOLD },

  // Hero video — full width standalone block
  heroVideoWrap: {
    width: '100%',
    backgroundColor: '#000',
  },
  heroVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  heroVideoBorder: {
    height: 3,
    backgroundColor: GOLD,
  },

  // Hero content card — below the video
  heroCard: {
    backgroundColor: PURPLE_DARK,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 22,
    padding: 26,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.55)',
    shadowColor: GOLD, shadowOpacity: 0.18, shadowRadius: 16, elevation: 8,
  },
  heroOverlay: {},
  cornerTL: { position: 'absolute', top: 10, left: 10, width: 14, height: 14, borderTopWidth: 2, borderLeftWidth: 2, borderColor: GOLD, borderRadius: 2 },
  cornerTR: { position: 'absolute', top: 10, right: 10, width: 14, height: 14, borderTopWidth: 2, borderRightWidth: 2, borderColor: GOLD, borderRadius: 2 },
  cornerBL: { position: 'absolute', bottom: 10, left: 10, width: 14, height: 14, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: GOLD, borderRadius: 2 },
  cornerBR: { position: 'absolute', bottom: 10, right: 10, width: 14, height: 14, borderBottomWidth: 2, borderRightWidth: 2, borderColor: GOLD, borderRadius: 2 },
  heroEyebrow:  { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '700', letterSpacing: 2, marginBottom: 10 },
  heroMain:    { color: GOLD_LIGHT, fontSize: 28, fontWeight: '900', letterSpacing: 0.5, textAlign: 'center' },
  heroDivider: { width: 70, height: 2.5, backgroundColor: GOLD, marginVertical: 12, borderRadius: 2 },
  heroBonus:   { color: '#FFFFFF', fontSize: 24, fontWeight: '900', textAlign: 'center' },
  heroPillRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18, marginBottom: 4 },
  stepPill: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  stepPillAccent: { backgroundColor: GOLD_DIM, borderColor: GOLD },
  stepLabel: { color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  stepLabelAccent: { color: GOLD },
  stepSub:   { color: '#FFFFFF', fontSize: 13, fontWeight: '800', marginTop: 2 },
  stepSubAccent: { color: GOLD_LIGHT },
  plusCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: GOLD,
  },
  plusTxt:  { color: GOLD, fontSize: 18, fontWeight: '900', lineHeight: 22 },
  heroSub:  { color: 'rgba(255,255,255,0.65)', fontSize: 13.5, textAlign: 'center', marginTop: 14, lineHeight: 22 },

  // Sections
  section:       { marginHorizontal: 16, marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionIconBadge: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: PURPLE_DARK,
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { color: TEXT_DARK, fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },

  // Feature card
  featCard: {
    backgroundColor: BG_CARD, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: PURPLE_DARK, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },

  // Bullets
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  bulletNumberBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: GOLD_DIM,
    borderWidth: 1, borderColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  bulletNumber: { color: GOLD, fontSize: 10, fontWeight: '900' },
  bulletText:   { flex: 1, color: TEXT_MID, fontSize: 13.5, lineHeight: 21 },

  // Calculator
  calcCard: {
    backgroundColor: PURPLE_DARK,
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 22, padding: 20,
    borderWidth: 1, borderColor: 'rgba(201,168,76,0.4)',
    shadowColor: GOLD, shadowOpacity: 0.12, shadowRadius: 12, elevation: 5,
  },
  calcHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 2 },
  calcIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1, borderColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
  },
  calcTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  calcSub:   { color: 'rgba(255,255,255,0.55)', fontSize: 12 },
  emiChip:   {
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)',
  },
  emiChipActive:    { backgroundColor: GOLD, borderColor: GOLD },
  emiChipTxt:       { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontWeight: '700' },
  emiChipTxtActive: { color: PURPLE_DARK, fontWeight: '900' },
  calcRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  calcItem: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 14, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  calcLabel:   { color: 'rgba(255,255,255,0.55)', fontSize: 10.5, textAlign: 'center', marginBottom: 6 },
  calcValue:   { color: '#FFFFFF', fontSize: 18, fontWeight: '900' },
  freeBadge:   {
    marginTop: 6, backgroundColor: 'rgba(74,222,128,0.2)',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
    borderWidth: 1, borderColor: 'rgba(74,222,128,0.4)',
  },
  freeBadgeTxt: { color: '#4ade80', fontSize: 9, fontWeight: '900', letterSpacing: 1.5 },
  calcPlus: { alignItems: 'center' },
  calcTotal: {
    backgroundColor: GOLD, borderRadius: 14, padding: 16, marginTop: 14,
    shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  calcTotalInner:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  calcTotalLabel:  { color: PURPLE_DARK, fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  calcTotalSub:    { color: 'rgba(45,27,94,0.6)', fontSize: 10, marginTop: 2 },
  calcTotalValue:  { color: PURPLE_DARK, fontSize: 26, fontWeight: '900' },

  // Pay now
  paySection: { marginHorizontal: 16, marginBottom: 16 },
  payNowBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: GOLD, borderRadius: 18, padding: 18,
    shadowColor: GOLD, shadowOpacity: 0.45, shadowRadius: 12, elevation: 7,
  },
  payNowIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(45,27,94,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  payNowTitle: { color: PURPLE_DARK, fontSize: 16, fontWeight: '900' },
  payNowSub:   { color: 'rgba(45,27,94,0.65)', fontSize: 11, marginTop: 2 },
  payArrow:    {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(45,27,94,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  // How it works
  howCard: {
    backgroundColor: BG_CARD, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: PURPLE_DARK, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  howStepCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: PURPLE_DARK,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: GOLD,
  },
  howStepNum:     { color: GOLD, fontSize: 12, fontWeight: '900' },
  howStepLine:    { width: 2, flex: 1, backgroundColor: GOLD_DIM, minHeight: 24, marginVertical: 2 },
  howStepContent: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 22, paddingLeft: 14, flex: 1 },
  howStepText:    { color: TEXT_MID, fontSize: 14, fontWeight: '600', flex: 1 },

  // Terms
  termsCard: {
    backgroundColor: BG_CARD, borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: BORDER,
    shadowColor: PURPLE_DARK, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  termRow:  { flexDirection: 'row', gap: 10, marginBottom: 10, alignItems: 'flex-start' },
  termText: { flex: 1, color: TEXT_LIGHT, fontSize: 12.5, lineHeight: 20 },

  // CTA card
  ctaCard: {
    backgroundColor: PURPLE_DARK,
    marginHorizontal: 16, marginBottom: 16,
    borderRadius: 22, padding: 26,
    alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.4)',
    shadowColor: GOLD, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
    overflow: 'hidden',
  },
  ctaTopAccent: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 4, backgroundColor: GOLD,
  },
  ctaTitle:   { color: GOLD, fontSize: 22, fontWeight: '900', marginTop: 8, marginBottom: 10 },
  ctaSub:     { color: 'rgba(255,255,255,0.65)', fontSize: 13.5, textAlign: 'center', lineHeight: 22, marginBottom: 22 },
  waBtn:      {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#25D366',
    borderRadius: 28, paddingVertical: 14, paddingHorizontal: 28,
    marginBottom: 12, width: '100%', justifyContent: 'center',
    shadowColor: '#25D366', shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  waBtnTxt:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  callBtn:    {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28, paddingVertical: 13, paddingHorizontal: 28,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 18, width: '100%', justifyContent: 'center',
  },
  callBtnTxt: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  ctaDivider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14, width: '80%' },
  ctaDividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  ctaDividerTxt:  { color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: '700' },
  websiteLink: { color: 'rgba(255,255,255,0.45)', fontSize: 11.5, letterSpacing: 0.8 },

  // Modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: BG_CARD,
    borderTopLeftRadius: 26, borderTopRightRadius: 26,
    padding: 24, paddingBottom: 44,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20, elevation: 20,
  },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: BORDER, alignSelf: 'center', marginBottom: 18 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  modalIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: GOLD_DIM, borderWidth: 1, borderColor: GOLD,
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { color: TEXT_DARK, fontSize: 20, fontWeight: '900' },
  modalSub:   { color: TEXT_LIGHT, fontSize: 13, marginTop: 2 },
  goldTopBar: { height: 2.5, backgroundColor: GOLD, borderRadius: 2, marginVertical: 18 },

  fieldWrap:  { marginBottom: 6 },
  fieldLabel: { color: TEXT_LIGHT, fontSize: 10, fontWeight: '800', letterSpacing: 2, marginBottom: 6 },
  fieldRow:   {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: BG, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    borderWidth: 1.5, borderColor: BORDER, marginBottom: 4,
  },
  fieldInput: { flex: 1, color: TEXT_DARK, fontSize: 16, fontWeight: '700' },
  rupee: { color: GOLD, fontSize: 18, fontWeight: '900' },

  payBtn:        {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: PURPLE_DARK, borderRadius: 28, paddingVertical: 16, marginTop: 16,
    shadowColor: PURPLE_DARK, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  payBtnTxt:     { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  cancelLink:    { alignItems: 'center', marginTop: 14 },
  cancelLinkTxt: { color: TEXT_LIGHT, fontSize: 13 },

  upiBox: {
    alignItems: 'center', backgroundColor: BG,
    borderRadius: 18, padding: 24,
    borderWidth: 1, borderColor: BORDER, marginBottom: 16,
  },
  upiQrCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: PURPLE_DARK,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: GOLD,
    marginBottom: 8,
  },
  upiIdLabel: { color: TEXT_LIGHT, fontSize: 10, fontWeight: '800', letterSpacing: 2.5, marginTop: 8, marginBottom: 4 },
  upiIdRow:   { backgroundColor: GOLD_DIM, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1, borderColor: GOLD },
  upiId:      { color: TEXT_DARK, fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  upiNote:    { color: TEXT_LIGHT, fontSize: 11, marginTop: 8 },
  upiApps:    { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  upiAppBtn:  {
    alignItems: 'center', gap: 6, backgroundColor: BG,
    borderRadius: 14, paddingVertical: 12, paddingHorizontal: 18,
    borderWidth: 1, borderColor: BORDER,
  },
  upiAppName: { color: TEXT_DARK, fontSize: 11, fontWeight: '700' },

  screenshotBox: {
    alignItems: 'center', backgroundColor: '#f0fdf4',
    borderRadius: 18, padding: 24, marginVertical: 14,
    borderWidth: 1.5, borderColor: '#bbf7d0',
  },
  successCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#dcfce7',
    borderWidth: 2, borderColor: '#86efac',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  screenshotText: { color: TEXT_MID, fontSize: 14, textAlign: 'center', lineHeight: 26, marginTop: 10 },
});
