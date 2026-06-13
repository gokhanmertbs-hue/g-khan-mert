import { useState, startTransition } from "react";
import { UserProfile, MatchUser, MatchSession, CampusPost, Message, CampusComment } from "./types";
import { INITIAL_MATCH_CANDIDATES, INITIAL_CAMPUS_POSTS } from "./data";
import ProfileSetup from "./components/ProfileSetup";
import Discover from "./components/Discover";
import CampusFeed from "./components/CampusFeed";
import ChatSection from "./components/ChatSection";
import ProfileView from "./components/ProfileView";
import { Flame, Sparkles, MessageCircle, User, Heart, Compass, LogOut, CheckCircle2 } from "lucide-react";

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    // Attempt local storage initialization to avoid loss of state on compile/refresh
    const saved = localStorage.getItem("kampusmatch_user_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<"discover" | "feed" | "messages" | "profile">("discover");
  
  // App-level simulated states
  const [candidates, setCandidates] = useState<MatchUser[]>(INITIAL_MATCH_CANDIDATES);
  const [posts, setPosts] = useState<CampusPost[]>(() => {
    const saved = localStorage.getItem("kampusmatch_posts_v1");
    return saved ? JSON.parse(saved) : INITIAL_CAMPUS_POSTS;
  });

  const [chatSessions, setChatSessions] = useState<MatchSession[]>(() => {
    const saved = localStorage.getItem("kampusmatch_sessions_v1");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Stats
  const [totalLikes, setTotalLikes] = useState<number>(() => {
    const saved = localStorage.getItem("kampusmatch_likes_count_v1");
    return saved ? parseInt(saved, 10) : 0;
  });

  // State Save Helper on updates
  const savePosts = (updatedPosts: CampusPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("kampusmatch_posts_v1", JSON.stringify(updatedPosts));
  };

  const saveSessions = (updatedSessions: MatchSession[]) => {
    setChatSessions(updatedSessions);
    localStorage.setItem("kampusmatch_sessions_v1", JSON.stringify(updatedSessions));
  };

  // Profile complete
  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem("kampusmatch_user_profile", JSON.stringify(profile));
  };

  const handleLogout = () => {
    if (window.confirm("Hesabından çıkış yapmak istediğine emin misin? Bilgilerin temizlenecektir.")) {
      setUserProfile(null);
      setChatSessions([]);
      setTotalLikes(0);
      localStorage.removeItem("kampusmatch_user_profile");
      localStorage.removeItem("kampusmatch_sessions_v1");
      localStorage.removeItem("kampusmatch_posts_v1");
      localStorage.removeItem("kampusmatch_likes_count_v1");
      setActiveTab("discover");
      setActiveSessionId(null);
    }
  };

  // Swiping likes candidate
  const handleLikeCandidate = (candidate: MatchUser) => {
    // Increment likes stat
    const newLikesCount = totalLikes + 1;
    setTotalLikes(newLikesCount);
    localStorage.setItem("kampusmatch_likes_count_v1", newLikesCount.toString());

    // Update candidates to mark as liked
    setCandidates((prev) => prev.filter((item) => item.id !== candidate.id));

    // If candidate likes us, create automatic conversation session
    if (candidate.likesMe) {
      // Check if session exists
      const exists = chatSessions.some((s) => s.matchId === candidate.id);
      if (!exists) {
        const newSession: MatchSession = {
          matchId: candidate.id,
          matchUser: candidate,
          messages: [],
          unread: true,
        };
        const updated = [newSession, ...chatSessions];
        saveSessions(updated);
      }
    }
  };

  // Super-Liking candidate (consumes 1 daily Super-Like)
  const handleSuperLikeCandidate = (candidate: MatchUser) => {
    if (!userProfile) return;

    const left = userProfile.superLikesLeft ?? 2;
    if (left <= 0) return;

    // Update candidates to reflect increased got count
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id
          ? { ...c, superLikesCount: (c.superLikesCount ?? 0) + 1 }
          : c
      )
    );

    // Update parent state
    const updatedProfile: UserProfile = {
      ...userProfile,
      superLikesLeft: Math.max(0, left - 1),
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("kampusmatch_user_profile", JSON.stringify(updatedProfile));

    // Force instantaneous Match
    handleLikeCandidate({
      ...candidate,
      superLikesCount: (candidate.superLikesCount ?? 0) + 1,
    });
  };

  // Disliking candidate
  const handleDislikeCandidate = (matchId: string) => {
    setCandidates((prev) => prev.filter((item) => item.id !== matchId));
  };

  // Trigger Chat navigation from Match Overlay inside Discover.tsx
  const handleStartChatFromDiscover = (matchUser: MatchUser) => {
    const existing = chatSessions.find((s) => s.matchId === matchUser.id);
    if (existing) {
      existing.unread = false;
      setActiveSessionId(matchUser.id);
      setActiveTab("messages");
    } else {
      const newSession: MatchSession = {
        matchId: matchUser.id,
        matchUser: matchUser,
        messages: [],
        unread: false,
      };
      const updated = [newSession, ...chatSessions];
      saveSessions(updated);
      setActiveSessionId(matchUser.id);
      setActiveTab("messages");
    }
  };

  // Send single message
  const handleSendMessage = (text: string) => {
    if (!activeSessionId) return;

    const updatedSessions = chatSessions.map((session) => {
      if (session.matchId === activeSessionId) {
        const newMessage: Message = {
          id: Math.random().toString(),
          sender: "user" as const,
          text: text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        return {
          ...session,
          messages: [...session.messages, newMessage],
          unread: false,
        };
      }
      return session;
    });

    saveSessions(updatedSessions);
  };

  // Campus Feed Interactions
  const handleAddPost = (text: string) => {
    if (!userProfile) return;
    const newPost: CampusPost = {
      id: "post_" + Date.now(),
      authorUniversity: userProfile.university,
      authorMajor: userProfile.major,
      text: text,
      timestamp: "Şimdi",
      likes: 0,
      hasLiked: false,
      comments: [],
    };
    savePosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !post.hasLiked,
        };
      }
      return post;
    });
    savePosts(updated);
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!userProfile) return;
    const newComment: CampusComment = {
      id: "comm_" + Date.now(),
      university: userProfile.university,
      major: userProfile.major,
      text: text,
      timestamp: "Şimdi",
    };

    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    savePosts(updated);
  };

  // If no profile yet, render Setup Screen
  if (!userProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} />;
  }

  const activeSession = chatSessions.find((s) => s.matchId === activeSessionId);
  const totalUnreadChats = chatSessions.filter((s) => s.unread).length;

  return (
    <div id="main-container bg-black" className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans relative overflow-x-hidden selection:bg-pink-500 selection:text-white pb-10">
      
      {/* GLOW DECORATIONS (Artistic Flair requirement) */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-pink-500/10 rounded-full blur-[110px] pointer-events-none"></div>
      <div className="absolute bottom-[20px] right-[-50px] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* WEB BAR NAVIGATION */}
      <nav className="relative z-25 flex flex-col sm:flex-row justify-between items-center px-6 sm:px-12 py-6 gap-4 border-b border-white/5 bg-neutral-950/40 backdrop-blur-md mb-8">
        
        {/* Brand logo */}
        <div className="text-3xl font-black tracking-tighter italic select-none">
          KAMPÜS<span className="text-pink-500">.</span>MATCH
        </div>

        {/* Tab links */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
          <button
            onClick={() => {
              setActiveTab("discover");
              setActiveSessionId(null);
            }}
            className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 ${
              activeTab === "discover" ? "text-white border-b-2 border-pink-500" : "hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Keşfet
          </button>

          <button
            onClick={() => {
              setActiveTab("feed");
              setActiveSessionId(null);
            }}
            className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 ${
              activeTab === "feed" ? "text-white border-b-2 border-pink-500" : "hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            İtiraf Panosu
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 relative ${
              activeTab === "messages" ? "text-white border-b-2 border-pink-500" : "hover:text-white"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Mesajlar
            {totalUnreadChats > 0 && (
              <span className="absolute -top-1.5 -right-3.5 px-1.5 py-0.5 bg-pink-500 text-[8px] text-white font-black rounded-full animate-bounce">
                {totalUnreadChats}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("profile");
              setActiveSessionId(null);
            }}
            className={`cursor-pointer pb-1 transition-all flex items-center gap-1.5 ${
              activeTab === "profile" ? "text-white border-b-2 border-pink-500" : "hover:text-white"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profilim
          </button>
        </div>

        {/* Logged in User Pill / Signout */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full select-none">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-300">
            {userProfile.name}
          </span>
          <button
            onClick={handleLogout}
            className="text-gray-450 hover:text-rose-400 cursor-pointer ml-1 p-0.5 rounded-full hover:bg-white/5 transition-colors"
            title="Hesabı Sıfırla / Çıkış Yap"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* CORE WRAPPER */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 md:px-12">
        {activeTab === "discover" && (
          <Discover
            userProfile={userProfile}
            candidates={candidates}
            onLike={handleLikeCandidate}
            onDislike={handleDislikeCandidate}
            onStartChat={handleStartChatFromDiscover}
            onSuperLike={handleSuperLikeCandidate}
          />
        )}

        {activeTab === "feed" && (
          <CampusFeed
            userProfile={userProfile}
            posts={posts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView
            userProfile={userProfile}
            totalLikes={totalLikes}
            totalChats={chatSessions.length}
          />
        )}

        {activeTab === "messages" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[580px]">
            {/* SESSIONS PICKER SIDE BAR (5 cols on md+) */}
            <div
              className={`md:col-span-4 bg-neutral-900 border border-white/10 rounded-3xl p-5 flex flex-col overflow-hidden ${
                activeSessionId ? "hidden md:flex" : "flex"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-4">
                <MessageCircle className="w-4 h-4 text-pink-500" />
                <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest">
                  Aktif Sohbetler ({chatSessions.length})
                </h3>
              </div>

              {chatSessions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 p-4">
                  <div className="w-12 h-12 bg-white/5 text-gray-400 rounded-full flex items-center justify-center mb-3">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider">Eşleşme Yok</p>
                  <p className="text-[10px] text-gray-400 max-w-[180px] leading-relaxed mt-1">
                    "Keşfet" sekmesine gidip diğer kampüslü öğrencileri beğenerek yeni bir eşleşme yakalayabilirsin!
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {chatSessions.map((session) => {
                    const isActive = session.matchId === activeSessionId;
                    const lastMsg = session.messages[session.messages.length - 1];

                    return (
                      <button
                        key={session.matchId}
                        onClick={() => {
                          startTransition(() => {
                            session.unread = false;
                            setActiveSessionId(session.matchId);
                          });
                        }}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 cursor-pointer ${
                          isActive
                            ? "bg-pink-500 border-pink-500 text-white"
                            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-300"
                        }`}
                      >
                        {/* Session Avatar */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={session.matchUser.avatar}
                            alt={session.matchUser.name}
                            className="w-11 h-11 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          {session.unread && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 border-2 border-neutral-900 rounded-full" />
                          )}
                        </div>

                        {/* Text and Last Message info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-xs truncate">
                              {session.matchUser.name}
                            </span>
                            <span className={`text-[8.5px] ${isActive ? "text-white/80" : "text-gray-500"} font-black`}>
                              {session.matchUser.university.split(" ")[0]}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate mt-0.5 ${isActive ? "text-white/80" : "text-gray-400"}`}>
                            {lastMsg ? lastMsg.text : "Henüz bir mesaj gönderilmedi."}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CHAT DISPLAY SECTION (7 cols on md+) */}
            <div
              className={`md:col-span-8 ${
                !activeSessionId ? "hidden md:flex" : "flex"
              } flex-col h-full`}
            >
              {activeSession ? (
                <ChatSection
                  userProfile={userProfile}
                  session={activeSession}
                  onSendMessage={handleSendMessage}
                  onBack={() => setActiveSessionId(null)}
                />
              ) : (
                <div className="flex-1 bg-neutral-900 border border-white/10 rounded-3xl flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-white/5 text-pink-500 rounded-full flex items-center justify-center mb-4 border border-white/10">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black italic tracking-wide text-white uppercase mb-2">
                    Mesajlaşma Paneli
                  </h4>
                  <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                    Soldaki aktif eşleşmelerinden birini seçerek anında yapay zeka üniversiteli sohbet simülatörünü başlat!
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-15 mt-16 px-6 sm:px-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-bold tracking-[0.25em] uppercase gap-4">
        <div>KampüsMatch • 5,241 Üniversiteli Çevrimiçi</div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <span>İstanbul</span>
          <span>Ankara</span>
          <span>İzmir</span>
          <span>Eskişehir</span>
        </div>
      </footer>
    </div>
  );
}
