import { UserProfile } from "../types";
import { GraduationCap, Award, BookOpen, Heart, MessageSquare, Star } from "lucide-react";

interface ProfileViewProps {
  userProfile: UserProfile;
  totalLikes: number;
  totalChats: number;
}

export default function ProfileView({
  userProfile,
  totalLikes,
  totalChats,
}: ProfileViewProps) {
  return (
    <div id="profile-view-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full text-white">
      
      {/* LEFT PANEL: Huge avatar framing (5 cols) */}
      <div className="lg:col-span-5 flex flex-col justify-center items-center">
        <div className="relative w-full max-w-[340px] group">
          
          {/* Circular picture frame */}
          <div className="aspect-square rounded-[40px] overflow-hidden border border-white/20 relative shadow-2xl bg-neutral-900">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            {/* Visual fade shield */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
            
            <div className="absolute bottom-6 left-6 z-20">
              <span className="px-2.5 py-0.5 bg-green-500/90 text-white text-[10px] font-black uppercase tracking-widest rounded-full italic block w-max mb-1.5 shadow-md">
                🎓 DOĞRULANMIŞ ÖĞRENCİ
              </span>
              <h2 className="text-3xl font-black italic tracking-tighter text-white">
                {userProfile.name}, 21
              </h2>
            </div>
          </div>

          {/* Sparkly corner emblem */}
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg border border-white/10 animate-pulse">
            <Star className="w-5 h-5 fill-current text-white" />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Details & stats list (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-center gap-6">
        
        {/* College Bio Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-md">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-blue-500/20">
              <GraduationCap className="w-3.5 h-3.5" />
              {userProfile.university}
            </span>
            <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider">
              {userProfile.year}
            </span>
          </div>

          <h3 className="text-lg font-black italic text-pink-500 uppercase tracking-widest mb-1">
            {userProfile.major}
          </h3>
          
          <div className="h-[1px] bg-white/5 my-4"></div>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                Biyografi
              </span>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                "{userProfile.bio || "Henüz bir şey eklenmemiş. Kendini Tanıt!"}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                  Aradığı
                </span>
                <span className="text-xs text-rose-300 font-bold block bg-white/5 py-1.5 px-3 rounded-xl border border-white/5 w-max">
                  🎯 {userProfile.lookingFor}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-1">
                  Cinsiyetin & Yönelimin
                </span>
                <p className="text-xs text-gray-300">
                  Cinsiyet: <strong className="text-white">{userProfile.gender === "female" ? "👩 Kadın" : "👨 Erkek"}</strong>
                </p>
                <p className="text-[11px] text-pink-400 mt-0.5">
                  Yönelim: <strong className="text-pink-300 font-bold">{userProfile.preferredGender === "female" ? "👩 Kadınlar" : userProfile.preferredGender === "male" ? "👨 Erkekler" : "🌈 Herkes"}</strong>
                </p>
              </div>
            </div>

            <div className="bg-neutral-950/40 p-4 rounded-2xl border border-white/5 space-y-2">
              <span className="text-[9px] text-green-400 font-black tracking-widest block uppercase">
                🔒 AKADEMİK YÖKSİS DOĞRULAMA DETAYLARI
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-500 block">Öğrenci E-postası</span>
                  <span className="text-gray-300 font-semibold font-mono break-all">{userProfile.studentEmail || "dogrulanmadi@edu.tr"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">YÖKSİS Kayıt ID</span>
                  <span className="text-gray-300 font-semibold font-mono">{userProfile.studentId || "220104030"}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest block mb-2">
                İlgi Alanlarım
              </span>
              <div className="flex flex-wrap gap-1.5">
                {userProfile.hobbies.map((h, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-white/10 text-white/95 border border-white/5 px-2.5 py-1 rounded-full font-semibold"
                  >
                    #{h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Achievements Stats */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Like stat */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-pink-500/20 transition-all">
            <span className="w-10 h-10 bg-pink-500/10 text-pink-400 rounded-xl flex items-center justify-center border border-pink-500/20">
              <Heart className="w-5 h-5 fill-current" />
            </span>
            <div>
              <p className="text-lg font-black text-white">{totalLikes}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Beğendiğin Kişi</p>
            </div>
          </div>

          {/* Conversations stat */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-pink-500/20 transition-all">
            <span className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <p className="text-lg font-black text-white">{totalChats}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Aktif Sohbetler</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
