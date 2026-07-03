export const t = (key, lang, dict) => {
  const l = lang || 'tr';
  return (dict[key] && dict[key][l]) || dict[key]?.en || key;
};

export const TR = {
  brand: { tr: 'THREAT.CHRONICLES', en: 'THREAT.CHRONICLES' },
  nav_home: { tr: 'Ana Sayfa', en: 'Home' },
  nav_attacks: { tr: 'Saldırılar', en: 'Attacks' },
  nav_submit: { tr: 'Katkıda Bulun', en: 'Contribute' },
  nav_about: { tr: 'Hakkında', en: 'About' },
  hero_kicker: { tr: 'DİJİTAL ARŞİV / KRONOLOJİK ANALİZ', en: 'DIGITAL ARCHIVE / CHRONOLOGICAL ANALYSIS' },
  hero_title: {
    tr: 'Tarihin en büyük siber saldırıları, saldırganın gözünden anlatıldı.',
    en: 'The greatest cyber attacks in history — told from the attacker\'s perspective.'
  },
  hero_sub: {
    tr: 'İlk keşiften veri sızıntısına, kill chain\'in her aşamasını dakika dakika okuyun. Kendi analizinizi ekleyin veya AI ile herhangi bir saldırının kronolojisini üretin.',
    en: 'From the first probe to the final exfiltration — read the kill chain minute by minute. Contribute your own analysis or generate any incident timeline with AI.'
  },
  hero_cta: { tr: 'Arşive Gir', en: 'Enter the Archive' },
  hero_cta2: { tr: 'AI ile Analiz Et', en: 'Analyze with AI' },
  stat_attacks: { tr: 'Belgelenmiş Vaka', en: 'Documented cases' },
  stat_cost: { tr: 'Toplam Tahmini Zarar', en: 'Total estimated damage' },
  stat_sectors: { tr: 'Etkilenen Sektör', en: 'Sectors affected' },
  featured: { tr: 'Öne Çıkan Vakalar', en: 'Featured Incidents' },
  all_attacks: { tr: 'Tüm Saldırılar', en: 'All Attacks' },
  filter_year: { tr: 'Yıl', en: 'Year' },
  filter_sector: { tr: 'Sektör', en: 'Sector' },
  search_ph: { tr: 'Ara: log4j, ransomware...', en: 'Search: log4j, ransomware...' },
  view_case: { tr: 'Vakayı İncele', en: 'Open Case File' },
  timeline: { tr: 'Kronolojik Akış', en: 'Chronological Timeline' },
  killchain: { tr: 'Kill Chain', en: 'Kill Chain' },
  iocs: { tr: 'Göstergeler (IOC)', en: 'Indicators (IOCs)' },
  lessons: { tr: 'Çıkarılan Dersler', en: 'Lessons Learned' },
  narrative: { tr: 'Vaka Hikayesi', en: 'Case Story' },
  overview: { tr: 'Özet', en: 'Overview' },
  submit_title: { tr: 'Kendi Analizinizi Ekleyin', en: 'Contribute Your Analysis' },
  submit_sub: { tr: 'Bir vaka mı biliyorsunuz? Kaydını topluluğa ekleyin. Onay sonrası yayınlanır.', en: 'Know a case? Add it to the community archive. Published after review.' },
  form_name: { tr: 'Saldırı Adı', en: 'Attack name' },
  form_year: { tr: 'Yıl', en: 'Year' },
  form_sector: { tr: 'Sektör', en: 'Sector' },
  form_type: { tr: 'Saldırı Tipi', en: 'Attack type' },
  form_summary: { tr: 'Tek cümlelik özet', en: 'One-sentence summary' },
  form_narrative: { tr: 'Detaylı hikaye', en: 'Detailed narrative' },
  form_submitter: { tr: 'Adınız', en: 'Your name' },
  form_email: { tr: 'E-posta (opsiyonel)', en: 'Email (optional)' },
  form_submit: { tr: 'Gönder', en: 'Submit' },
  submitted_ok: { tr: 'Teşekkürler! İncelemeye alındı.', en: 'Thanks! Sent for review.' },
  ai_title: { tr: 'AI Analiz — Threat Chronicler', en: 'AI Analysis — Threat Chronicler' },
  ai_placeholder: { tr: 'Örn: 2013 Target veri sızıntısı', en: 'e.g., 2013 Target data breach' },
  ai_button: { tr: 'Analiz Oluştur', en: 'Generate analysis' },
  ai_loading: { tr: 'Kronoloji derleniyor...', en: 'Compiling chronology...' },
  about_title: { tr: 'Bu Arşiv Hakkında', en: 'About this Archive' },
  about_body: {
    tr: 'Threat Chronicles, gerçekleşmiş siber olayları edebi bir kronoloji ve teknik doğrulukla belgelemek için kurulmuş açık bir arşivdir. Her vaka; hikaye anlatımı, dakika-dakika timeline, Lockheed Martin Kill Chain fazları, IOC\'ler ve öğrenilen dersler ile sunulur.',
    en: 'Threat Chronicles is an open archive documenting real cyber incidents with literary chronology and technical rigor. Each case includes storytelling, a minute-by-minute timeline, the Lockheed Martin Kill Chain phases, IOCs and lessons learned.'
  },
  phases: {
    Reconnaissance: { tr: 'Keşif', en: 'Reconnaissance' },
    Weaponization: { tr: 'Silahlandırma', en: 'Weaponization' },
    Delivery: { tr: 'Teslim', en: 'Delivery' },
    Exploitation: { tr: 'Sömürü', en: 'Exploitation' },
    Installation: { tr: 'Kurulum', en: 'Installation' },
    C2: { tr: 'Komuta & Kontrol', en: 'Command & Control' },
    Actions: { tr: 'Hedefe Yönelik Eylemler', en: 'Actions on Objectives' },
  },
  actor_labels: {
    attacker: { tr: 'SALDIRGAN', en: 'ATTACKER' },
    defender: { tr: 'SAVUNMA', en: 'DEFENSE' },
    researcher: { tr: 'ARAŞTIRMACI', en: 'RESEARCHER' },
    public: { tr: 'KAMU', en: 'PUBLIC' },
    developer: { tr: 'GELİŞTİRİCİ', en: 'DEVELOPER' },
  },
};
