import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
  Dimensions, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../lib/auth';

const { width: W } = Dimensions.get('window');
const GOLD='#C9A84C', GOLD_LIGHT='#F0D080', PURPLE_DARK='#2D1B5E', PURPLE_MID='#4A2080';
const BG='#F0EBFF', BG_CARD='#FFFFFF', BORDER='#DDD5F0';
const TEXT_DARK='#1A0A3E', TEXT_MID='#4A3570', TEXT_LIGHT='#8B7BAF', RED='#dc2626', GREEN='#16a34a';

interface Props {
  onLoginSuccess: (user: any) => void;
  onSkip: () => void;
  onSignupPress: () => void;
}

export default function LoginScreen({ onLoginSuccess, onSkip, onSignupPress }: Props) {
  const insets = useSafeAreaInsets();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:10,  duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue:-10, duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue:6,   duration:60, useNativeDriver:true }),
      Animated.timing(shakeAnim, { toValue:0,   duration:60, useNativeDriver:true }),
    ]).start();
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await loginUser(email, password);
    setLoading(false);
    if (result.success) {
      const user = { name: email.split('@')[0], email: email.trim().toLowerCase() };
      onLoginSuccess(user);
    } else {
      setError(result.error || 'Login failed.');
      shake();
    }
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Ionicons name="diamond" size={40} color={GOLD} />
            </View>
            <Text style={styles.brandName}>Shekhar Raja</Text>
            <Text style={styles.brandSub}>JEWELLERS</Text>
            <Text style={styles.brandEst}>Est. 1987 · Jabalpur</Text>
          </View>

          {/* Card */}
          <Animated.View style={[styles.card, { transform:[{translateX:shakeAnim}] }]}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSub}>Sign in to your account</Text>

            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={15} color={RED} style={{marginRight:6}} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email */}
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={[styles.inputWrap, email.includes('@') && styles.inputValid]}>
              <Ionicons name="mail-outline" size={17} color={TEXT_LIGHT} style={{marginRight:10}} />
              <TextInput style={styles.input} placeholder="your@email.com" placeholderTextColor={TEXT_LIGHT}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                value={email} onChangeText={v=>{setEmail(v);setError('');}} />
              {email.includes('@') && <Ionicons name="checkmark-circle" size={16} color={GREEN} />}
            </View>

            {/* Password */}
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={17} color={TEXT_LIGHT} style={{marginRight:10}} />
              <TextInput style={styles.input} placeholder="Enter password" placeholderTextColor={TEXT_LIGHT}
                secureTextEntry={!showPass} autoCapitalize="none"
                value={password} onChangeText={v=>{setPassword(v);setError('');}} />
              <TouchableOpacity onPress={()=>setShowPass(s=>!s)}>
                <Ionicons name={showPass?'eye-off-outline':'eye-outline'} size={18} color={TEXT_LIGHT} />
              </TouchableOpacity>
            </View>

            {/* Login btn */}
            <TouchableOpacity style={[styles.loginBtn, loading&&{opacity:0.7}]} onPress={handleLogin} disabled={loading} activeOpacity={0.88}>
              {loading ? <ActivityIndicator color={PURPLE_DARK} size="small" /> : (
                <><Ionicons name="log-in-outline" size={19} color={PURPLE_DARK} style={{marginRight:8}} /><Text style={styles.loginBtnText}>SIGN IN</Text></>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divRow}>
              <View style={styles.divLine}/><Text style={styles.divText}>OR</Text><View style={styles.divLine}/>
            </View>

            {/* Skip / Guest */}
            <TouchableOpacity style={styles.guestBtn} onPress={onSkip} activeOpacity={0.85}>
              <Ionicons name="walk-outline" size={18} color={PURPLE_MID} style={{marginRight:8}} />
              <Text style={styles.guestBtnText}>Continue as Guest</Text>
            </TouchableOpacity>

            <Text style={styles.footNote}>
              Don't have an account?{' '}
              <Text style={styles.signupLink} onPress={onSignupPress}>Create one free</Text>
            </Text>
          </Animated.View>

          {/* Trust strip */}
          <View style={styles.trustStrip}>
            {[{icon:'shield-checkmark',label:'Secure'},{icon:'star',label:'Est. 1987'},{icon:'diamond',label:'BIS Certified'}].map((t,i)=>(
              <View key={i} style={styles.trustItem}>
                <Ionicons name={t.icon as any} size={15} color={GOLD} />
                <Text style={styles.trustLabel}>{t.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex:1, backgroundColor:PURPLE_DARK },
  header:  { paddingHorizontal:16, paddingVertical:8, alignItems:'flex-end' },
  skipBtn: { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.1)', borderRadius:99, paddingHorizontal:12, paddingVertical:6, gap:2 },
  skipText:{ color:'rgba(255,255,255,0.6)', fontSize:13, fontWeight:'600' },
  scroll:  { flexGrow:1, paddingHorizontal:20, paddingBottom:30 },
  logoWrap:{ alignItems:'center', paddingVertical:24 },
  logoCircle:{ width:86, height:86, borderRadius:43, backgroundColor:'rgba(201,168,76,0.15)', alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:'rgba(201,168,76,0.35)', marginBottom:14 },
  brandName:{ color:GOLD, fontSize:26, fontWeight:'900', letterSpacing:0.5 },
  brandSub: { color:GOLD_LIGHT, fontSize:10, letterSpacing:5, marginTop:2 },
  brandEst: { color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:6 },
  card:     { backgroundColor:BG_CARD, borderRadius:24, padding:22, shadowColor:'#000', shadowOpacity:0.12, shadowRadius:16, elevation:8 },
  cardTitle:{ color:TEXT_DARK, fontSize:22, fontWeight:'900', marginBottom:3 },
  cardSub:  { color:TEXT_LIGHT, fontSize:13, marginBottom:18 },
  errorBanner:{ flexDirection:'row', alignItems:'center', backgroundColor:'#fee2e2', borderRadius:10, padding:11, marginBottom:14, borderWidth:1, borderColor:'#fca5a5' },
  errorText:{ color:RED, fontSize:12, flex:1 },
  inputLabel:{ color:PURPLE_MID, fontSize:10, fontWeight:'800', letterSpacing:1.5, marginBottom:5, marginTop:4 },
  inputWrap:{ flexDirection:'row', alignItems:'center', backgroundColor:BG, borderRadius:12, paddingHorizontal:13, paddingVertical:12, borderWidth:1.5, borderColor:BORDER, marginBottom:12 },
  inputValid:{ borderColor:GREEN },
  input:    { flex:1, fontSize:14, color:TEXT_DARK },
  loginBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:GOLD, borderRadius:28, paddingVertical:14, marginTop:4, marginBottom:14, shadowColor:GOLD, shadowOpacity:0.35, shadowRadius:8, elevation:4 },
  loginBtnText:{ color:PURPLE_DARK, fontSize:15, fontWeight:'900', letterSpacing:1 },
  divRow:   { flexDirection:'row', alignItems:'center', marginBottom:14 },
  divLine:  { flex:1, height:1, backgroundColor:BORDER },
  divText:  { color:TEXT_LIGHT, fontSize:12, marginHorizontal:10 },
  guestBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:BG, borderRadius:28, paddingVertical:13, borderWidth:1.5, borderColor:BORDER, marginBottom:14 },
  guestBtnText:{ color:PURPLE_MID, fontSize:14, fontWeight:'700' },
  footNote: { color:TEXT_LIGHT, fontSize:12, textAlign:'center' },
  signupLink:{ color:GOLD, fontWeight:'700' },
  trustStrip:{ flexDirection:'row', justifyContent:'space-around', marginTop:22, backgroundColor:'rgba(255,255,255,0.08)', borderRadius:14, paddingVertical:13, borderWidth:1, borderColor:'rgba(201,168,76,0.15)' },
  trustItem: { alignItems:'center', gap:4 },
  trustLabel:{ color:'rgba(255,255,255,0.45)', fontSize:10, fontWeight:'600' },
});
