import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Linking, Alert, Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SRJUser, logoutUser } from '../lib/auth';

const GOLD='#C9A84C', GOLD_LIGHT='#F0D080', PURPLE_DARK='#2D1B5E', PURPLE_MID='#4A2080';
const BG='#F0EBFF', BG_CARD='#FFFFFF', BORDER='#DDD5F0';
const TEXT_DARK='#1A0A3E', TEXT_MID='#4A3570', TEXT_LIGHT='#8B7BAF', WHATSAPP='#25D366';

interface Props {
  user: SRJUser | null;
  onLoginPress: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onLoginPress, onLogout }: Props) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text:'Cancel', style:'cancel' },
      { text:'Sign Out', style:'destructive', onPress: async () => { await logoutUser(); onLogout(); } },
    ]);
  };

  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })
    : '';

  const MENU = [
    { icon:'heart-outline',          label:'My Wishlist',        sub:'Saved jewellery pieces',      action:()=>{} },
    { icon:'chatbubble-outline',     label:'Enquiry History',    sub:'Your past enquiries',         action:()=>{} },
    { icon:'calendar-outline',       label:'My Appointments',    sub:'Upcoming store visits',       action:()=>{} },
    { icon:'swap-horizontal-outline',label:'Exchange Policy',    sub:'Lifetime exchange guarantee', action:()=>{} },
    { icon:'location-outline',       label:'Store Locations',    sub:'Find us in Jabalpur',         action:()=>Linking.openURL('https://www.google.com/maps/place/Shekhar+Raja+Jewellers/@23.1785114,79.9295021,17z') },
    { icon:'call-outline',           label:'Call Showroom',      sub:'+91 83779 11745',             action:()=>Linking.openURL('tel:+918377911745') },
  ];

  return (
    <View style={[styles.root,{paddingTop:insets.top}]}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarWrap}>
            {user ? (
              <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            ) : (
              <Ionicons name="person" size={28} color={GOLD}/>
            )}
          </View>
          <View style={{marginLeft:12}}>
            <Text style={styles.headerName}>{user ? user.name : 'Guest'}</Text>
            <Text style={styles.headerEmail}>{user ? user.email : 'Not signed in'}</Text>
          </View>
        </View>
        {user && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="rgba(255,255,255,0.5)"/>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.goldLine}/>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:30}}>

        {/* NOT SIGNED IN — show sign in card */}
        {!user && (
          <View style={styles.signInCard}>
            <View style={styles.signInIconWrap}>
              <Ionicons name="person-outline" size={34} color={GOLD}/>
            </View>
            <Text style={styles.signInTitle}>Sign In for More</Text>
            <Text style={styles.signInDesc}>
              Save your wishlist, track enquiries, and get personalised jewellery recommendations.
            </Text>
            <TouchableOpacity style={styles.signInBtn} onPress={onLoginPress} activeOpacity={0.88}>
              <Ionicons name="log-in-outline" size={18} color={PURPLE_DARK} style={{marginRight:8}}/>
              <Text style={styles.signInBtnText}>Sign In / Create Account</Text>
            </TouchableOpacity>
            <Text style={styles.signInNote}>✓ Free forever · No spam · Optional</Text>
          </View>
        )}

        {/* SIGNED IN — show member badge */}
        {user && (
          <View style={styles.memberCard}>
            <View style={styles.memberBadge}>
              <Ionicons name="diamond" size={16} color={PURPLE_DARK}/>
              <Text style={styles.memberBadgeText}>Member</Text>
            </View>
            <Text style={styles.memberName}>{user.name}</Text>
            {user.phone ? <Text style={styles.memberDetail}>{user.phone}</Text> : null}
            <Text style={styles.memberJoined}>Joined {joinedDate}</Text>
          </View>
        )}

        {/* WhatsApp */}
        <TouchableOpacity style={styles.waCard} onPress={()=>Linking.openURL('https://wa.me/918377911745')} activeOpacity={0.88}>
          <View style={styles.waIconWrap}><Ionicons name="logo-whatsapp" size={24} color="#fff"/></View>
          <View style={{flex:1}}>
            <Text style={styles.waTitle}>Chat with Us on WhatsApp</Text>
            <Text style={styles.waSub}>+91 83779 11745 · Replies in minutes</Text>
          </View>
          <Ionicons name="arrow-forward" size={17} color="rgba(255,255,255,0.7)"/>
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU.map((item,i)=>(
            <TouchableOpacity key={i} style={[styles.menuItem,i<MENU.length-1&&styles.menuItemBorder]} onPress={item.action} activeOpacity={0.7}>
              <View style={styles.menuIconWrap}><Ionicons name={item.icon as any} size={19} color={PURPLE_MID}/></View>
              <View style={{flex:1}}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={15} color={TEXT_LIGHT}/>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications toggle */}
        {user && (
          <View style={styles.notifCard}>
            <View style={styles.menuIconWrap}><Ionicons name="notifications-outline" size={19} color={PURPLE_MID}/></View>
            <View style={{flex:1}}>
              <Text style={styles.menuLabel}>Notifications</Text>
              <Text style={styles.menuSub}>New arrivals & offers</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{false:BORDER,true:GOLD}} thumbColor={BG_CARD}/>
          </View>
        )}

        {/* Trust */}
        <View style={styles.trustRow}>
          {[{icon:'shield-checkmark',label:'BIS Certified'},{icon:'star',label:'Est. 1987'},{icon:'location',label:'Jabalpur'}].map((t,i)=>(
            <View key={i} style={styles.trustItem}>
              <Ionicons name={t.icon as any} size={19} color={GOLD}/>
              <Text style={styles.trustLabel}>{t.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Shekhar Raja Jewellers · Est. 1987 · Jabalpur, MP</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex:1, backgroundColor:PURPLE_DARK },
  scroll:  { flex:1, backgroundColor:BG },
  goldLine:{ height:3, backgroundColor:GOLD },
  header:  { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:PURPLE_DARK, paddingHorizontal:16, paddingVertical:16 },
  headerLeft:{ flexDirection:'row', alignItems:'center' },
  avatarWrap:{ width:56, height:56, borderRadius:28, backgroundColor:'rgba(201,168,76,0.15)', alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:'rgba(201,168,76,0.4)' },
  avatarText:{ color:GOLD, fontSize:22, fontWeight:'900' },
  headerName:{ color:'#fff', fontSize:18, fontWeight:'800' },
  headerEmail:{ color:GOLD_LIGHT, fontSize:11, marginTop:2, opacity:0.7 },
  logoutBtn: { width:38, height:38, borderRadius:19, backgroundColor:'rgba(255,255,255,0.08)', alignItems:'center', justifyContent:'center' },

  // Not signed in
  signInCard:{ margin:16, backgroundColor:BG_CARD, borderRadius:20, padding:22, alignItems:'center', borderWidth:1, borderColor:BORDER, shadowColor:'#000', shadowOpacity:0.06, shadowRadius:8, elevation:3 },
  signInIconWrap:{ width:72, height:72, borderRadius:36, backgroundColor:'#EDE8F5', alignItems:'center', justifyContent:'center', marginBottom:14 },
  signInTitle:{ color:TEXT_DARK, fontSize:19, fontWeight:'900', marginBottom:8 },
  signInDesc: { color:TEXT_MID, fontSize:13, textAlign:'center', lineHeight:20, marginBottom:18 },
  signInBtn:  { flexDirection:'row', alignItems:'center', backgroundColor:GOLD, borderRadius:28, paddingVertical:13, paddingHorizontal:22, marginBottom:10, elevation:3 },
  signInBtnText:{ color:PURPLE_DARK, fontSize:14, fontWeight:'900' },
  signInNote: { color:TEXT_LIGHT, fontSize:11 },

  // Member card
  memberCard:{ margin:16, backgroundColor:PURPLE_DARK, borderRadius:16, padding:16, borderWidth:1, borderColor:'rgba(201,168,76,0.3)' },
  memberBadge:{ flexDirection:'row', alignItems:'center', gap:5, backgroundColor:GOLD, borderRadius:99, paddingHorizontal:10, paddingVertical:4, alignSelf:'flex-start', marginBottom:10 },
  memberBadgeText:{ color:PURPLE_DARK, fontSize:11, fontWeight:'900' },
  memberName:{ color:'#fff', fontSize:18, fontWeight:'800' },
  memberDetail:{ color:GOLD_LIGHT, fontSize:12, marginTop:3 },
  memberJoined:{ color:'rgba(255,255,255,0.4)', fontSize:11, marginTop:4 },

  waCard:    { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:WHATSAPP, marginHorizontal:16, marginBottom:12, borderRadius:16, padding:15, elevation:3 },
  waIconWrap:{ width:44, height:44, borderRadius:22, backgroundColor:'rgba(255,255,255,0.2)', alignItems:'center', justifyContent:'center' },
  waTitle:   { color:'#fff', fontSize:14, fontWeight:'800' },
  waSub:     { color:'rgba(255,255,255,0.75)', fontSize:11, marginTop:1 },

  menuCard:  { marginHorizontal:16, backgroundColor:BG_CARD, borderRadius:16, borderWidth:1, borderColor:BORDER, overflow:'hidden', marginBottom:12 },
  menuItem:  { flexDirection:'row', alignItems:'center', padding:14, gap:12 },
  menuItemBorder:{ borderBottomWidth:1, borderBottomColor:BORDER },
  menuIconWrap:{ width:38, height:38, borderRadius:19, backgroundColor:'#EDE8F5', alignItems:'center', justifyContent:'center' },
  menuLabel: { color:TEXT_DARK, fontSize:13, fontWeight:'700' },
  menuSub:   { color:TEXT_LIGHT, fontSize:11, marginTop:1 },

  notifCard: { flexDirection:'row', alignItems:'center', marginHorizontal:16, backgroundColor:BG_CARD, borderRadius:14, padding:14, gap:12, borderWidth:1, borderColor:BORDER, marginBottom:12 },

  trustRow:  { flexDirection:'row', justifyContent:'space-around', marginHorizontal:16, backgroundColor:BG_CARD, borderRadius:14, borderWidth:1, borderColor:BORDER, paddingVertical:14, marginBottom:14 },
  trustItem: { alignItems:'center', gap:5 },
  trustLabel:{ color:TEXT_MID, fontSize:10, fontWeight:'600' },
  footer:    { color:TEXT_LIGHT, fontSize:11, textAlign:'center', marginBottom:8 },
});
