import React, { useMemo, useState } from "react";
import {
  Alert, Image, Linking, Modal, Platform, SafeAreaView, ScrollView,
  StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

type Kind = "rent" | "sale";
type Listing = {
  id: string; title: string; area: string; price: number; kind: Kind;
  beds: number; baths: number; size: number; image: string;
  phone: string; verified: boolean; description: string;
};

const initialListings: Listing[] = [
  {
    id: "1", title: "Modern 2-bedroom apartment", area: "Bole, Addis Ababa",
    price: 30000, kind: "rent", beds: 2, baths: 2, size: 110,
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000",
    phone: "+251911000001", verified: true,
    description: "Bright apartment with a balcony, parking and convenient access to shops."
  },
  {
    id: "2", title: "Family house with garden", area: "CMC, Addis Ababa",
    price: 8500000, kind: "sale", beds: 4, baths: 3, size: 220,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000",
    phone: "+251911000002", verified: true,
    description: "Spacious family home in a quiet neighbourhood with a private garden."
  },
  {
    id: "3", title: "Affordable studio", area: "Sar Bet, Addis Ababa",
    price: 14000, kind: "rent", beds: 1, baths: 1, size: 48,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000",
    phone: "+251911000003", verified: false,
    description: "Compact studio apartment close to public transport and local services."
  },
  {
    id: "4", title: "Newly built townhouse", area: "Ayat, Addis Ababa",
    price: 12500000, kind: "sale", beds: 3, baths: 3, size: 180,
    image: "https://images.unsplash.com/photo-1600048572492-9d7f6f4a3b1a?w=1000",
    phone: "+251911000004", verified: true,
    description: "New townhouse with modern finishes and dedicated parking."
  }
];

const copy = {
  en: {
    tagline: "Find a home. Deal directly.",
    search: "Search area or property...",
    rent: "Rent", sale: "Buy", featured: "Homes in Addis Ababa",
    verified: "Verified owner", unverified: "Not yet verified",
    beds: "Beds", baths: "Baths", sqm: "m²", details: "Property details",
    contact: "Call owner", whatsapp: "WhatsApp", add: "Post a home",
    home: "Home", saved: "Saved", post: "Post", profile: "Profile",
    noResults: "No homes found. Try another search.",
    back: "Back", description: "Description", price: "Price",
    rentUnit: "/ month", addTitle: "Post your property",
    title: "Property title", area: "Area / neighbourhood",
    amount: "Price in ETB", phone: "Phone number", submit: "Preview listing",
    note: "Demo only: your listing is not uploaded to a server.",
    language: "አማርኛ", owner: "Direct from owner",
    map: "Map preview", mapNote: "Map integration will be connected in the next phase."
  },
  am: {
    tagline: "ቤት ያግኙ፤ በቀጥታ ይደራደሩ።",
    search: "አካባቢ ወይም ቤት ይፈልጉ...",
    rent: "ኪራይ", sale: "ግዢ", featured: "በአዲስ አበባ ያሉ ቤቶች",
    verified: "የተረጋገጠ ባለቤት", unverified: "ገና ያልተረጋገጠ",
    beds: "መኝታ", baths: "መታጠቢያ", sqm: "ካ.ሜ", details: "የቤት ዝርዝር",
    contact: "ባለቤቱን ይደውሉ", whatsapp: "ዋትስአፕ", add: "ቤት ያስተዋውቁ",
    home: "መነሻ", saved: "የተቀመጡ", post: "አስገባ", profile: "መገለጫ",
    noResults: "ቤት አልተገኘም። ሌላ ፍለጋ ይሞክሩ።",
    back: "ተመለስ", description: "መግለጫ", price: "ዋጋ",
    rentUnit: "/ በወር", addTitle: "ቤትዎን ያስመዝግቡ",
    title: "የቤት ርዕስ", area: "አካባቢ / ሰፈር",
    amount: "ዋጋ በብር", phone: "ስልክ ቁጥር", submit: "ማስታወቂያውን ይመልከቱ",
    note: "የሙከራ ስሪት ነው፤ ማስታወቂያዎ ወደ ሰርቨር አይላክም።",
    language: "English", owner: "በቀጥታ ከባለቤት",
    map: "የካርታ ቅድመ እይታ", mapNote: "የካርታ አገልግሎት በሚቀጥለው ደረጃ ይገናኛል።"
  }
};

const money = (n: number) => `${n.toLocaleString("en-US")} ETB`;

export default function App() {
  const [lang, setLang] = useState<"en" | "am">("am");
  const [kind, setKind] = useState<"all" | Kind>("all");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"home" | "saved" | "post" | "profile">("home");
  const [selected, setSelected] = useState<Listing | null>(null);
  const [listings, setListings] = useState(initialListings);
  const [saved, setSaved] = useState<string[]>([]);
  const [form, setForm] = useState({ title: "", area: "", price: "", phone: "" });
  const t = copy[lang];

  const visible = useMemo(() => listings.filter(item => {
    const matchesKind = kind === "all" || item.kind === kind;
    const matchesQuery = `${item.title} ${item.area}`.toLowerCase().includes(query.toLowerCase());
    const matchesSaved = tab !== "saved" || saved.includes(item.id);
    return matchesKind && matchesQuery && matchesSaved;
  }), [listings, kind, query, tab, saved]);

  const contact = async (phone: string, whatsapp = false) => {
    const digits = phone.replace(/[^\d+]/g, "").replace("+", "");
    const url = whatsapp ? `https://wa.me/${digits}` : `tel:${phone}`;
    try { await Linking.openURL(url); }
    catch { Alert.alert("Contact", "Unable to open the contact app on this device."); }
  };

  const postListing = () => {
    if (!form.title.trim() || !form.area.trim() || !form.price.trim() || !form.phone.trim()) {
      Alert.alert("Missing details", "Please complete all fields.");
      return;
    }
    const newItem: Listing = {
      id: String(Date.now()), title: form.title, area: form.area,
      price: Number(form.price.replace(/,/g, "")) || 0, kind: "rent",
      beds: 2, baths: 1, size: 80,
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000",
      phone: form.phone, verified: false,
      description: "New demo listing. Owner verification is pending."
    };
    setListings(current => [newItem, ...current]);
    setForm({ title: "", area: "", price: "", phone: "" });
    setTab("home");
    setKind("all");
    Alert.alert("Preview added", "Your sample listing has been added locally on this device.");
  };

  const Header = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.brand}>QETITA <Text style={styles.brandOrange}>ቀጥታ</Text></Text>
        <Text style={styles.tagline}>{t.tagline}</Text>
      </View>
      <TouchableOpacity style={styles.langButton} onPress={() => setLang(lang === "am" ? "en" : "am")}>
        <Text style={styles.langText}>{t.language}</Text>
      </TouchableOpacity>
    </View>
  );

  const ListingCard = ({ item }: { item: Listing }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.price}>{money(item.price)}{item.kind === "rent" ? t.rentUnit : ""}</Text>
          <TouchableOpacity onPress={() => setSaved(s => s.includes(item.id) ? s.filter(x => x !== item.id) : [...s, item.id])}>
            <Text style={styles.heart}>{saved.includes(item.id) ? "♥" : "♡"}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.area}>📍 {item.area}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>🛏 {item.beds} {t.beds}</Text>
          <Text style={styles.meta}>🚿 {item.baths} {t.baths}</Text>
          <Text style={styles.meta}>▧ {item.size} {t.sqm}</Text>
        </View>
        <Text style={item.verified ? styles.verified : styles.pending}>
          {item.verified ? "✓ " + t.verified : "◷ " + t.unverified}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <Header />
      {selected ? (
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity onPress={() => setSelected(null)}><Text style={styles.back}>‹ {t.back}</Text></TouchableOpacity>
          <Image source={{ uri: selected.image }} style={styles.detailImage} />
          <Text style={styles.detailPrice}>{money(selected.price)}{selected.kind === "rent" ? t.rentUnit : ""}</Text>
          <Text style={styles.detailTitle}>{selected.title}</Text>
          <Text style={styles.area}>📍 {selected.area}</Text>
          <Text style={selected.verified ? styles.verified : styles.pending}>{selected.verified ? "✓ " + t.verified : "◷ " + t.unverified}</Text>
          <View style={styles.stats}>
            <Text style={styles.stat}>🛏 {selected.beds} {t.beds}</Text>
            <Text style={styles.stat}>🚿 {selected.baths} {t.baths}</Text>
            <Text style={styles.stat}>▧ {selected.size} {t.sqm}</Text>
          </View>
          <Text style={styles.sectionTitle}>{t.description}</Text>
          <Text style={styles.description}>{selected.description}</Text>
          <Text style={styles.sectionTitle}>{t.map}</Text>
          <View style={styles.mapPlaceholder}><Text style={styles.mapPin}>📍</Text><Text style={styles.mapText}>{selected.area}</Text><Text style={styles.mapSmall}>{t.mapNote}</Text></View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => contact(selected.phone)}><Text style={styles.primaryText}>☎ {t.contact}</Text></TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => contact(selected.phone, true)}><Text style={styles.secondaryText}>◉ {t.whatsapp}</Text></TouchableOpacity>
        </ScrollView>
      ) : tab === "post" ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>{t.addTitle}</Text>
          <TextInput style={styles.input} placeholder={t.title} value={form.title} onChangeText={v => setForm(f => ({...f, title:v}))} />
          <TextInput style={styles.input} placeholder={t.area} value={form.area} onChangeText={v => setForm(f => ({...f, area:v}))} />
          <TextInput style={styles.input} placeholder={t.amount} keyboardType="numeric" value={form.price} onChangeText={v => setForm(f => ({...f, price:v}))} />
          <TextInput style={styles.input} placeholder={t.phone} keyboardType="phone-pad" value={form.phone} onChangeText={v => setForm(f => ({...f, phone:v}))} />
          <Text style={styles.disclaimer}>{t.note}</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={postListing}><Text style={styles.primaryText}>{t.submit}</Text></TouchableOpacity>
        </ScrollView>
      ) : tab === "profile" ? (
        <View style={styles.content}>
          <Text style={styles.pageTitle}>{t.profile}</Text>
          <Text style={styles.description}>Qetita — Direct Rent & Sale Platform</Text>
          <Text style={styles.disclaimer}>MVP demo • Addis Ababa, Ethiopia</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setLang(lang === "am" ? "en" : "am")}><Text style={styles.secondaryText}>{t.language}</Text></TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.heroEyebrow}>ADDIS ABABA • ETHIOPIA</Text>
            <Text style={styles.heroTitle}>{t.tagline}</Text>
            <Text style={styles.heroSub}>Qetita / ቀጥታ</Text>
          </View>
          <TextInput style={styles.search} placeholder={"⌕  " + t.search} value={query} onChangeText={setQuery} />
          <View style={styles.filters}>
            {(["all", "rent", "sale"] as const).map(k => (
              <TouchableOpacity key={k} onPress={() => setKind(k)} style={[styles.filter, kind === k && styles.filterActive]}>
                <Text style={[styles.filterText, kind === k && styles.filterTextActive]}>{k === "all" ? "All / ሁሉም" : k === "rent" ? t.rent : t.sale}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sectionTitle}>{tab === "saved" ? t.saved : t.featured}</Text>
          {visible.length ? visible.map(item => <ListingCard key={item.id} item={item} />) : <Text style={styles.empty}>{t.noResults}</Text>}
        </ScrollView>
      )}
      {!selected && (
        <View style={styles.nav}>
          {([
            ["home", "⌂", t.home], ["saved", "♡", t.saved], ["post", "+", t.post], ["profile", "◎", t.profile]
          ] as const).map(([key, icon, label]) => (
            <TouchableOpacity key={key} style={styles.navItem} onPress={() => setTab(key)}>
              <Text style={[styles.navIcon, tab === key && styles.navSelected]}>{icon}</Text>
              <Text style={[styles.navLabel, tab === key && styles.navSelected]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F8FE", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  header: { paddingHorizontal: 18, paddingVertical: 13, backgroundColor: "#FFFFFF", flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderColor: "#E8EEF8" },
  brand: { fontSize: 23, fontWeight: "900", color: "#123B86", letterSpacing: 0.4 },
  brandOrange: { color: "#F28B24" },
  tagline: { color: "#66748B", fontSize: 11, marginTop: 2 },
  langButton: { backgroundColor: "#EDF3FF", paddingHorizontal: 13, paddingVertical: 9, borderRadius: 20 },
  langText: { color: "#16449A", fontWeight: "800" },
  content: { padding: 16, paddingBottom: 28 },
  hero: { backgroundColor: "#123B86", borderRadius: 20, padding: 22, marginBottom: 15 },
  heroEyebrow: { color: "#BFD4FF", fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  heroTitle: { color: "#FFFFFF", fontSize: 24, fontWeight: "900", marginTop: 8 },
  heroSub: { color: "#FFB14E", marginTop: 8, fontWeight: "800" },
  search: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E1E8F3", borderRadius: 13, padding: 14, fontSize: 14, marginBottom: 12 },
  filters: { flexDirection: "row", gap: 8, marginBottom: 18 },
  filter: { borderRadius: 22, borderWidth: 1, borderColor: "#D7E1F1", paddingHorizontal: 18, paddingVertical: 9, backgroundColor: "#FFFFFF" },
  filterActive: { backgroundColor: "#1749A2", borderColor: "#1749A2" },
  filterText: { color: "#34435D", fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: "#152B50", marginBottom: 12, marginTop: 5 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 17, overflow: "hidden", marginBottom: 15, borderWidth: 1, borderColor: "#E7ECF4" },
  cardImage: { width: "100%", height: 175, backgroundColor: "#E6EDF8" },
  cardBody: { padding: 13 },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { color: "#1749A2", fontSize: 17, fontWeight: "900" },
  heart: { color: "#E45D65", fontSize: 25 },
  cardTitle: { color: "#1B2B48", fontWeight: "800", fontSize: 15, marginTop: 3 },
  area: { color: "#718099", marginTop: 5, fontSize: 12 },
  metaRow: { flexDirection: "row", gap: 17, marginTop: 12 },
  meta: { color: "#596981", fontSize: 11, fontWeight: "600" },
  verified: { color: "#14834D", fontSize: 12, fontWeight: "800", marginTop: 11 },
  pending: { color: "#B87813", fontSize: 12, fontWeight: "800", marginTop: 11 },
  nav: { flexDirection: "row", justifyContent: "space-around", backgroundColor: "#FFFFFF", paddingVertical: 9, borderTopWidth: 1, borderColor: "#E7ECF4" },
  navItem: { alignItems: "center", minWidth: 60 },
  navIcon: { color: "#8491A6", fontSize: 22, fontWeight: "800" },
  navLabel: { color: "#8491A6", fontSize: 10, marginTop: 2 },
  navSelected: { color: "#1749A2", fontWeight: "900" },
  pageTitle: { color: "#172C50", fontSize: 23, fontWeight: "900", marginBottom: 18 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#DDE5F0", borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 14 },
  disclaimer: { color: "#8B6A2D", backgroundColor: "#FFF6E6", padding: 12, borderRadius: 10, marginVertical: 10, fontSize: 12 },
  primaryButton: { backgroundColor: "#1749A2", borderRadius: 13, padding: 15, alignItems: "center", marginTop: 13 },
  primaryText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  secondaryButton: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#1749A2", borderRadius: 13, padding: 14, alignItems: "center", marginTop: 10 },
  secondaryText: { color: "#1749A2", fontWeight: "900", fontSize: 14 },
  back: { color: "#1749A2", fontSize: 16, fontWeight: "800", marginBottom: 12 },
  detailImage: { width: "100%", height: 230, borderRadius: 17, backgroundColor: "#E6EDF8" },
  detailPrice: { color: "#1749A2", fontSize: 23, fontWeight: "900", marginTop: 16 },
  detailTitle: { color: "#1B2B48", fontSize: 19, fontWeight: "900", marginTop: 5 },
  stats: { flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFF", borderRadius: 13, padding: 14, marginTop: 15 },
  stat: { color: "#40516D", fontWeight: "700", fontSize: 12 },
  description: { color: "#5D6B80", lineHeight: 22, marginBottom: 14 },
  mapPlaceholder: { height: 145, borderRadius: 15, backgroundColor: "#E5EEF8", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  mapPin: { fontSize: 28 },
  mapText: { color: "#183B79", fontWeight: "900", marginTop: 5 },
  mapSmall: { color: "#687891", fontSize: 10, marginTop: 5, textAlign: "center", paddingHorizontal: 12 },
  empty: { color: "#78869B", textAlign: "center", padding: 28 }
});
