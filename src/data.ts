import { MatchUser, CampusPost } from "./types";

export const UNIVERSITIES = [
  // Istanbul
  "Boğaziçi Üniversitesi",
  "İstanbul Teknik Üniversitesi (İTÜ)",
  "Yıldız Teknik Üniversitesi (YTÜ)",
  "Koç Üniversitesi",
  "Sabancı Üniversitesi",
  "Galatasaray Üniversitesi",
  "İstanbul Üniversitesi",
  "Marmara Üniversitesi",
  // Ankara
  "Orta Doğu Teknik Üniversitesi (ODTÜ)",
  "Bilkent Üniversitesi",
  "Hacettepe Üniversitesi",
  "Ankara Üniversitesi",
  "Gazi Üniversitesi",
  "TOBB ETÜ",
  // Izmir
  "Ege Üniversitesi",
  "Dokuz Eylül Üniversitesi",
  "İzmir Yüksek Teknoloji Enstitüsü (İYTE)",
  "Yaşar Üniversitesi",
  // Eskisehir
  "Anadolu Üniversitesi",
  "Eskişehir Osmangazi Üniversitesi (ESOGÜ)",
  "Eskişehir Teknik Üniversitesi (ESTÜ)",
  // Bursa
  "Bursa Uludağ Üniversitesi",
  "Bursa Teknik Üniversitesi",
  // Düzce
  "Düzce Üniversitesi"
];

export const MAJORS = [
  "Bilgisayar Mühendisliği",
  "Endüstri Mühendisliği",
  "Yazılım Mühendisliği",
  "Yapay Zeka Mühendisliği",
  "Elektrik-Elektronik Mühendisliği",
  "Makine Mühendisliği",
  "İnşaat Mühendisliği",
  "Bilişim Sistemleri",
  "Moleküler Biyoloji ve Genetik",
  "Psikoloji",
  "Sosyoloji",
  "Felsefe",
  "Tarih",
  "Uluslararası İlişkiler",
  "Siyaset Bilimi",
  "İktisat",
  "İşletme",
  "Tıp",
  "Diş Hekimliği",
  "Eczacılık",
  "Hukuk",
  "Mimarlık",
  "İç Mimarlık",
  "Görsel İletişim Tasarımı",
  "Radyo, Televizyon ve Sinema",
  "İngiliz Dili ve Edebiyatı",
  "Türk Dili ve Edebiyatı",
  "Beslenme ve Diyetetik",
  "Fizyoterapi ve Rehabilitasyon",
  "Veterinerlik",
  "Matematik",
  "Fizik",
  "Kimya",
  "Havacılık ve Uzay Mühendisliği"
];

export const HOBBIES = [
  "Teknopark / Yazılım Projeleri",
  "Çimlerde Takılmak / Akustik",
  "Vizelere Ağlamak / Sabahlamak",
  "Kahve & Kütüphane Sohbetleri",
  "Konser / Aktivite / Festival",
  "Gece Hayatı / Partiler",
  "Maket Tasarımı / Eskiz",
  "Tiyatro & Sinema Kulübü",
  "Gaming / LoL / Valorant",
  "Spor Salonu / Fitness",
  "Kitap & Felsefe Kahvesi",
  "Kampüs Kedilerini Sevmek",
  "Kamp / Doğa Gezileri",
  "Tenis / Padel",
  "Pilates / Yoga",
  "Plak Koleksiyonculuğu",
  "Sokak Lezzetleri Keşfi",
  "Otostop / Sırt Çantalı Gezi"
];

export const LOOKING_FOR_OPTIONS = [
  "Flört & Romantizm",
  "Kahve Arkadaşlığı",
  "Sınav Çalışma Ortağı",
  "Networking & Projeler",
  "Sadece Arkadaşlık",
];

export const INITIAL_MATCH_CANDIDATES: MatchUser[] = [
  {
    id: "melis_itu",
    name: "Melis",
    university: "İstanbul Teknik Üniversitesi (İTÜ)",
    major: "Mimarlık",
    year: "3. Sınıf",
    bio: "Taşkışla koridorlarında çizim tüpüyle koşturan o kız benim. Kahve olmadan çizim bitmiyor, kulaklığımda hep lo-fi beat'ler çalar.",
    hobbies: ["Maket Tasarımı / Eskiz", "Kahve & Kütüphane Sohbetleri", "Tiyatro & Sinema Kulübü"],
    personality: "Sanatçı, sakin, tasarım odaklı, hafif içten ve konuşkan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80",
    gender: "female",
    likesMe: true,
    superLikesCount: 15
  },
  {
    id: "can_boun",
    name: "Can",
    university: "Boğaziçi Üniversitesi",
    major: "Moleküler Biyoloji ve Genetik",
    year: "2. Sınıf",
    bio: "Kuzey Kampüs laboratuvarları ile Güney yokuşu arasında mekik dokuyorum. Keşke biraz da sosyal ilişkileri genetik olarak çözebilsek :D Indie-rock seviyorum.",
    hobbies: ["Konser / Aktivite / Festival", "Kitap & Felsefe Kahvesi", "Filmler / Sci-Fi"],
    personality: "Zeki, eğlenceli, enerjik ve festival ruhlu",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    gender: "male",
    likesMe: true,
    superLikesCount: 8
  },
  {
    id: "ece_odtu",
    name: "Ece",
    university: "Orta Doğu Teknik Üniversitesi (ODTÜ)",
    major: "Havacılık ve Uzay Mühendisliği",
    year: "4. Sınıf",
    bio: "ODTÜ Çimler'de güneşlenmeyi ve Devrim stadında yürümeyi severim. Havacılık projelerinden başımı kaldırabilirsem buluşuruz belki. Frisbee oynamaya bayılırım!",
    hobbies: ["Tenis / Padel", "Pilates / Yoga", "Teknopark / Yazılım Projeleri"],
    personality: "Azimli, sportif, neşeli ve cana yakın",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    gender: "female",
    likesMe: true,
    superLikesCount: 22
  },
  {
    id: "arda_hacettepe",
    name: "Arda",
    university: "Hacettepe Üniversitesi",
    major: "Tıp",
    year: "5. Sınıf",
    bio: "Tus çalışmaktan ve nöbetlerden arta kalan kısıtlı zamanımı değerlendirmeye çalışıyorum. Hayatta kalma garantili sohbetler vaat ediyorum :D",
    hobbies: ["Vizelere Ağlamak / Sabahlamak", "Spor Salonu / Fitness", "Kamp / Doğa Gezileri"],
    personality: "Yoğun, espritüel, güvenilir ve sakin mizaçlı",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    gender: "male",
    likesMe: true,
    superLikesCount: 19
  },
  {
    id: "ceren_bilkent",
    name: "Ceren",
    university: "Bilkent Üniversitesi",
    major: "Psikoloji",
    year: "3. Sınıf",
    bio: "Merkez kütüphanede kahve bardağımla sessizlikte otururken görebilirsin beni. İnsanları analiz etmiyorum söz veriyorum! Sadece gözlemlemeyi seviyorum.",
    hobbies: ["Pilates / Yoga", "Plak Koleksiyonculuğu", "Kitap & Felsefe Kahvesi"],
    personality: "Empatik, analizci, kitap kurdu ve nazik",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80",
    gender: "female",
    likesMe: true,
    superLikesCount: 14
  },
  {
    id: "mert_ytu",
    name: "Mert",
    university: "Yıldız Teknik Üniversitesi (YTÜ)",
    major: "Bilgisayar Mühendisliği",
    year: "2. Sınıf",
    bio: "Davutpaşa kampüsünün tozunu yutanlar bilir. Gece kod yazıp gündüz uyuyorum. Hackathonlarda uykusuz kalmak yaşam tarzım oldu. Kahve sponsorluğuna açığım.",
    hobbies: ["Teknopark / Yazılım Projeleri", "Gaming / LoL / Valorant", "Konser / Aktivite / Festival"],
    personality: "Teknoloji tutkunu, oyuncu, esprili ve gece kuşu",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
    gender: "male",
    likesMe: true,
    superLikesCount: 5
  },
  {
    id: "dilara_koc",
    name: "Dilara",
    university: "Koç Üniversitesi",
    major: "İşletme",
    year: "4. Sınıf",
    bio: "Kampüste deniz havasını alarak kahve içmek paha biçilemez. Mezuniyet yaklaşıyor, kurumsal hayatın soğukluğuna girmeden son samimi kahve sohbetlerini yapalım.",
    hobbies: ["Tenis / Padel", "Çimlerde Takılmak / Akustik", "Konser / Aktivite / Festival"],
    personality: "Kendinden emin, cana yakın, gezen-tozan ve karizmatik",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    gender: "female",
    likesMe: true,
    superLikesCount: 27
  },
  {
    id: "burak_ankara",
    name: "Burak",
    university: "Ankara Üniversitesi",
    major: "Hukuk",
    year: "3. Sınıf",
    bio: "Cebeci kampüsünün tarihi binalarında anayasa hukuku ezberleyen o yorgun çocuk. Tartışma kulüplerinde kendimi yeterince yormuyormuşum gibi buradayım.",
    hobbies: ["Kitap & Felsefe Kahvesi", "Plak Koleksiyonculuğu", "Kamp / Doğa Gezileri"],
    personality: "Dillere destan hitabet, entelektüel, sorgulayıcı ve eğlenceli",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
    gender: "male",
    likesMe: true,
    superLikesCount: 11
  }
];

export const INITIAL_CAMPUS_POSTS: CampusPost[] = [
  {
    id: "post_1",
    authorUniversity: "Orta Doğu Teknik Üniversitesi (ODTÜ)",
    authorMajor: "Havacılık ve Uzay Mühendisliği",
    text: "Devrim Stadında dün akşam gitar çalan gruptaki kırmızı sweatli çocuk... Şarkıları çok güzel söyledin ama uzaktan bakışmaktan vizeme odaklanamadım. Buradaysan ses ver!",
    timestamp: "2 saat önce",
    likes: 42,
    hasLiked: false,
    comments: [
      {
        id: "comm_1",
        university: "Orta Doğu Teknik Üniversitesi (ODTÜ)",
        major: "Bilgisayar Mühendisliği",
        text: "Kırmızı sweatli bendim ama gitar değil ritim grubu bendeydi :P",
        timestamp: "1 saat önce"
      },
      {
        id: "comm_2",
        university: "Hacettepe Üniversitesi",
        major: "Tıp",
        text: "Hadi bakalım ODTÜ Çimlerde düğün kuruluyor ksjsjs",
        timestamp: "30 dakika önce"
      }
    ]
  },
  {
    id: "post_2",
    authorUniversity: "Boğaziçi Üniversitesi",
    authorMajor: "Moleküler Biyoloji ve Genetik",
    text: "Güney Meydan'da dün öğlen çimlerde yatarken elindeki kahvesini döküp üstüme sıçratan ve panik yapıp peçete ararken Boğaz manzarasını kapatan o telaşlı çocuk. Üzüldüğünü gördüm, bir kahve borcun var unutma :)",
    timestamp: "4 saat önce",
    likes: 85,
    hasLiked: false,
    comments: []
  },
  {
    id: "post_3",
    authorUniversity: "İstanbul Teknik Üniversitesi (İTÜ)",
    authorMajor: "Mimarlık",
    text: "Taşkışla'da jüriye 1 saat kalmışken maketimin köprüsü çöktü. Oradan geçen bir maden mühendisi arkadaş hızlı yapıştırıcıyla yardımıma koştu. Sayende BB ile geçtim! Gerçek bir mühendislik dayanışması budur, teşekkürler adsız kahraman.",
    timestamp: "1 gün önce",
    likes: 120,
    hasLiked: false,
    comments: [
      {
        id: "comm_3",
        university: "İstanbul Teknik Üniversitesi (İTÜ)",
        major: "Endüstri Mühendisliği",
        text: "Maden mühendisleri her an dinamitle patlatmaya hazır gezerler yardımları iyidir",
        timestamp: "18 saat önce"
      }
    ]
  },
  {
    id: "post_4",
    authorUniversity: "Hacettepe Üniversitesi",
    authorMajor: "Tıp",
    text: "Beytepe kampüsünün meşhur yeşilliği ve havasını her sabah solumak harika ama o kütüphaneden çıkıp yemekhane kuyruğuna girdiğimde yaşam enerjim yüzde sıfıra düşüyor. Bu kuyruk neden erimiyor ey Hacettepe halkı?",
    timestamp: "1 gün önce",
    likes: 56,
    hasLiked: false,
    comments: []
  }
];
