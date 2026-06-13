import React, { useState } from "react";
import { CampusPost, UserProfile, CampusComment } from "../types";
import { MessageSquare, Heart, Send, Globe, Award, Sparkles, BookOpen } from "lucide-react";

interface CampusFeedProps {
  userProfile: UserProfile;
  posts: CampusPost[];
  onAddPost: (text: string) => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
}

export default function CampusFeed({
  userProfile,
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
}: CampusFeedProps) {
  const [newPostText, setNewPostText] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onAddPost(newPostText.trim());
    setNewPostText("");
  };

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const toggleCommentsView = (postId: string) => {
    setActiveCommentsPostId(activeCommentsPostId === postId ? null : postId);
  };

  return (
    <div id="campus-feed-root" className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full text-white">
      
      {/* LEFT: Feed content (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* CREATE POST INPUT PANEL */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
          {/* Subtle flare decoration */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1 px-2.5 bg-pink-500/10 text-pink-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-pink-500/20">
              Kampüs Panosu % Gossip
            </span>
            <span className="text-xs text-gray-400 italic">İtiraf et / Partner Ara</span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              rows={3}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Üniversitene fısılda... 'ODTÜ Kütüphane'de kahvesini döken çocuk...', 'İTÜ'de ders çalışacak vizeler için arkadaş...', 'Hacettepeli tıpçılar burada mı?'..."
              maxLength={250}
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl p-4 text-xs font-semibold text-white focus:outline-none focus:border-pink-500 placeholder:text-gray-500 resize-none"
            />
            
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-gray-500">
                {userProfile.university.split(" ")[0]} ({userProfile.major}) olarak yazıyorsun • {newPostText.length}/250
              </div>
              <button
                type="submit"
                disabled={!newPostText.trim()}
                className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white text-[10px] uppercase tracking-widest font-black rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-pink-500/10"
              >
                <Send className="w-3 h-3" />
                Yayınla
              </button>
            </div>
          </form>
        </div>

        {/* POSTS LIST */}
        <div id="posts-list-container" className="space-y-5">
          {posts.map((post) => {
            const isCommentsOpen = activeCommentsPostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md hover:border-white/15 transition-all"
              >
                {/* Post Author / Uni */}
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-wider rounded-lg">
                      {post.authorUniversity}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium ml-2 uppercase italic">
                      {post.authorMajor}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-500 italic">
                    {post.timestamp}
                  </span>
                </div>

                {/* Post content body */}
                <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4 whitespace-pre-wrap font-medium">
                  {post.text}
                </p>

                {/* Actions row */}
                <div className="flex items-center gap-5 border-t border-white/5 pt-4">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold leading-none cursor-pointer transition-colors ${
                      post.hasLiked ? "text-pink-500" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => toggleCommentsView(post.id)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-bold leading-none cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Yorumlar ({post.comments.length})</span>
                  </button>
                </div>

                {/* COMMENTS SECTION */}
                {isCommentsOpen && (
                  <div className="mt-5 pt-4 border-t border-white/5 space-y-3">
                    
                    {/* View existing comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-3 max-h-[180px] overflow-y-auto pr-2">
                        {post.comments.map((comm) => (
                          <div key={comm.id} className="bg-white/5 rounded-2xl p-3 border border-white/5">
                            <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                              <span>
                                {comm.university.split(" ")[0]} • {comm.major}
                              </span>
                              <span className="italic">{comm.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-200 leading-relaxed font-semibold">
                              {comm.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick send comments form */}
                    <form
                      onSubmit={(e) => handleCommentSubmit(post.id, e)}
                      className="flex gap-2 pt-2"
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        placeholder="Yorumunu yaz..."
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-full px-4 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-gray-500 font-medium"
                      />
                      <button
                        type="submit"
                        className="p-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all cursor-pointer"
                        title="Gönder"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Trends & Fun Info (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Global Stats */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-4 flex items-center gap-1">
            <Globe className="w-4 h-4 text-pink-400" />
            Genel Durum
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Aktif Öğrenci Sayısı</span>
              <span className="text-xs font-black italic text-green-400 block">● 5,241 Çevrimiçi</span>
            </div>
            
            <div className="h-[1px] bg-white/5"></div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Kampüs İtirafları</span>
              <span className="text-xs font-black italic block text-pink-300">842 Paylaşım</span>
            </div>

            <div className="h-[1px] bg-white/5"></div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Aktif Şehirler</span>
              <span className="text-xs text-gray-300 font-bold">Ankara, İstanbul, İzmir...</span>
            </div>
          </div>
        </div>

        {/* Tip / Warning board */}
        <div className="bg-gradient-to-br from-blue-600/10 to-pink-500/15 border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
          <div id="rule-badge" className="w-8 h-8 bg-pink-500/10 text-pink-400 rounded-full flex items-center justify-center border border-pink-500/20">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-black italic tracking-wide text-white mb-1.5">
              İletişim ve Güvenlik
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              KampüsMatch topluluk kurallarına uymak zorunludur. Saygılı ve dostça sohbetler her zaman yeşil ışığımızdır! Lütfen gizli bilgilerinizi hemen paylaşmayın.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
