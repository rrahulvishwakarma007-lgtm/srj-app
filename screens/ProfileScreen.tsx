import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const GOLD='#C9A84C',GOLD_LIGHT='#F0D080',PURPLE_DARK='#2D1B5E',PURPLE_MID='#4A2080',BG='#F0EBFF',BG_CARD='#FFFFFF',BORDER='#DDD5F0',TEXT_DARK='#1A0A3E',TEXT_MID='#4A3570',TEXT_LIGHT='#8B7BAF',WHATSAPP='#25D366';

const MENU_ITEMS = [
  { icon:'heart-outline',       label:'My Wishlist',         sub:'Saved jewellery pieces' },
  { icon:'chatbubble-outline',  label:'Enquiry History',     sub:'Your past enquiries' },
  { icon:'calendar-outline',    label:'My Appointments',     sub:'Upcoming store visits' },
  { icon:'swap-horizontal',     label:'Exchange Policy',     sub:'Lifetime exchange' },
  { icon:'shield-checkmark-outline', label:'BIS Hallmarked', sub:'All jewellery certified' },
  { icon:'location-outline',    label:'Store Locations',     sub:'Find us in Jabalpur' },
  { icon:'call-outline',        label:'Contact Us',          sub:'+91 83779 11745' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.root,{paddingTop:insets.top}]}>
      <View style={styles.header}>
        <View style={styles.avatarWrap}><Ionicons name="person" size={32} color={GOLD}/></View>
        <View style={{marginLeft:14}}>
          <Text style={styles.headerName}>Welcome!</Text>
          <Text style={styles.headerSub}>Shekhar Raja Jewellers</Text>
        </View>
      </View>
      <View style={styles.goldLine}/>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:30}}>
        <TouchableOpacity style={styles.waCard} onPress={()=>Linking.openURL('https://wa.me/918377911745')} activeOpacity={0.88}>
          <View style={styles.waIconWrap}><Ionicons name="logo-whatsapp" size={26} color="#fff"/></View>
          <View style={{flex:1}}>
            <Text style={styles.waTitle}>Chat with Us on WhatsApp</Text>
            <Text style={styles.waSub}>+91 83779 11745 · Usually replies in minutes</Text>
          </View>
          <Ionicons name="arrow-forward" size={18} color="rgba(255,255,255,0.7)"/>
        </TouchableOpacity>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item,i)=>(
            <TouchableOpacity key={i} style={[styles.menuItem, i<MENU_ITEMS.length-1&&styles.menuItemBorder]}
              onPress={()=>item.label==='Contact Us'?Linking.openURL('tel:+918377911745'):null} activeOpacity={0.7}>
              <View style={styles.menuIconWrap}><Ionicons name={item.icon as any} size={20} color={PURPLE_MID}/></View>
              <View style={{flex:1}}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={TEXT_LIGHT}/>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.trustRow}>
          {[{icon:'shield-checkmark',label:'BIS Certified'},{icon:'star',label:'Est. 1987'},{icon:'location',label:'Jabalpur'}].map((t,i)=>(
            <View key={i} style={styles.trustItem}><Ionicons name={t.icon as any} size={20} color={GOLD}/><Text style={styles.trustLabel}>{t.label}</Text></View>
          ))}
        </View>
        <Text style={styles.footer}>Shekhar Raja Jewellers · Est. 1987 · Jabalpur, MP</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:PURPLE_DARK},scroll:{flex:1,backgroundColor:BG},goldLine:{height:3,backgroundColor:GOLD},
  header:{flexDirection:'row',alignItems:'center',backgroundColor:PURPLE_DARK,paddingHorizontal:16,paddingVertical:16},
  avatarWrap:{width:60,height:60,borderRadius:30,backgroundColor:'rgba(201,168,76,0.15)',alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:'rgba(201,168,76,0.4)'},
  headerName:{color:'#fff',fontSize:20,fontWeight:'900'},headerSub:{color:GOLD_LIGHT,fontSize:11,marginTop:2,letterSpacing:1},
  waCard:{flexDirection:'row',alignItems:'center',gap:14,backgroundColor:WHATSAPP,margin:16,borderRadius:16,padding:16,elevation:4},
  waIconWrap:{width:48,height:48,borderRadius:24,backgroundColor:'rgba(255,255,255,0.2)',alignItems:'center',justifyContent:'center'},
  waTitle:{color:'#fff',fontSize:15,fontWeight:'800'},waSub:{color:'rgba(255,255,255,0.8)',fontSize:11,marginTop:2},
  menuCard:{marginHorizontal:16,backgroundColor:BG_CARD,borderRadius:16,borderWidth:1,borderColor:BORDER,overflow:'hidden'},
  menuItem:{flexDirection:'row',alignItems:'center',padding:16,gap:12},menuItemBorder:{borderBottomWidth:1,borderBottomColor:BORDER},
  menuIconWrap:{width:40,height:40,borderRadius:20,backgroundColor:'#EDE8F5',alignItems:'center',justifyContent:'center'},
  menuLabel:{color:TEXT_DARK,fontSize:14,fontWeight:'700'},menuSub:{color:TEXT_LIGHT,fontSize:11,marginTop:1},
  trustRow:{flexDirection:'row',justifyContent:'space-around',marginHorizontal:16,marginTop:16,backgroundColor:BG_CARD,borderRadius:14,borderWidth:1,borderColor:BORDER,paddingVertical:14},
  trustItem:{alignItems:'center',gap:5},trustLabel:{color:TEXT_MID,fontSize:10,fontWeight:'600'},
  footer:{color:TEXT_LIGHT,fontSize:11,textAlign:'center',marginTop:16,marginBottom:8},
});
