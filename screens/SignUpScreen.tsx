import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loginUser } from '../lib/auth';

const GOLD='#C9A84C', GOLD_LIGHT='#F0D080', PURPLE_DARK='#2D1B5E', PURPLE_MID='#4A2080';
const BG='#F0EBFF', BG_CARD='#FFFFFF', BORDER='#DDD5F0';
const TEXT_DARK='#1A0A3E', TEXT_MID='#4A3570', TEXT_LIGHT='#8B7BAF', RED='#dc2626', GREEN='#16a34a';

interface Props {
  onSignupSuccess: (user: any) => void;
  onSkip: () => void;
  onLoginPress: () => void;
}

const PasswordStrength = ({ password }: { password: string }) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const info = score<=1?{label:'Weak',color:'#ef4444'}:score<=3?{label:'Fair',color:'#f59e0b'}:{label:'Strong',color:'#22c55e'};
  return (
    <View style={pw.wrap}>
      <View style={pw.bars}>{[1,2,3,4,5].map(i=><View key={i} style={[pw.bar,{backgroundColor:i<=score?info.color:'#e5e7eb'}]}/>)}</View>
      <Text style={[pw.label,{color:info.color}]}>{info.label}</Text>
    </View>
  );
};
const pw = StyleSheet.create({
  wrap:{flexDirection:'row',alignItems:'center',gap:8,marginTop:-6,marginBottom:4},
  bars:{flexDirection:'row',gap:3,flex:1},bar:{flex:1,height:3,borderRadius:2},label:{fontSize:11,fontWeight:'700',width:44,textAlign:'right'},
});

export default function SignUpScreen({ onSignupSuccess, onSkip, onLoginPress }: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleSignup = async () => {
    setError('');
    if (!name.trim())  { setError('Please enter your name.'); return; }
    setLoading(true);
    const result = await loginUser(email, password, name);
    setLoading(false);
    if (result.success) {
      onSignupSuccess({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim() });
    } else {
      setError(result.error || 'Signup failed.');
    }
  };

  return (
    <View style={[styles.root,{paddingTop:insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
          <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.5)" />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}><Ionicons name="diamond" size={40} color={GOLD}/></View>
            <Text style={styles.brandName}>Shekhar Raja</Text>
            <Text style={styles.brandSub}>JEWELLERS</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Create Account</Text>
            <Text style={styles.cardSub}>Join our jewellery family — free forever</Text>

            {!!error && (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={15} color={RED} style={{marginRight:6}}/>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {[
              { label:'FULL NAME',       value:name,     set:setName,     type:'default',       icon:'person-outline',       cap:'words' as const,  secure:false },
              { label:'EMAIL ADDRESS',   value:email,    set:setEmail,    type:'email-address', icon:'mail-outline',         cap:'none' as const,   secure:false },
              { label:'PHONE (OPTIONAL)',value:phone,    set:setPhone,    type:'phone-pad',     icon:'call-outline',         cap:'none' as const,   secure:false },
            ].map(f=>(
              <View key={f.label}>
                <Text style={styles.inputLabel}>{f.label}</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name={f.icon as any} size={17} color={TEXT_LIGHT} style={{marginRight:10}}/>
                  <TextInput style={styles.input} placeholder={f.label.split(' ')[0]+'...'} placeholderTextColor={TEXT_LIGHT}
                    keyboardType={f.type as any} autoCapitalize={f.cap} autoCorrect={false}
                    value={f.value} onChangeText={v=>{f.set(v);setError('');}}/>
                </View>
              </View>
            ))}

            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={17} color={TEXT_LIGHT} style={{marginRight:10}}/>
              <TextInput style={styles.input} placeholder="Min 6 characters" placeholderTextColor={TEXT_LIGHT}
                secureTextEntry={!showPass} autoCapitalize="none"
                value={password} onChangeText={v=>{setPassword(v);setError('');}}/>
              <TouchableOpacity onPress={()=>setShowPass(s=>!s)}>
                <Ionicons name={showPass?'eye-off-outline':'eye-outline'} size={18} color={TEXT_LIGHT}/>
              </TouchableOpacity>
            </View>
            <PasswordStrength password={password}/>

            <TouchableOpacity style={[styles.signupBtn,loading&&{opacity:0.7}]} onPress={handleSignup} disabled={loading} activeOpacity={0.88}>
              {loading?<ActivityIndicator color={PURPLE_DARK} size="small"/>:(
                <><Ionicons name="person-add-outline" size={19} color={PURPLE_DARK} style={{marginRight:8}}/><Text style={styles.signupBtnText}>CREATE ACCOUNT</Text></>
              )}
            </TouchableOpacity>

            <View style={styles.divRow}><View style={styles.divLine}/><Text style={styles.divText}>OR</Text><View style={styles.divLine}/></View>

            <TouchableOpacity style={styles.guestBtn} onPress={onSkip} activeOpacity={0.85}>
              <Ionicons name="walk-outline" size={18} color={PURPLE_MID} style={{marginRight:8}}/>
              <Text style={styles.guestBtnText}>Continue as Guest</Text>
            </TouchableOpacity>

            <Text style={styles.footNote}>
              Already have an account?{' '}
              <Text style={styles.loginLink} onPress={onLoginPress}>Sign in</Text>
            </Text>
          </View>

          <View style={styles.benefitsCard}>
            <Text style={styles.benefitsTitle}>✦ Member Benefits</Text>
            {['Save wishlist across devices','Track enquiry history','Early access to new collections','Personalised recommendations'].map((b,i)=>(
              <View key={i} style={styles.benefitRow}>
                <Ionicons name="checkmark-circle" size={15} color={GOLD}/>
                <Text style={styles.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:PURPLE_DARK},
  header:{paddingHorizontal:16,paddingVertical:8,alignItems:'flex-end'},
  skipBtn:{flexDirection:'row',alignItems:'center',backgroundColor:'rgba(255,255,255,0.1)',borderRadius:99,paddingHorizontal:12,paddingVertical:6,gap:2},
  skipText:{color:'rgba(255,255,255,0.6)',fontSize:13,fontWeight:'600'},
  scroll:{flexGrow:1,paddingHorizontal:20,paddingBottom:30},
  logoWrap:{alignItems:'center',paddingVertical:18},
  logoCircle:{width:76,height:76,borderRadius:38,backgroundColor:'rgba(201,168,76,0.15)',alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:'rgba(201,168,76,0.35)',marginBottom:12},
  brandName:{color:GOLD,fontSize:24,fontWeight:'900',letterSpacing:0.5},
  brandSub:{color:GOLD_LIGHT,fontSize:10,letterSpacing:5,marginTop:2},
  card:{backgroundColor:BG_CARD,borderRadius:24,padding:22,shadowColor:'#000',shadowOpacity:0.12,shadowRadius:16,elevation:8,marginBottom:16},
  cardTitle:{color:TEXT_DARK,fontSize:22,fontWeight:'900',marginBottom:3},
  cardSub:{color:TEXT_LIGHT,fontSize:13,marginBottom:16},
  errorBanner:{flexDirection:'row',alignItems:'center',backgroundColor:'#fee2e2',borderRadius:10,padding:10,marginBottom:12,borderWidth:1,borderColor:'#fca5a5'},
  errorText:{color:RED,fontSize:12,flex:1},
  inputLabel:{color:PURPLE_MID,fontSize:10,fontWeight:'800',letterSpacing:1.5,marginBottom:5,marginTop:4},
  inputWrap:{flexDirection:'row',alignItems:'center',backgroundColor:BG,borderRadius:12,paddingHorizontal:13,paddingVertical:12,borderWidth:1.5,borderColor:BORDER,marginBottom:10},
  input:{flex:1,fontSize:14,color:TEXT_DARK},
  signupBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:GOLD,borderRadius:28,paddingVertical:14,marginTop:6,marginBottom:14,elevation:4},
  signupBtnText:{color:PURPLE_DARK,fontSize:15,fontWeight:'900',letterSpacing:1},
  divRow:{flexDirection:'row',alignItems:'center',marginBottom:14},
  divLine:{flex:1,height:1,backgroundColor:BORDER},divText:{color:TEXT_LIGHT,fontSize:12,marginHorizontal:10},
  guestBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:BG,borderRadius:28,paddingVertical:13,borderWidth:1.5,borderColor:BORDER,marginBottom:14},
  guestBtnText:{color:PURPLE_MID,fontSize:14,fontWeight:'700'},
  footNote:{color:TEXT_LIGHT,fontSize:12,textAlign:'center'},loginLink:{color:GOLD,fontWeight:'700'},
  benefitsCard:{backgroundColor:'rgba(255,255,255,0.08)',borderRadius:16,padding:16,borderWidth:1,borderColor:'rgba(201,168,76,0.2)'},
  benefitsTitle:{color:GOLD,fontSize:13,fontWeight:'800',marginBottom:12,letterSpacing:0.5},
  benefitRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},
  benefitText:{color:'rgba(255,255,255,0.6)',fontSize:12},
});
