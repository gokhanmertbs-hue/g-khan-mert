import React, { useState, useTransition } from "react";
import { UserProfile } from "../types";
import { UNIVERSITIES, MAJORS, HOBBIES, LOOKING_FOR_OPTIONS } from "../data";
import { GraduationCap, BookOpen, Star, UserPlus, Sparkles, Heart, ShieldCheck, Mail, Key, ChevronRight, Check } from "lucide-react";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80", // female 1
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80", // male 1
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80", // female 2
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80", // male 2
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80", // female 3
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80", // male 3
];

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  // Setup steps
  const [step, setStep] = useState<1 | 2>(1);

  // Verification Details (Step 1)
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Profile Details (Step 2)
  const [name, setName] = useState("");
  const [university, setUniversity] = useState(UNIVERSITIES[0]);
  const [major, setMajor] = useState(MAJORS[0]);
  const [year, setYear] = useState("1. Sınıf");
  const [bio, setBio] = useState("");
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState(LOOKING_FOR_OPTIONS[0]);
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0]);
  const [gender, setGender] = useState("female");
  const [preferredGender, setPreferredGender] = useState<"male" | "female" | "all">("all");
  
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!studentEmail.trim()) {
      setError("Lütfen öğrenci e-posta adresini gir.");
      return;
    }
    if (!studentEmail.includes(".edu.tr")) {
      setError("Güvenli ve gerçekçi kampüs deneyimi için sadece '.edu.tr' uzantılı üniversite e-postaları kabul edilir.");
      return;
    }
    if (!studentId.trim()) {
      setError("Lütfen öğrenci numaranızı veya okul kartı seri numaranızı giriniz.");
      return;
    }
    if (studentId.trim().length < 5) {
      setError("Öğrenci numarası en az 5 haneli bir değer olmalıdır.");
      return;
    }

    setIsValidating(true);
    // Simulate high-fidelity academic validation service response
    setTimeout(() => {
      setIsValidating(false);
      setIsVerified(true);
      setTimeout(() => {
        setStep(2);
      }, 1000);
    }, 1500);
  };

  const handleHobbyToggle = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby)
        ? prev.filter((h) => h !== hobby)
        : prev.length < 5
        ? [...prev, hobby]
        : prev
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Lütfen ismini gir.");
      return;
    }
    if (name.length < 2) {
      setError("İsim en az 2 karakter olmalıdır.");
      return;
    }
    if (selectedHobbies.length === 0) {
      setError("Lütfen en az 1 ilgi alanı seç.");
      return;
    }
    if (!bio.trim()) {
      setError("Lütfen kendini tanıtan kısa bir biyografi yaz.");
      return;
    }

    setError("");
    const userProfile: UserProfile = {
      name: name.trim(),
      university,
      major,
      year,
      bio: bio.trim(),
      hobbies: selectedHobbies,
      lookingFor,
      avatar,
      gender,
      preferredGender,
      studentEmail: studentEmail.trim(),
      studentId: studentId.trim(),
      superLikesLeft: 2,
    };

    startTransition(() => {
      onComplete(userProfile);
    });
  };

  return (
    <div id="profile-setup-container" className="min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center relative overflow-hidden">
      {/* GLOW DECORATIONS */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-pink-500/10 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-[20px] right-[-50px] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div id="profile-setup-card" className="max-w-2xl w-full bg-neutral-900 rounded-[32px] border border-white/10 overflow-hidden relative z-10 shadow-2xl">
        
        {/* Header decoration */}
        <div className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 text-center text-white border-b border-white/5 relative">
          <div className="relative z-10 flex flex-col items-center">
            <span className="bg-pink-500/10 text-pink-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest border border-pink-500/20 mb-3 flex items-center gap-1.5 animate-pulse">
              <ShieldCheck className="w-4 h-4 text-pink-450" />
              GÜVENLİ ÖĞRENCİ SİSTEMİ
            </span>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">
              KAMPÜS<span className="text-pink-500">.</span>MATCH
            </h1>
            <p className="mt-2 text-gray-400 text-xs max-w-md leading-relaxed">
              Dışarıdan kimse sızamaz! Sadece doğrulanmış üniversite öğrencileri arasında flört ve ders çalışma arkadaşlığı ağı.
            </p>
          </div>
        </div>

        {/* STEP 1: STUDENT CREDENTIALS / ENTRY LIMIT GATE */}
        {step === 1 ? (
          <form onSubmit={handleVerify} className="p-8 space-y-6">
            <div className="text-center space-y-2 mb-2">
              <h2 className="text-lg font-black text-white italic tracking-wide">AŞAMA 1: AKADEMİK DOĞRULAMA</h2>
              <p className="text-[11px] text-gray-400">Uygulamaya girmeden önce üniversite öğrencisi olduğunuzu teyit etmemiz gerekir.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/15 p-4 rounded-xl text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Email address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-pink-500" />
                  Öğrenci E-Posta Adresi (.edu.tr) <span className="text-pink-500">*</span>
                </label>
                <input
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="Örn: melis.yilmaz@koc.edu.tr, can.demir@itu.edu.tr"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-pink-500 text-white font-medium placeholder:text-gray-600"
                />
                <span className="text-[10px] text-gray-500 block">Sadece üniversitene ait resmi eğitim e-postasıyla giriş yapılabilir.</span>
              </div>

              {/* Student registration / ID numbers */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-pink-400" />
                  Öğrenci Numarası / Kart Seri No <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Örn: 220104050, 15124012"
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-pink-500 text-white font-medium placeholder:text-gray-600"
                />
                <span className="text-[10px] text-gray-500 block">Yükseköğretim Bilgi Sistemi (YÖKSİS) üzerinden doğrulanacaktır.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isValidating || isVerified}
              className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                isVerified
                  ? "bg-green-500 text-white"
                  : "bg-pink-500 text-white hover:bg-pink-600 shadow-xl shadow-pink-500/15"
              }`}
            >
              {isValidating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  YÖKSİS Doğrulaması Yapılıyor...
                </div>
              ) : isVerified ? (
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                  Öğrenci Doğrulandı! Giriş Başarılı
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  Giriş Yap & Doğrula
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: PROFILE PROFILE DETAILS FORM */
          <form onSubmit={handleSubmit} className="p-8 space-y-6 text-white">
            <div className="text-center space-y-1 mb-2">
              <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-black tracking-widest uppercase">
                Giriş Başarılı • Doğrulandı
              </span>
              <h2 className="text-lg font-black text-white italic tracking-wide">AŞAMA 2: PROFILINI TASARLA</h2>
              <p className="text-[11px] text-gray-400">Üniversiteli topluluk üyeleri seni nasıl görsün istersin?</p>
            </div>

            {error && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/15 p-4 rounded-xl text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            {/* Persona Avatar Selector */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Profil Görselin <span className="text-pink-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-2.5 sm:gap-4 justify-items-center">
                {AVATAR_PRESETS.map((src, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(src)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden aspect-square h-14 sm:h-18 w-14 sm:w-18 border-2 transition-all ${
                      avatar === src
                        ? "border-pink-500 scale-105"
                        : "border-transparent hover:scale-102"
                    }`}
                  >
                    <img src={src} alt={`Preset ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {avatar === src && (
                      <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                        <span className="bg-pink-500 text-white rounded-full p-1 shadow-sm">
                          <Heart className="w-3 h-3 fill-white" />
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Takma İsmin / Adın <span className="text-pink-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Örn: Melis, Can..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-500 text-white font-medium"
                />
              </div>

              {/* Gender Identity */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Cinsiyetin</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`py-3 text-xs rounded-2xl border text-center transition-all font-bold cursor-pointer ${
                      gender === "female"
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    👰 Kadın
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`py-3 text-xs rounded-2xl border text-center transition-all font-bold cursor-pointer ${
                      gender === "male"
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    🤵 Erkek
                  </button>
                </div>
              </div>
            </div>

            {/* Request Option 1: Yönelim / Gender Orientation selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                Aradığın Cinsiyet (Yönelim) <span className="text-pink-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPreferredGender("female")}
                  className={`py-3 text-xs rounded-xl border text-center transition-all font-bold cursor-pointer ${
                    preferredGender === "female"
                      ? "border-pink-500 bg-pink-500/10 text-white"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  👩 Kadınlar
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredGender("male")}
                  className={`py-3 text-xs rounded-xl border text-center transition-all font-bold cursor-pointer ${
                    preferredGender === "male"
                      ? "border-pink-500 bg-pink-500/10 text-white"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  👨 Erkekler
                </button>
                <button
                  type="button"
                  onClick={() => setPreferredGender("all")}
                  className={`py-3 text-xs rounded-xl border text-center transition-all font-bold cursor-pointer ${
                    preferredGender === "all"
                      ? "border-pink-500 bg-pink-500/10 text-white"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  🌈 Herkes
                </button>
              </div>
              <span className="text-[10px] text-gray-500 block">Sadece yönelimine uyan kampüslü insanları karşına çıkaracağız.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* University */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                  <GraduationCap className="w-4 h-4 text-pink-500" />
                  Üniversiten
                </label>
                <select
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-500 text-white font-medium"
                >
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Sınıfın</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-500 text-white font-medium"
                >
                  <option value="Hazırlık">Hazırlık Sınıfı</option>
                  <option value="1. Sınıf">1. Sınıf (Lisans)</option>
                  <option value="2. Sınıf">2. Sınıf (Lisans)</option>
                  <option value="3. Sınıf">3. Sınıf (Lisans)</option>
                  <option value="4. Sınıf">4. Sınıf (Lisans)</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
                </select>
              </div>
            </div>

            {/* Major */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-pink-550" />
                Bölümün
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-500 text-white font-medium"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Looking For */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-405 fill-pink-500/10 text-pink-400" />
                Burada Ne Arıyorsun?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {LOOKING_FOR_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setLookingFor(option)}
                    className={`py-2 px-1 text-xs rounded-xl border text-center transition-all font-bold cursor-pointer ${
                      lookingFor === option
                        ? "border-pink-500 bg-pink-500/10 text-white"
                        : "border-white/10 text-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Biyografin / Kendini Kısaca Tanıt <span className="text-pink-500">*</span></label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Örn: Hafta sonları gitar çalıp, vizelere kütüphanede sabahlayarak hazırlanıyorum. Kampüs kedilerini beslemek yaşam sevincim :)"
                maxLength={180}
                className="w-full bg-neutral-950 border border-white/10 rounded-2xl px-4 py-3 text-xs focus:outline-none focus:border-pink-500 text-white resize-none font-medium placeholder:text-gray-650"
              />
              <div className="text-right text-[10px] text-gray-500">
                {bio.length}/180 karakter
              </div>
            </div>

            {/* Hobbies / Interests Cloud */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                İlgi Alanların (En Fazla 5 Adet Seç) <span className="text-pink-400 font-bold">({selectedHobbies.length}/5)</span> <span className="text-pink-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {HOBBIES.map((hobby) => {
                  const isSelected = selectedHobbies.includes(hobby);
                  return (
                    <button
                      key={hobby}
                      type="button"
                      onClick={() => handleHobbyToggle(hobby)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all cursor-pointer font-bold ${
                        isSelected
                          ? "border-pink-500 bg-pink-500 text-white"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {hobby}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Row */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer transform active:scale-98 flex items-center justify-center gap-2 shadow-2xl shadow-pink-500/20"
              >
                <UserPlus className="w-5 h-5" />
                Kampüse Giriş Yap!
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
