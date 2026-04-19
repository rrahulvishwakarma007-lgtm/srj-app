import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Radius } from '../lib/theme';
import { products } from '../lib/data';
import { Product } from '../lib/types';

const WHATSAPP = '918377911745';
const WA_URL = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

interface Msg { id: number; from: 'user' | 'ai'; text: string; suggestions?: Suggestion[]; }
interface Suggestion extends Product { why: string; match: number; }

const PROMPTS = [
  { label: 'Wedding necklace under ₹2L', icon: 'heart-outline' },
  { label: 'Engagement ring under ₹1L',  icon: 'diamond-outline' },
  { label: 'Daily wear earrings',         icon: 'sunny-outline' },
  { label: 'Festive gold bangles',        icon: 'gift-outline' },
  { label: 'Bridal jewellery set',        icon: 'sparkles-outline' },
];

function parseBudget(q: string): number | null {
  const m = q.match(/(\d+)\s*(k|lakh|l|crore)?/i);
  if (!m) return null;
  let n = parseInt(m[1], 10);
  const unit = (m[2] || '').toLowerCase();
  if (unit === 'k') n *= 1000;
  if (unit === 'lakh' || unit === 'l') n *= 100000;
  if (unit === 'crore') n *= 10000000;
  return n;
}

function aiReply(input: string): { text: string; suggestions: Suggestion[] } {
  const q = input.toLowerCase();
  const budget = parseBudget(q);

  const scored: Suggestion[] = products.map(p => {
    let score = 0;
    let why = '';

    if ((q.includes('wedding') || q.includes('marriage') || q.includes('bridal')) && (p.category === 'Necklaces' || p.category === 'Bracelets')) { score += 40; why = 'A timeless heirloom for your most cherished day.'; }
    if ((q.includes('engagement') || q.includes('ring')) && p.category === 'Rings') { score += 45; why = 'Signature ring in certified 22K gold — a promise forever.'; }
    if ((q.includes('earring') || q.includes('daily') || q.includes('everyday')) && p.category === 'Earrings') { score += 42; why = 'Lightweight comfort for everyday elegance.'; }
    if ((q.includes('bangle') || q.includes('bracelet') || q.includes('festive') || q.includes('kada')) && p.category === 'Bracelets') { score += 40; why = 'Rich 22K gold — perfect for festive occasions.'; }
    if ((q.includes('necklace') || q.includes('haar') || q.includes('chain')) && p.category === 'Necklaces') { score += 38; why = 'Elegant heritage necklace in 22K gold.'; }
    if ((q.includes('pendant') || q.includes('locket')) && p.category === 'Pendants') { score += 38; why = 'Beautifully crafted pendant in 22K gold.'; }

    if (budget) {
      if (p.price <= budget) { score += 35; if (!why) why = `Perfectly within your budget of ₹${budget.toLocaleString('en-IN')}.`; }
      else score -= 20;
    }

    if (!why) why = 'Exquisite craftsmanship in 22K BIS-hallmarked gold.';
    if (p.weight > 20) score += 5;

    return { ...p, why, match: Math.max(55, Math.min(98, score + 50)) };
  });

  let top = scored.sort((a, b) => b.match - a.match).slice(0, 3);

  const reply = budget
    ? `Here are our finest pieces within ₹${budget.toLocaleString('en-IN')} — handpicked for artistry and value:`
    : q.includes('wedding') || q.includes('bridal') ? 'For your most cherished day, these heirloom designs embody grace and permanence:'
    : q.includes('engagement') ? 'Rings of promise — each crafted to celebrate a lifetime together:'
    : q.includes('daily') ? 'Effortless everyday pieces — lightweight, elegant, and BIS hallmarked:'
    : 'Here are our most admired pieces — chosen for design, purity, and timeless appeal:';

  if (top.length === 0) top = scored.slice(0, 3);
  return { text: reply, suggestions: top };
}

// ── Suggestion Card ───────────────────────────────────────────────────────
function SuggestionCard({ s }: { s: Suggestion }) {
  const enquire = () => {
    const msg = `Hello Shekhar Raja Jewellers,\n\nYour AI Advisor recommended:\n*${s.name}*\n${s.description}\n\nPlease share availability and pricing.`;
    Linking.openURL(WA_URL(msg)).catch(() => Alert.alert('WhatsApp', `+${WHATSAPP}`));
  };

  return (
    <View style={styles.suggestCard}>
      {/* Image / Icon */}
      <View style={styles.suggestImgWrap}>
        {s.image
          ? <Image source={{ uri: s.image }} style={styles.suggestImg} resizeMode="cover" />
          : (
            <View style={styles.suggestIconBox}>
              <Ionicons name={s.icon as any} size={30} color={Theme.gold} />
            </View>
          )
        }
        {/* Match badge */}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{s.match}%</Text>
        </View>
      </View>

      <View style={styles.suggestBody}>
        <Text style={styles.suggestName} numberOfLines={2}>{s.name}</Text>
        <Text style={styles.suggestMeta}>{s.weight}g · {s.purity}</Text>
        <Text style={styles.why} numberOfLines={2}>{s.why}</Text>
      </View>

      <TouchableOpacity style={styles.suggestWaBtn} onPress={enquire}>
        <Ionicons name="logo-whatsapp" size={13} color="#FFFFFF" />
        <Text style={styles.suggestWaTxt}>Enquire</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────
function MessageBubble({ item }: { item: Msg }) {
  const isUser = item.from === 'user';
  return (
    <View style={[styles.bubbleWrap, isUser && { alignItems: 'flex-end' }]}>
      {/* Avatar for AI */}
      {!isUser && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={14} color={Theme.gold} />
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
          {item.text}
        </Text>
        {!!item.suggestions?.length && (
          <View style={styles.suggestRow}>
            {item.suggestions.map(s => <SuggestionCard key={s.id} s={s} />)}
          </View>
        )}
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────
export default function AIAdvisorScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1, from: 'ai',
      text: 'Namaste! 🙏 I am your personal Shekhar Raja Jewellery Advisor.\n\nTell me the occasion, budget, or style — I will curate the perfect pieces from our 22K collection for you.',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    const userMsg: Msg = { id: Date.now(), from: 'user', text: q };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const { text: replyText, suggestions } = aiReply(q);
      setMessages(m => [...m, { id: Date.now() + 1, from: 'ai', text: replyText, suggestions }]);
      setTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Ionicons name="sparkles" size={20} color={Theme.gold} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Jewellery Advisor</Text>
              <View style={styles.onlineRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.headerSub}>Shekhar Raja · Personal Curator</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.waHeaderBtn}
            onPress={() => Linking.openURL(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello! I need jewellery advice.')}`)}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          </TouchableOpacity>
        </View>

        {/* Gold line */}
        <View style={styles.goldLine} />

        {/* ── Quick Prompts ── */}
        <View style={styles.promptWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promptRow}>
            {PROMPTS.map((p, i) => (
              <TouchableOpacity key={i} style={styles.promptChip} onPress={() => send(p.label)} activeOpacity={0.85}>
                <Ionicons name={p.icon as any} size={13} color={Theme.purple} />
                <Text style={styles.promptText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Messages ── */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => String(m.id)}
          renderItem={({ item }) => <MessageBubble item={item} />}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
          showsVerticalScrollIndicator={false}
        />

        {/* Typing indicator */}
        {typing && (
          <View style={styles.typingWrap}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={14} color={Theme.gold} />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>Curating from our collection…</Text>
            </View>
          </View>
        )}

        {/* ── Input Row ── */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask: wedding necklace under ₹2 lakh…"
            placeholderTextColor={Theme.textMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send()}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => send()}
            activeOpacity={0.85}
            disabled={!input.trim()}
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.bgPrimary },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
    backgroundColor: Theme.bgPurple,
  },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(201,168,76,0.2)',
    borderWidth: 1.5, borderColor: 'rgba(201,168,76,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle:  { color: '#FFFFFF', fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
  onlineRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  onlineDot:    { width: 7, height: 7, borderRadius: 4, backgroundColor: '#25D366' },
  headerSub:    { color: Theme.textLightMuted, fontSize: 11, fontWeight: '600' },
  waHeaderBtn:  {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  goldLine: { height: 3, backgroundColor: Theme.gold },

  // Prompts
  promptWrap:   { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: Theme.border },
  promptRow:    { paddingHorizontal: 14, paddingVertical: 10, gap: 8 },
  promptChip:   {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Theme.bgCardPurple,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1, borderColor: Theme.purpleBorder,
  },
  promptText:   { color: Theme.purple, fontSize: 12, fontWeight: '700' },

  // List
  list: { padding: 16, paddingBottom: 100 },

  // Bubbles
  bubbleWrap:   { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 14 },
  aiAvatar:     {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Theme.bgPurple,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  bubble:       { maxWidth: '85%', borderRadius: 18, padding: 14 },
  userBubble:   { backgroundColor: Theme.bgPurple, borderBottomRightRadius: 4 },
  aiBubble:     {
    backgroundColor: '#FFFFFF', borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: Theme.border,
  },
  bubbleText:   { fontSize: 14, lineHeight: 21 },
  userText:     { color: '#FFFFFF', fontWeight: '500' },
  aiText:       { color: Theme.textDark },

  // Suggestion cards
  suggestRow:   { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 10 },
  suggestCard:  {
    width: 148, backgroundColor: Theme.bgPrimary,
    borderRadius: Radius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: Theme.border,
  },
  suggestImgWrap: { width: '100%', height: 120, backgroundColor: Theme.bgCardPurple },
  suggestImg:     { width: '100%', height: '100%' },
  suggestIconBox: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  matchBadge:   {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Theme.bgPurple,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: Radius.full,
  },
  matchText:    { color: Theme.gold, fontSize: 10, fontWeight: '900' },
  suggestBody:  { padding: 10 },
  suggestName:  { color: Theme.textDark, fontSize: 12, fontWeight: '800', lineHeight: 16 },
  suggestMeta:  { color: Theme.gold, fontSize: 10, fontWeight: '700', marginTop: 3 },
  why:          { color: Theme.textMuted, fontSize: 10, lineHeight: 14, marginTop: 5 },
  suggestWaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    backgroundColor: '#25D366', paddingVertical: 9, margin: 8, borderRadius: Radius.md,
  },
  suggestWaTxt: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },

  // Typing
  typingWrap:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  typingBubble: {
    backgroundColor: '#FFFFFF', borderRadius: Radius.lg, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Theme.border,
  },
  typingText:   { color: Theme.textMuted, fontSize: 13, fontWeight: '600', fontStyle: 'italic' },

  // Input
  inputRow: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12, paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: Theme.border,
  },
  input: {
    flex: 1, backgroundColor: Theme.bgPrimary,
    borderRadius: Radius.lg, paddingHorizontal: 16, paddingVertical: 12,
    color: Theme.textDark, fontSize: 14,
    borderWidth: 1, borderColor: Theme.border,
    maxHeight: 100,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Theme.bgPurple,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Theme.border },
});
    // Category / occasion match
    if ((q.includes('wedding') || q.includes('marriage')) && (p.category === 'Necklaces' || p.category === 'Bracelets')) { score += 40; why = 'Timeless heirloom for your wedding day.'; }
    if ((q.includes('engagement') || q.includes('ring')) && p.category === 'Rings') { score += 45; why = 'Signature engagement ring in certified 22K gold.'; }
    if ((q.includes('earring') || q.includes('daily')) && p.category === 'Earrings') { score += 42; why = 'Lightweight comfort for everyday elegance.'; }
    if ((q.includes('bangle') || q.includes('festive')) && p.category === 'Bracelets') { score += 40; why = 'Rich 22K gold — perfect for festive occasions.'; }
    if (q.includes('necklace') && p.category === 'Necklaces') { score += 38; why = 'Elegant 22K heritage necklace design.'; }

    // Budget match
    if (budget) {
      if (p.price <= budget) { score += 35; if (!why) why = `Within your budget of ₹${budget.toLocaleString('en-IN')}.`; }
      else score -= 20;
    }

    // General fallback
    if (!why) why = 'Exquisite craftsmanship in 22K BIS-hallmarked gold.';

    // Slight weight bonus for heavier/luxury feel
    if (p.weight > 20) score += 5;

    return { ...p, why, match: Math.max(55, Math.min(98, score + 50)) };
  });

  // Sort by match score desc, take top 3
  let top = scored.sort((a, b) => b.match - a.match).slice(0, 3);

  // Build a professional reply
  let reply = budget
    ? `Curated selections within ₹${budget.toLocaleString('en-IN')} — each piece handpicked for its artistry and value:`
    : q.includes('wedding') ? 'For your most cherished day, these heirloom designs embody grace and permanence:'
    : q.includes('engagement') ? 'Rings of promise — each crafted to celebrate a lifetime together:'
    : 'Here are our most admired pieces — chosen for their design, purity, and timeless appeal:';

  if (top.length === 0) top = scored.slice(0, 3);
  return { text: reply, suggestions: top };
}

function SuggestionCard({ s }: { s: Suggestion }) {
  return (
    <View style={styles.suggestCard}>
      <View style={[styles.iconBox, { backgroundColor: s.color + '18' }]}>
        <Ionicons name={s.icon as any} size={26} color={s.color} />
      </View>
      <Text style={styles.suggestName} numberOfLines={2}>{s.name}</Text>
      <Text style={styles.suggestMeta}>{s.weight}g • {s.purity}</Text>
      <Text style={styles.suggestPrice}>₹{s.price.toLocaleString('en-IN')}</Text>
      <View style={styles.matchBadge}><Text style={styles.matchText}>{s.match}% match</Text></View>
      <Text style={styles.why}>{s.why}</Text>
    </View>
  );
}

export default function AIAdvisorScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 1, from: 'ai', text: 'Namaste. I am your personal Shekhar Raja Jewellery Advisor — trained on our finest 22K collections. Tell me the occasion, budget, or style you love.' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;

    const userMsg: Msg = { id: Date.now(), from: 'user', text: q };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const { text: replyText, suggestions } = aiReply(q);
      const aiMsg: Msg = { id: Date.now() + 1, from: 'ai', text: replyText, suggestions };
      setMessages(m => [...m, aiMsg]);
      setTyping(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }, 520);
  };

  const renderMsg = ({ item }: { item: Msg }) => (
    <View style={[styles.bubble, item.from === 'user' ? styles.user : styles.ai]}>
      <Text style={[styles.bubbleText, item.from === 'user' ? styles.userText : styles.aiText]}>{item.text}</Text>
      {!!item.suggestions?.length && (
        <View style={styles.suggestWrap}>
          {item.suggestions.map(s => <SuggestionCard key={s.id} s={s} />)}
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Professional Luxury Header */}
      <View style={styles.header}>
        <View style={styles.headerIcon}><Ionicons name="sparkles" size={22} color="#F8F3ED" /></View>
        <View>
          <Text style={styles.headerTitle}>Jewellery Advisor</Text>
          <Text style={styles.headerSub}>Shekhar Raja • Personal Curator</Text>
        </View>
      </View>

      {/* Intelligent Quick Prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptBar} contentContainerStyle={{ paddingHorizontal: 14 }}>
        {PROMPTS.map((p, i) => (
          <TouchableOpacity key={i} style={styles.promptChip} onPress={() => send(p)} activeOpacity={0.88}>
            <Text style={styles.promptText}>{p}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conversation */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={m => String(m.id)}
        renderItem={renderMsg}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      {typing && <Text style={styles.typing}>Analyzing your request with our collection…</Text>}

      {/* Elegant Composer */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask: wedding necklace under ₹80k…"
          placeholderTextColor="#7A5C5C"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => send()}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => send()} activeOpacity={0.88}>
          <Ionicons name="arrow-forward" size={20} color="#F8F3ED" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F3ED' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 54, paddingHorizontal: 18, paddingBottom: 14, backgroundColor: '#FFF8F0', borderBottomWidth: 1, borderBottomColor: '#D9C9B8' },
  headerIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#8C5C2D', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#1F1414', fontSize: 20, fontWeight: '900', letterSpacing: 0.5 },
  headerSub: { color: '#7A4B6A', fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginTop: 1 },
  promptBar: { backgroundColor: '#FFF8F0', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#D9C9B8' },
  promptChip: { backgroundColor: '#F8F3ED', borderWidth: 1, borderColor: '#8C5C2D', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, marginRight: 8 },
  promptText: { color: '#8C5C2D', fontSize: 12, fontWeight: '800', letterSpacing: 0.4 },
  bubble: { maxWidth: '86%', padding: 16, borderRadius: 18, marginBottom: 14 },
  user: { alignSelf: 'flex-end', backgroundColor: '#8C5C2D' },
  ai: { alignSelf: 'flex-start', backgroundColor: '#FFF8F0', borderWidth: 1, borderColor: '#D9C9B8' },
  bubbleText: { fontSize: 15, lineHeight: 22, letterSpacing: 0.1 },
  userText: { color: '#F8F3ED', fontWeight: '600' },
  aiText: { color: '#1F1414' },
  suggestWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, gap: 10 },
  suggestCard: { backgroundColor: '#F8F3ED', borderRadius: 16, padding: 12, width: 138, borderWidth: 1, borderColor: '#D9C9B8' },
  iconBox: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  suggestName: { color: '#1F1414', fontSize: 12, fontWeight: '900', lineHeight: 15 },
  suggestMeta: { color: '#8C5C2D', fontSize: 11, fontWeight: '700', marginTop: 2 },
  suggestPrice: { color: '#8C5C2D', fontSize: 15, fontWeight: '900', marginTop: 6 },
  matchBadge: { backgroundColor: '#7A4B6A', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 8 },
  matchText: { color: '#F8F3ED', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  why: { color: '#4F3636', fontSize: 11, lineHeight: 15, marginTop: 8 },
  typing: { color: '#7A4B6A', fontSize: 12, paddingHorizontal: 18, marginBottom: 4, fontWeight: '600', letterSpacing: 0.3 },
  inputRow: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 12, backgroundColor: '#FFF8F0', borderTopWidth: 1, borderTopColor: '#D9C9B8' },
  input: { flex: 1, backgroundColor: '#F8F3ED', borderRadius: 26, paddingHorizontal: 18, paddingVertical: 13, color: '#1F1414', fontSize: 15, borderWidth: 1, borderColor: '#D9C9B8' },
  sendBtn: { marginLeft: 10, backgroundColor: '#8C5C2D', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
});
