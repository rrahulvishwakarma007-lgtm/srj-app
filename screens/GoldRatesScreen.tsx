import React, { useState, useEffect, useRef } from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
TextInput,
Animated,
Alert,
Platform,
KeyboardAvoidingView,
Dimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: W } = Dimensions.get('window');

const STORAGE_KEY = '@srj_gold_rate_24k';
const DATE_KEY = '@srj_gold_rate_date';
const SILVER_KEY = '@srj_silver_rate';

const ADMIN_SECRET = 5;
const ADMIN_PIN = '1234';

const RATES_URL =
'https://nxtgenailabs.work/gold-rates.json';

const GOLD = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.25)';
const PURPLE_DARK = '#2D1B5E';
const PURPLE_MID = '#4A2080';

const BG = '#F0EBFF';
const BG_CARD = '#FFFFFF';
const BORDER = '#DDD5F0';

const TEXT_DARK = '#1A0A3E';
const TEXT_MID = '#4A3570';
const TEXT_LIGHT = '#8B7BAF';

const GREEN = '#16a34a';
const RED = '#dc2626';

const KARATS = [
{
k: '24K',
purity: '999.9',
mul: 1,
featured: false,
color: '#b8892a',
},
{
k: '22K',
purity: '916',
mul: 22 / 24,
featured: true,
color: GOLD,
},
{
k: '20K',
purity: '833',
mul: 20 / 24,
featured: false,
color: '#a07820',
},
{
k: '18K',
purity: '750',
mul: 18 / 24,
featured: false,
color: '#8a6818',
},
];

function TickerItem({
label,
value,
}: {
label: string;
value: string;
}) {
return ( <View style={tickerStyles.item}> <Text style={tickerStyles.label}>{label}</Text> <Text style={tickerStyles.sep}>·</Text> <Text style={tickerStyles.value}>{value}</Text> </View>
);
}

const tickerStyles = StyleSheet.create({
item: {
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 20,
},

label: {
color: '#6a4a18',
fontSize: 10,
fontWeight: '700',
letterSpacing: 1.5,
},

sep: {
color: '#3a2200',
marginHorizontal: 6,
fontSize: 12,
},

value: {
color: '#e8c84a',
fontSize: 13,
fontWeight: '800',
letterSpacing: 0.5,
},
});

function RateCard({
k,
purity,
basePrice,
featured,
color,
}: {
k: string;
purity: string;
basePrice: number;
featured: boolean;
color: string;
}) {
return (
<View
style={[
styles.rateCard,
featured && styles.rateCardFeatured,
]}
>
{featured && ( <View style={styles.popularTag}> <Text style={styles.popularText}>
MOST POPULAR </Text> </View>
)}

```
  <View style={styles.rateCardLeft}>
    <View
      style={[
        styles.karatBadge,
        {
          borderColor: color + '60',
          backgroundColor: color + '15',
        },
      ]}
    >
      <Text style={[styles.karatNum, { color }]}>
        {k.replace('K', '')}
      </Text>

      <Text style={[styles.karatK, { color }]}>
        K
      </Text>
    </View>

    <View>
      <Text style={styles.rateCardTitle}>
        {k} Gold
      </Text>

      <Text style={styles.rateCardPurity}>
        {purity} Fineness
      </Text>
    </View>
  </View>

  <View style={styles.rateCardRight}>
    <Text style={styles.ratePerGram}>
      per 10 grams
    </Text>

    <Text
      style={[
        styles.ratePrice,
        { color },
      ]}
    >
      ₹{basePrice.toLocaleString('en-IN')}
    </Text>
  </View>
</View>
```

);
}

export default function GoldRatesScreen() {
const insets = useSafeAreaInsets();

const [rate24k, setRate24k] = useState(0);
const [silverRate, setSilverRate] = useState(0);
const [updatedDate, setUpdatedDate] = useState('');

const [tapCount, setTapCount] = useState(0);

const tickerX = useRef(
new Animated.Value(0)
).current;

const tapTimer = useRef<any>(null);

useEffect(() => {
const loadRates = async () => {
try {
const res = await fetch(RATES_URL, {
headers: {
'Cache-Control': 'no-cache',
},
});

```
    if (res.ok) {
      const data = await res.json();

      if (data.rate24k) {
        setRate24k(data.rate24k);

        setSilverRate(
          data.silverRate || 0
        );

        setUpdatedDate(
          data.updatedDate || ''
        );

        await AsyncStorage.setItem(
          STORAGE_KEY,
          String(data.rate24k)
        );

        await AsyncStorage.setItem(
          DATE_KEY,
          data.updatedDate || ''
        );

        await AsyncStorage.setItem(
          SILVER_KEY,
          String(data.silverRate || 0)
        );

        return;
      }
    }
  } catch (_) {}

  try {
    const s24k =
      await AsyncStorage.getItem(
        STORAGE_KEY
      );

    const sDate =
      await AsyncStorage.getItem(
        DATE_KEY
      );

    const sSilv =
      await AsyncStorage.getItem(
        SILVER_KEY
      );

    if (s24k) {
      setRate24k(parseInt(s24k));
    }

    if (sDate) {
      setUpdatedDate(sDate);
    }

    if (sSilv) {
      setSilverRate(parseInt(sSilv));
    }
  } catch (e) {
    console.warn(
      'GoldRates load error',
      e
    );
  }
};

loadRates();

const refresh = setInterval(
  loadRates,
  5 * 60 * 1000
);

return () => clearInterval(refresh);
```

}, []);

useEffect(() => {
if (rate24k === 0) return;

```
let pos = 0;
let raf: any;

const step = () => {
  pos += 0.6;

  if (pos > W * 4) {
    pos = 0;
  }

  tickerX.setValue(-pos);

  raf = requestAnimationFrame(step);
};

raf = requestAnimationFrame(step);

return () =>
  cancelAnimationFrame(raf);
```

}, [rate24k]);

const handleLogoTap = () => {
const next = tapCount + 1;

```
setTapCount(next);

clearTimeout(tapTimer.current);

if (next >= ADMIN_SECRET) {
  setTapCount(0);
} else {
  tapTimer.current = setTimeout(
    () => setTapCount(0),
    2000
  );
}
```

};

const rates = KARATS.map(k => ({
...k,
basePrice:
rate24k > 0
? Math.round(rate24k * k.mul)
: 0,
}));

const todayFormatted =
new Date().toLocaleDateString(
'en-IN',
{
weekday: 'long',
day: 'numeric',
month: 'long',
year: 'numeric',
}
);

return (
<View
style={[
styles.root,
{ paddingTop: insets.top },
]}
> <View style={styles.header}> <TouchableOpacity
       onPress={handleLogoTap}
       activeOpacity={0.8}
       style={styles.headerLeft}
     > <View style={styles.headerIconWrap}> <Ionicons
           name="trending-up"
           size={20}
           color={GOLD}
         /> </View>

```
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.headerTitle}>
          Gold Rates
        </Text>

        <Text style={styles.headerSub}>
          SHEKHAR RAJA JEWELLERS · PER
          10g
        </Text>
      </View>
    </TouchableOpacity>

    <View style={styles.liveDot}>
      <View style={styles.livePulse} />

      <Text style={styles.liveText}>
        LIVE
      </Text>
    </View>
  </View>

  {rate24k > 0 && (
    <View style={styles.tickerWrap}>
      <View style={styles.tickerBadge}>
        <Text
          style={styles.tickerBadgeText}
        >
          ◆ TODAY
        </Text>
      </View>

      <View style={styles.tickerViewport}>
        <Animated.View
          style={[
            styles.tickerTrack,
            {
              transform: [
                { translateX: tickerX },
              ],
            },
          ]}
        >
          {[...rates, ...rates].map(
            (r, i) => (
              <TickerItem
                key={i}
                label={r.k + ' GOLD'}
                value={`₹${r.basePrice.toLocaleString(
                  'en-IN'
                )}/10g`}
              />
            )
          )}
        </Animated.View>
      </View>
    </View>
  )}

  <ScrollView
    style={styles.scroll}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.dateRow}>
      <View style={styles.dateLeft}>
        <Ionicons
          name="calendar-outline"
          size={14}
          color={PURPLE_MID}
        />

        <Text style={styles.dateText}>
          {todayFormatted}
        </Text>
      </View>

      {updatedDate ? (
        <View style={styles.updatedBadge}>
          <Ionicons
            name="checkmark-circle"
            size={12}
            color={GREEN}
          />

          <Text style={styles.updatedText}>
            Updated {updatedDate}
          </Text>
        </View>
      ) : null}
    </View>

    <View style={styles.cardsWrap}>
      {rates.map(r => (
        <RateCard
          key={r.k}
          k={r.k}
          purity={r.purity}
          basePrice={r.basePrice}
          featured={r.featured}
          color={r.color}
        />
      ))}
    </View>
  </ScrollView>
</View>
```

);
}

const styles = StyleSheet.create({
root: {
flex: 1,
backgroundColor: BG,
},

scroll: {
flex: 1,
},

header: {
flexDirection: 'row',
alignItems: 'center',
justifyContent:
'space-between',
paddingHorizontal: 18,
paddingVertical: 12,
backgroundColor: PURPLE_DARK,
},

headerLeft: {
flexDirection: 'row',
alignItems: 'center',
},

headerIconWrap: {
position: 'relative',
},

headerTitle: {
fontSize: 17,
fontWeight: '800',
color: '#fff',
},

headerSub: {
fontSize: 9,
color: GOLD,
letterSpacing: 2,
fontWeight: '700',
},

liveDot: {
flexDirection: 'row',
alignItems: 'center',
gap: 5,
},

livePulse: {
width: 7,
height: 7,
borderRadius: 4,
backgroundColor: GREEN,
},

liveText: {
color: GREEN,
fontSize: 10,
fontWeight: '800',
},

tickerWrap: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#1A0A00',
height: 36,
overflow: 'hidden',
},

tickerBadge: {
backgroundColor: GOLD,
paddingHorizontal: 10,
height: '100%',
alignItems: 'center',
justifyContent: 'center',
},

tickerBadgeText: {
color: '#1A0A00',
fontSize: 9,
fontWeight: '900',
},

tickerViewport: {
flex: 1,
overflow: 'hidden',
},

tickerTrack: {
flexDirection: 'row',
alignItems: 'center',
height: 36,
},

dateRow: {
flexDirection: 'row',
alignItems: 'center',
justifyContent:
'space-between',
paddingHorizontal: 16,
paddingVertical: 10,
},

dateLeft: {
flexDirection: 'row',
alignItems: 'center',
gap: 5,
},

dateText: {
fontSize: 12,
color: TEXT_MID,
},

updatedBadge: {
flexDirection: 'row',
alignItems: 'center',
gap: 4,
backgroundColor: '#f0fdf4',
borderWidth: 1,
borderColor: '#bbf7d0',
borderRadius: 20,
paddingHorizontal: 8,
paddingVertical: 3,
},

updatedText: {
fontSize: 11,
color: GREEN,
},

cardsWrap: {
paddingHorizontal: 14,
gap: 10,
marginTop: 4,
},

rateCard: {
backgroundColor: BG_CARD,
borderRadius: 16,
borderWidth: 1,
borderColor: BORDER,
padding: 14,
flexDirection: 'row',
alignItems: 'center',
justifyContent:
'space-between',
marginBottom: 10,
},

rateCardFeatured: {
borderColor: GOLD + '80',
backgroundColor: '#FFFDF5',
},

popularTag: {
position: 'absolute',
top: -1,
right: 12,
backgroundColor: GOLD,
borderRadius: 4,
paddingHorizontal: 6,
paddingVertical: 2,
},

popularText: {
color: '#fff',
fontSize: 8,
fontWeight: '900',
},

rateCardLeft: {
flexDirection: 'row',
alignItems: 'center',
gap: 10,
},

rateCardRight: {
alignItems: 'flex-end',
},

karatBadge: {
width: 44,
height: 44,
borderRadius: 12,
borderWidth: 1.5,
alignItems: 'center',
justifyContent: 'center',
flexDirection: 'row',
},

karatNum: {
fontSize: 18,
fontWeight: '900',
},

karatK: {
fontSize: 10,
fontWeight: '700',
marginTop: 4,
},

rateCardTitle: {
fontSize: 15,
fontWeight: '700',
color: TEXT_DARK,
},

rateCardPurity: {
fontSize: 11,
color: TEXT_LIGHT,
},

ratePerGram: {
fontSize: 10,
color: TEXT_LIGHT,
},

ratePrice: {
fontSize: 22,
fontWeight: '900',
},
});
