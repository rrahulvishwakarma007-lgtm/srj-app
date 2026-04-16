import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { products, Product } from '../lib/data';

interface Msg { id: number; from: 'user' | 'ai'; text: string; suggestions?: Suggestion[]; }
interface Suggestion extends Product { why: string; match: number; }

const PROMPTS = [
  'Wedding necklace under ₹80k',
  'Engagement ring under 1 lakh',
  'Daily wear earrings',
  'Festive gold bangles',
  'Heritage necklace set',
];

function parseBudget(q: string): number | null {
  const m = q.match(/(\d+)\s*(k|lakh|crore)?/i);
  if (!m) return null;
  let n = parseInt(m[1], 10);
  const unit = (m[2] || '').toLowerCase();
  if (unit === 'k') n *= 1000;
  if (unit === 'lakh') n *= 100000;
  if (unit === 'crore') n *= 10000000;
  return n;
}

function aiReply(input: string): { text: string; suggestions: Suggestion[] } {
  const q = input.toLowerCase();
  const budget = parseBudget(q);

  // Score each product for relevance
  const scored: Suggestion[] = products.map(p => {
    let score = 0;
    let why = '';

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