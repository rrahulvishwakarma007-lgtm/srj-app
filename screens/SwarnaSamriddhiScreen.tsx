import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, Animated, Linking, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: W } = Dimensions.get('window');

const GOLD        = '#C9A84C';
const GOLD_LIGHT  = '#F0D080';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID  = '#4A2080';
const PURPLE_HERO = '#3D1A6E';
const BG          = '#F0EBFF';
const BG_CARD     = '#FFFFFF';
const BORDER      = '#DDD5F0';
const TEXT_DARK   = '#1A0A3E';
const TEXT_MID    = '#4A3570';
const TEXT_LIGHT  = '#8B7BAF';
const WHATSAPP    = '#25D366';
const GREEN       = '#16a34a';

const FEATURES = [
  { icon: '💰', title: '10 किस्तें आप भरें',  desc: 'केवल 10 मासिक किस्तें जमा करें' },
  { icon: '🎁', title: '2 किस्तें हम भरेंगे', desc: 'अंतिम 2 किस्तें हम देंगे — निःशुल्क!' },
  { icon: '✨', title: '100% पारदर्शी',        desc: 'पूरी तरह विश्वसनीय योजना' },
  { icon: '💍', title: 'पसंद के आभूषण',       desc: 'अपनी पसंद के गहने खरीदें' },
];

const TERMS = [
  'योजना की अवधि 12 माह होगी।',
  'ग्राहक को लगातार 10 मासिक किस्तें समय पर जमा करनी होंगी।',
  'अंतिम 2 किस्तों का लाभ केवल योजना की सभी शर्तें पूरी करने पर मिलेगा।',
  'यह योजना केवल सोने के आभूषणों की खरीद पर लागू होगी।',
  'योजना का लाभ नकद भुगतान के रूप में देय नहीं होगा।',
  'नियम एवं शर्तें समय-समय पर परिवर्तित की जा सकती हैं।',
];

// ── Animated Section Entry ────────────────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(anim, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 600, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ── EMI Calculator ────────────────────────────────────────────────────────────
function EmiCalculator() {
  const [emi, setEmi] = useState('5000');

  const parsed       = parseInt(emi.replace(/,/g, '')) || 0;
  const customerTotal= parsed * 10;
  const ourTotal     = parsed * 2;
  const grandTotal   = parsed * 12;

  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <View style={calc.wrap}>
      <View style={calc.header}>
        <Ionicons name="calculator" size={18} color={GOLD}/>
        <Text style={calc.headerText}>EMI Calculator — उदाहरण</Text>
      </View>

      {/* Input */}
      <Text style={calc.label}>मासिक किस्त राशि</Text>
      <View style={calc.inputRow}>
        <Text style={calc.rupee}>₹</Text>
        <TextInput
          style={calc.input}
          keyboardType="numeric"
          value={emi}
          onChangeText={setEmi}
          placeholder="5000"
          placeholderTextColor={TEXT_LIGHT}
        />
        <Text style={calc.perMonth}>/माह</Text>
      </View>

      {/* Quick amounts */}
      <View style={calc.quickRow}>
        {[2000, 5000, 10000, 20000].map(amt => (
          <TouchableOpacity
            key={amt}
            style={[calc.quickBtn, emi === String(amt) && calc.quickBtnActive]}
            onPress={() => setEmi(String(amt))}
          >
            <Text style={[calc.quickBtnText, emi === String(amt) && calc.quickBtnTextActive]}>
              ₹{(amt/1000).toFixed(0)}K
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results */}
      <View style={calc.resultsRow}>
        <View style={calc.resultCard}>
          <Text style={calc.resultLabel}>आपकी 10 किस्तें</Text>
          <Text style={calc.resultValue}>{fmt(customerTotal)}</Text>
          <Text style={calc.resultSub}>10 × {fmt(parsed)}</Text>
        </View>
        <View style={[calc.resultCard, calc.resultCardGift]}>
          <Text style={[calc.resultLabel, { color: GREEN }]}>हमारी 2 किस्तें 🎁</Text>
          <Text style={[calc.resultValue, { color: GREEN }]}>{fmt(ourTotal)}</Text>
          <Text style={calc.resultSub}>निःशुल्क लाभ</Text>
        </View>
        <View style={[calc.resultCard, calc.resultCardTotal]}>
          <Text style={[calc.resultLabel, { color: GOLD }]}>कुल खरीद मूल्य</Text>
          <Text style={[calc.resultValue, { color: GOLD }]}>{fmt(grandTotal)}</Text>
          <Text style={calc.resultSub}>12 किस्तों का</Text>
        </View>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SwarnaSamriddhiScreen() {
  const insets = useSafeAreaInsets();
  const [termsOpen, setTermsOpen] = useState(false);
  const termsAnim = useRef(new Animated.Value(0)).current;

  // Pulsing glow for header
  const glow = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.4, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const toggleTerms = () => {
    const toValue = termsOpen ? 0 : 1;
    Animated.timing(termsAnim, { toValue, duration: 300, useNativeDriver: false }).start();
    setTermsOpen(!termsOpen);
  };

  const wa = (msg = '') => Linking.openURL(
    `https://wa.me/918377911745?text=${encodeURIComponent(msg || 'नमस्ते! मुझे स्वर्ण समृद्धि योजना के बारे में जानकारी चाहिए।')}`
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Animated.View style={[styles.headerIconWrap, { opacity: glow }]}>
            <Ionicons name="diamond" size={20} color={GOLD}/>
          </Animated.View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerTitle}>स्वर्ण समृद्धि</Text>
            <Text style={styles.headerSub}>SHEKHAR RAJA JEWELLERS</Text>
          </View>
        </View>
        <View style={styles.liveBadge}>
          <View style={styles.liveDot}/>
          <Text style={styles.liveText}>NEW</Text>
        </View>
      </View>
      <View style={styles.goldLine}/>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* ── HERO BANNER ── */}
        <FadeIn delay={0}>
          <View style={styles.heroBanner}>
            {/* Background decoration */}
            <View style={styles.heroCornerTL}/>
            <View style={styles.heroCornerBR}/>

            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>◆ शेखर राजा ज्वेलर्स प्रस्तुत करता है ◆</Text>
            </View>

            <Text style={styles.heroTitle}>स्वर्ण{'\n'}समृद्धि{'\n'}योजना</Text>

            <View style={styles.heroDivider}>
              <View style={styles.heroDivLine}/>
              <Text style={styles.heroDivDiamond}>◆</Text>
              <View style={styles.heroDivLine}/>
            </View>

            <Text style={styles.heroTagline}>
              अपने सपनों के सोने के आभूषण अब{' '}
              <Text style={{ color: GOLD_LIGHT, fontWeight: '700' }}>आसान किस्तों</Text>
              {' '}में खरीदें!
            </Text>
          </View>
        </FadeIn>

        {/* ── OFFER HIGHLIGHT ── */}
        <FadeIn delay={100}>
          <View style={styles.offerWrap}>
            {/* Customer side */}
            <View style={styles.offerCard}>
              <Text style={styles.offerEmoji}>👤</Text>
              <Text style={styles.offerWhoLabel}>आप भरें</Text>
              <Text style={styles.offerNumber}>10</Text>
              <Text style={styles.offerDesc}>मासिक किस्तें</Text>
            </View>

            {/* Plus */}
            <View style={styles.offerPlus}>
              <Text style={styles.offerPlusText}>+</Text>
            </View>

            {/* Our side */}
            <View style={[styles.offerCard, styles.offerCardGold]}>
              <Text style={styles.offerEmoji}>🏆</Text>
              <Text style={[styles.offerWhoLabel, { color: GOLD }]}>हम भरेंगे</Text>
              <Text style={[styles.offerNumber, { color: GOLD }]}>2</Text>
              <Text style={[styles.offerDesc, { color: GOLD_LIGHT }]}>किस्तें — निःशुल्क!</Text>
            </View>
          </View>

          {/* Total bar */}
          <View style={styles.totalBar}>
            <Text style={styles.totalBarLabel}>= कुल 12 किस्तों के मूल्य का सोना खरीदें</Text>
          </View>
        </FadeIn>

        {/* ── FEATURES ── */}
        <FadeIn delay={200}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine}/>
            <Text style={styles.sectionTitle}>◆ योजना की विशेषताएँ ◆</Text>
            <View style={styles.sectionLine}/>
          </View>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </FadeIn>

        {/* ── EMI CALCULATOR ── */}
        <FadeIn delay={300}>
          <EmiCalculator/>
        </FadeIn>

        {/* ── HOW IT WORKS ── */}
        <FadeIn delay={350}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionLine}/>
            <Text style={styles.sectionTitle}>◆ कैसे काम करती है ◆</Text>
            <View style={styles.sectionLine}/>
          </View>
          <View style={styles.stepsWrap}>
            {[
              { step:'01', title:'राशि चुनें',     desc:'अपनी सुविधानुसार मासिक किस्त राशि तय करें।' },
              { step:'02', title:'10 किस्तें भरें', desc:'हर महीने समय पर किस्त जमा करें।' },
              { step:'03', title:'योजना पूरी करें', desc:'10 किस्तें पूरी होने पर आप योग्य हो जाते हैं।' },
              { step:'04', title:'गहने खरीदें',     desc:'12 किस्त मूल्य के गहने अपनी पसंद से खरीदें।' },
            ].map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNumWrap}>
                  <Text style={styles.stepNum}>{s.step}</Text>
                </View>
                {i < 3 && <View style={styles.stepLine}/>}
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </FadeIn>

        {/* ── TERMS ── */}
        <FadeIn delay={400}>
          <TouchableOpacity style={styles.termsHeader} onPress={toggleTerms} activeOpacity={0.8}>
            <View style={{ flexDirection:'row', alignItems:'center', gap:8 }}>
              <Ionicons name="shield-checkmark-outline" size={16} color={GOLD}/>
              <Text style={styles.termsHeaderText}>नियम एवं शर्तें</Text>
            </View>
            <Ionicons
              name={termsOpen ? 'chevron-up' : 'chevron-down'}
              size={16} color={GOLD}
            />
          </TouchableOpacity>
          {termsOpen && (
            <View style={styles.termsBody}>
              {TERMS.map((t, i) => (
                <View key={i} style={styles.termRow}>
                  <Text style={styles.termDot}>◆</Text>
                  <Text style={styles.termText}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </FadeIn>

        {/* ── CTA ── */}
        <FadeIn delay={450}>
          <View style={styles.ctaCard}>
            {/* SR watermark */}
            <Text style={styles.ctaWatermark}>SR</Text>

            <View style={styles.ctaStars}>
              {[...Array(5)].map((_,i) => (
                <Ionicons key={i} name="star" size={14} color={GOLD}/>
              ))}
            </View>

            <Text style={styles.ctaTitle}>आज ही जुड़ें!</Text>
            <Text style={styles.ctaTagline}>अपने सपनों के गहनों की शुरुआत करें</Text>
            <Text style={styles.ctaTrust}>विश्वास • शुद्धता • गुणवत्ता</Text>
            <Text style={styles.ctaQuote}>
              सोना सिर्फ आभूषण नहीं, आपके सपनों का निवेश है
            </Text>

            <TouchableOpacity
              style={styles.waBtn}
              onPress={() => wa()}
              activeOpacity={0.88}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }}/>
              <Text style={styles.waBtnText}>योजना में जुड़ें — WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Linking.openURL('tel:+918377911745')}
              activeOpacity={0.85}
            >
              <Ionicons name="call-outline" size={16} color={GOLD} style={{ marginRight:8 }}/>
              <Text style={styles.callBtnText}>+91 83779 11745</Text>
            </TouchableOpacity>

            <Text style={styles.ctaWebsite}>www.shekharrajajewellers.com</Text>
          </View>
        </FadeIn>

      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex:1, backgroundColor:PURPLE_DARK },
  scroll: { flex:1, backgroundColor:BG },
  goldLine: { height:3, backgroundColor:GOLD },

  // Header
  header:         { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:PURPLE_DARK, paddingHorizontal:16, paddingVertical:13 },
  headerLeft:     { flexDirection:'row', alignItems:'center' },
  headerIconWrap: { width:38, height:38, borderRadius:19, backgroundColor:'rgba(201,168,76,0.15)', alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:'rgba(201,168,76,0.35)' },
  headerTitle:    { color:GOLD, fontSize:17, fontWeight:'900' },
  headerSub:      { color:'rgba(240,208,128,0.55)', fontSize:8, letterSpacing:2, marginTop:1 },
  liveBadge:      { flexDirection:'row', alignItems:'center', gap:5, backgroundColor:'rgba(201,168,76,0.12)', borderRadius:99, paddingHorizontal:10, paddingVertical:4 },
  liveDot:        { width:7, height:7, borderRadius:4, backgroundColor:GOLD },
  liveText:       { color:GOLD, fontSize:10, fontWeight:'800', letterSpacing:1.5 },

  // Hero banner
  heroBanner: {
    backgroundColor:PURPLE_DARK, margin:16, borderRadius:20,
    padding:28, alignItems:'center',
    borderWidth:1, borderColor:'rgba(201,168,76,0.3)',
    overflow:'hidden', position:'relative',
    shadowColor:PURPLE_MID, shadowOpacity:0.4, shadowRadius:20, elevation:8,
  },
  heroCornerTL: {
    position:'absolute', top:-30, left:-30,
    width:100, height:100, borderRadius:50,
    backgroundColor:'rgba(201,168,76,0.06)',
    borderWidth:1, borderColor:'rgba(201,168,76,0.15)',
  },
  heroCornerBR: {
    position:'absolute', bottom:-30, right:-30,
    width:120, height:120, borderRadius:60,
    backgroundColor:'rgba(74,32,128,0.4)',
    borderWidth:1, borderColor:'rgba(201,168,76,0.1)',
  },
  heroBadge: {
    backgroundColor:'rgba(201,168,76,0.12)', borderRadius:99,
    paddingHorizontal:14, paddingVertical:5,
    borderWidth:1, borderColor:'rgba(201,168,76,0.25)',
    marginBottom:20,
  },
  heroBadgeText: { color:GOLD_LIGHT, fontSize:10, fontWeight:'700', letterSpacing:0.5 },
  heroTitle: {
    color:GOLD, fontSize:48, fontWeight:'900', textAlign:'center',
    lineHeight:52, letterSpacing:1, marginBottom:16,
  },
  heroDivider:   { flexDirection:'row', alignItems:'center', gap:8, marginBottom:16, width:'60%' },
  heroDivLine:   { flex:1, height:1, backgroundColor:'rgba(201,168,76,0.4)' },
  heroDivDiamond:{ color:GOLD, fontSize:12 },
  heroTagline:   { color:'rgba(240,235,255,0.8)', fontSize:14, textAlign:'center', lineHeight:22 },

  // Offer section
  offerWrap: {
    flexDirection:'row', alignItems:'center', justifyContent:'center',
    marginHorizontal:16, marginBottom:0, gap:8,
  },
  offerCard: {
    flex:1, backgroundColor:BG_CARD, borderRadius:16, padding:16,
    alignItems:'center', borderWidth:1, borderColor:BORDER,
    elevation:3,
  },
  offerCardGold: {
    backgroundColor:PURPLE_DARK,
    borderColor:'rgba(201,168,76,0.4)',
  },
  offerEmoji:   { fontSize:28, marginBottom:6 },
  offerWhoLabel:{ color:TEXT_LIGHT, fontSize:10, fontWeight:'700', letterSpacing:1, marginBottom:4 },
  offerNumber:  { color:TEXT_DARK, fontSize:40, fontWeight:'900', lineHeight:44 },
  offerDesc:    { color:TEXT_MID, fontSize:11, fontWeight:'600', textAlign:'center', marginTop:4 },
  offerPlus:    {
    width:36, height:36, borderRadius:18,
    backgroundColor:PURPLE_MID, alignItems:'center', justifyContent:'center',
    borderWidth:1, borderColor:'rgba(201,168,76,0.3)',
  },
  offerPlusText:{ color:GOLD, fontSize:20, fontWeight:'900' },
  totalBar: {
    marginHorizontal:16, marginTop:8, marginBottom:16,
    backgroundColor:PURPLE_HERO, borderRadius:12, padding:12,
    borderWidth:1, borderColor:'rgba(201,168,76,0.25)',
    alignItems:'center',
  },
  totalBarLabel: { color:GOLD_LIGHT, fontSize:12, fontWeight:'700', textAlign:'center' },

  // Section header
  sectionHeader: { flexDirection:'row', alignItems:'center', marginHorizontal:16, marginTop:20, marginBottom:12, gap:8 },
  sectionLine:   { flex:1, height:1, backgroundColor:BORDER },
  sectionTitle:  { color:TEXT_DARK, fontSize:12, fontWeight:'800', letterSpacing:0.5 },

  // Features grid
  featuresGrid: { flexDirection:'row', flexWrap:'wrap', marginHorizontal:10, gap:8, marginBottom:8 },
  featureCard: {
    width:(W-40)/2, backgroundColor:BG_CARD, borderRadius:14,
    padding:14, borderWidth:1, borderColor:BORDER,
    alignItems:'center', elevation:2,
  },
  featureIcon:  { fontSize:28, marginBottom:8 },
  featureTitle: { color:TEXT_DARK, fontSize:12, fontWeight:'800', textAlign:'center', marginBottom:4 },
  featureDesc:  { color:TEXT_LIGHT, fontSize:11, textAlign:'center', lineHeight:16 },

  // Steps
  stepsWrap: { marginHorizontal:16, marginBottom:8 },
  stepRow:   { flexDirection:'row', alignItems:'flex-start', marginBottom:16 },
  stepNumWrap: {
    width:44, height:44, borderRadius:22, backgroundColor:PURPLE_DARK,
    alignItems:'center', justifyContent:'center',
    borderWidth:1.5, borderColor:GOLD, flexShrink:0,
  },
  stepNum:     { color:GOLD, fontSize:13, fontWeight:'900' },
  stepLine:    { display:'none' },
  stepContent: { flex:1, marginLeft:14, paddingTop:4 },
  stepTitle:   { color:TEXT_DARK, fontSize:14, fontWeight:'800', marginBottom:3 },
  stepDesc:    { color:TEXT_MID, fontSize:12, lineHeight:18 },

  // Terms
  termsHeader: {
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    marginHorizontal:16, marginTop:8, marginBottom:0,
    backgroundColor:BG_CARD, borderRadius:12, padding:14,
    borderWidth:1, borderColor:BORDER,
  },
  termsHeaderText: { color:TEXT_DARK, fontSize:13, fontWeight:'800' },
  termsBody: {
    marginHorizontal:16, backgroundColor:BG_CARD,
    borderRadius:12, padding:16, marginTop:4,
    borderWidth:1, borderColor:BORDER, marginBottom:8,
  },
  termRow:  { flexDirection:'row', gap:10, marginBottom:10 },
  termDot:  { color:GOLD, fontSize:10, marginTop:3, flexShrink:0 },
  termText: { color:TEXT_MID, fontSize:12, lineHeight:19, flex:1 },

  // CTA card
  ctaCard: {
    margin:16, backgroundColor:PURPLE_DARK, borderRadius:20,
    padding:24, alignItems:'center',
    borderWidth:1, borderColor:'rgba(201,168,76,0.35)',
    shadowColor:PURPLE_MID, shadowOpacity:0.4, shadowRadius:20, elevation:8,
