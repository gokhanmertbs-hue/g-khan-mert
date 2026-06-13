import { useState } from "react";
import { MatchUser, UserProfile } from "../types";
import { GraduationCap, BookOpen, Heart, X, Check, Filter, Sparkles, MessageSquare, Flame, Star, Trophy } from "lucide-react";
import { UNIVERSITIES, LOOKING_FOR_OPTIONS } from "../data";

interface DiscoverProps {
  userProfile: UserProfile;
  candidates: MatchUser[];
  onLike: (matchUser: MatchUser) => void;
  onDislike: (matchId: string) => void;
  onStartChat: (matchUser: MatchUser) => void;
  onSuperLike: (matchUser: MatchUser) => void;
}

export default function Discover({
  userProfile,
  candidates,
  onLike,
  onDislike,
  onStartChat,
  onSuperLike,
}: DiscoverProps) {
  const [filterUni, setFilterUni] = useState<string>("Tümü");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchOverlay, setShowMatchOverlay] = useState<MatchUser | null>(null);
  const [superLikeNote, setSuperLikeNote] = useState<string | null>(null);

  // Filter candidates based on gender orientation choice, plus selected university filters
  const filteredCandidates = candidates.filter((item) => {
    if (filterUni !== "Tümü" && item.university !== filterUni) return false;
    
    // Gender sorting orientation: only show the matched gender or all
    if (userProfile.preferredGender && userProfile.preferredGender !== "all") {
      if (item.gender !== userProfile.preferredGender) return false;
    }
    
    return true;
  });

  const currentCandidate = filteredCandidates[currentIndex];

  const handleAction = (like: boolean) => {
    if (!currentCandidate) return;

    if (like) {
      onLike(currentCandidate);
      // Since likesMe is true on our preset candidates for maximum simulation fun:
      if (currentCandidate.likesMe) {
        setShowMatchOverlay(currentCandidate);
      } else {
        goToNext();
      }
    } else {
      onDislike(currentCandidate.id);
      goToNext();
    }
  };

  const handleSuperLikeAction = () => {
    if (!currentCandidate) return;

    const left = userProfile.superLikesLeft ?? 2;
    if (left <= 0) {
      setSuperLikeNote("Günde sadece 2 Süper Beğeni atma hakkın var. Hakların yarın yenilenecektir! ⚡");
      setTimeout(() => setSuperLikeNote(null), 4000);
      return;
    }

    // Process super-like
    onSuperLike(currentCandidate);
    
    // Super-liked candidates immediately become matching conversations!
    setSuperLikeNote(`🎉 ${currentCandidate.name}'e SÜPER BEĞENİ atıldı! Karşı tarafa bildirim gönderildi.`);
    setTimeout(() => {
      setSuperLikeNote(null);
      setShowMatchOverlay(currentCandidate);
    }, 1200);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handleCloseMatch = () => {
    if (showMatchOverlay) {
      goToNext();
      setShowMatchOverlay(null);
    }
  };

  const handleMatchChat = () => {
    if (showMatchOverlay) {
      const matched = showMatchOverlay;
      setShowMatchOverlay(null);
      goToNext();
      onStartChat(matched);
    }
  };

  return (
    <div id="discover-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full">
      {/* LEFT: Card Stack Container (7 cols) */}
      <div id="discover-card-area" className="lg:col-span-7 flex flex-col justify-center items-center relative min-h-[500px]">
        {/* Decorative background text */}
        <div className="absolute -top-12 left-4 text-[120px] sm:text-[160px] font-black opacity-5 select-none pointer-events-none uppercase italic tracking-tighter text-white">
          KAMPÜS
        </div>

        {superLikeNote && (
          <div className="absolute top-0 z-40 bg-gradient-to-r from-amber-500 to-yellow-600 border border-yellow-400/20 text-white rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-wider shadow-lg animate-bounce text-center max-w-sm">
            ⚡ {superLikeNote}
          </div>
        )}

        {currentCandidate ? (
          <div className="relative w-full max-w-[480px] group">
            {/* Main swiper card */}
            <div id="discover-card-main" className="h-[540px] rounded-[40px] overflow-hidden border border-white/20 relative shadow-2xl bg-neutral-900 flex flex-col">
              {/* Grayscale hover to color image path */}
              <div className="absolute inset-0 z-0">
                <img
                  src={currentCandidate.avatar}
                  alt={currentCandidate.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                {/* Visual fading shield */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-black/40 z-10"></div>
              </div>

              {/* CARD BADGES (Super Likes Count) */}
              <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                <span className="bg-amber-500/90 text-neutral-950 font-black text-[10px] tracking-widest px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl uppercase backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 fill-neutral-950 animate-pulse text-neutral-950" />
                  {currentCandidate.superLikesCount ?? 0} Süper Beğeni Aldı
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="absolute bottom-0 inset-x-0 p-8 sm:p-10 z-20 flex flex-col justify-end text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-pink-500 text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-widest italic flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {currentCandidate.university.split(" ")[0]}
                  </span>
                  <span className="text-xs text-white/75 font-semibold bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {currentCandidate.year}
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black italic tracking-tight mb-2">
                  {currentCandidate.name}, {currentCandidate.gender === "female" ? "21" : "22"}
                </h2>

                <p className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 inline text-pink-400" />
                  {currentCandidate.major}
                </p>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  "{currentCandidate.bio}"
                </p>

                {/* Hobbies chips */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {currentCandidate.hobbies.map((h) => (
                    <span key={h} className="text-[10px] bg-white/10 text-white/90 border border-white/5 py-1 px-2.5 rounded-full backdrop-blur-sm">
                      #{h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Action Swiping Buttons inside Card stack */}
            <div id="discover-swipe-actions" className="absolute -bottom-6 inset-x-0 flex justify-center items-center gap-3 z-30">
              {/* Nope button */}
              <button
                onClick={() => handleAction(false)}
                className="w-12 h-12 rounded-full bg-neutral-950 text-white hover:bg-neutral-800 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl border border-white/10 cursor-pointer"
                title="Pas Geç"
              >
                <X className="w-5 h-5 stroke-[3]" />
              </button>

              {/* Super Like / Star button (Golden Star decoration) */}
              <button
                onClick={handleSuperLikeAction}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-neutral-950 hover:from-white hover:to-white flex flex-col items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-amber-500/20 cursor-pointer"
                title="Süper Beğeni At!"
              >
                <Star className="w-6 h-6 fill-current text-neutral-950 font-black animate-spin-slow" />
                <span className="text-[7px] font-black tracking-tighter uppercase mt-0.5">SÜPER</span>
              </button>

              {/* Like / Love button */}
              <button
                onClick={() => handleAction(true)}
                className="w-16 h-16 rounded-full bg-pink-500 text-white hover:bg-pink-600 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-pink-500/30 cursor-pointer animate-pulse"
                title="Beğen"
              >
                <Heart className="w-7 h-7 fill-current" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white/5 border border-white/10 rounded-[40px] max-w-sm w-full backdrop-blur-md">
            <div className="w-16 h-16 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black italic mb-2 text-white">Sana Özel Arama Bitti</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Üniversiteniz ya da seçtiğiniz filtrelere ait tüm adayları inceledin. Yeni öğrenciler her an katılıyor!
            </p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="mt-6 px-6 py-2 bg-pink-500 text-white text-xs font-black uppercase tracking-widest rounded-full cursor-pointer hover:bg-pink-600 transition-colors"
            >
              Listeyi Sıfırla
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Quick Match Tips & Side Panel (5 cols) */}
      <div id="discover-side-panel" className="lg:col-span-5 flex flex-col gap-6 w-full">
        {/* Filtering Panel */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-pink-500" />
            <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest">
              Kampüs Filtreleri
            </h3>
          </div>

          <div className="space-y-4">
            {/* University Filter Selector */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1.5">
                Üniversiteye Göre Ara
              </label>
              <select
                value={filterUni}
                onChange={(e) => {
                  setFilterUni(e.target.value);
                  setCurrentIndex(0);
                }}
                className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-medium"
              >
                <option value="Tümü">Tüm Üniversiteler 🏢</option>
                {UNIVERSITIES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Extra Info Hint */}
            <div className="flex gap-3 items-center bg-white/5 px-3 py-2.5 rounded-xl border border-white/5 text-[11px] text-gray-300">
              <span className="p-1 bg-amber-500/10 text-amber-400 rounded-lg">
                <Flame className="w-4 h-4" />
              </span>
              <span>
                Şu anda bulunduğun üniversite: <strong>{userProfile.university}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Super Like Wallet Tracker Status Box */}
        <div className="bg-neutral-900 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-[-40px] right-[-40px] w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h4 className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Süper Beğeni Cüzdanı</h4>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[22px] font-black text-white italic">
                {userProfile.superLikesLeft ?? 2} / 2 sol
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">Her gün ücretsiz yenilenir.</p>
            </div>
            <Star className="w-8 h-8 text-amber-400 fill-amber-400/20 animate-pulse" />
          </div>
        </div>

        {/* Fun Match & Partners Promotion Card */}
        <div className="flex-1 bg-gradient-to-br from-pink-500/20 to-blue-500/20 border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 border border-white/20">
            <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-black italic leading-tight mb-2 text-white">Ders Çalışma Partneri Bul</h4>
          <p className="text-xs text-gray-300 max-w-[220px] leading-relaxed">
            Vizeler ve finaller yaklaşırken kütüphanede uykusuz kalma. Bölümüne göre bir çalışma arkadaşı bul.
          </p>
          <div className="mt-4 text-[10px] bg-white/10 px-3 py-1 rounded-full text-pink-300 uppercase tracking-widest font-black inline-block">
            {userProfile.major}
          </div>
        </div>
      </div>

      {/* MATCH CONFIRMATION OVERLAY MODAL */}
      {showMatchOverlay && (
        <div id="match-overlay" className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-lg">
          <div className="absolute top-0 inset-x-0 h-full overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-pink-500/30 rounded-full blur-[100px] -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2"></div>
          </div>

          <div className="relative z-10 text-center max-w-md w-full scale-in">
            <div className="animate-beat inline-block mb-3">
              <span className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-xs uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg shadow-pink-500/50">
                🎉 KAMPÜS EŞLEŞMESİ! 🎉
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter text-white mb-6 uppercase">
              BÜYÜK AŞK<span className="text-pink-500">?</span>
            </h1>

            {/* Avatar Comparison circles */}
            <div className="flex items-center justify-center gap-6 mb-8">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full overflow-hidden border-4 border-pink-500 shadow-xl">
                  <img src={userProfile.avatar} alt="Sen" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-2 -right-1 bg-neutral-900 border border-white/10 px-2 py-0.5 rounded-full text-[9px] text-gray-300 font-bold">
                  Sen
                </div>
              </div>

              <div className="w-12 h-10 flex items-center justify-center text-pink-500">
                <Heart className="w-10 h-10 fill-current animate-pulse" />
              </div>

              {/* Match Avatar */}
              <div className="relative">
                <div className="w-24 sm:w-28 h-24 sm:h-28 rounded-full overflow-hidden border-4 border-pink-500 shadow-xl">
                  <img src={showMatchOverlay.avatar} alt={showMatchOverlay.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-2 -right-1 bg-pink-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {showMatchOverlay.university.split(" ")[0]}
                </div>
              </div>
            </div>

            {/* Congratulation text */}
            <p className="text-sm text-gray-300 mb-8 max-w-xs mx-auto leading-relaxed">
              Tebrikler! <strong>{showMatchOverlay.name}</strong> da seninle tanışmak istedi. Gemini destekli akıllı sohbeti başlatıp hemen konuşabilirsin!
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
              <button
                onClick={handleMatchChat}
                className="w-full sm:w-auto px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                Sohbete Başla
              </button>
              <button
                onClick={handleCloseMatch}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-full font-black text-xs uppercase tracking-widest border border-white/10 transition-colors cursor-pointer"
              >
                Kaydırmaya Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
