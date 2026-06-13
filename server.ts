import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Initialize Gemini SDK
// Note: We use lazy initialization/checks as described in guidelines to avoid crushing if the key is missing.
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Chat generation with Gemini simulating key university personalities
app.post("/api/chat", async (req: express.Request, res: express.Response) => {
  try {
    const { userProfile, matchUser, messages } = req.body;

    if (!userProfile || !matchUser || !messages || !Array.isArray(messages)) {
       res.status(400).json({ error: "Missing required parameters: userProfile, matchUser, or messages." });
       return;
    }

    const ai = getGeminiClient();

    // Map existing message format to Gemini's role structure
    // Gemini roles must be 'user' or 'model'
    const formattedContents = messages.map((msg: { sender: string; text: string }) => {
      return {
        role: msg.sender === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      };
    });

    const systemInstruction = `Sen gerçek bir Türk üniversite öğrencisisin ve bir dating (eşleşme) uygulamasında eşleştiğin biriyle sohbet ediyorsun. 
Kendi karakter ve üniversite bilgilerin:
- İsim: ${matchUser.name}
- Üniversite: ${matchUser.university}
- Bölüm: ${matchUser.major}
- Biyografi: ${matchUser.bio}
- İlgi Alanları: ${matchUser.hobbies ? matchUser.hobbies.join(", ") : "Bilgi yok"}
- Kişilik Tarzı: ${matchUser.personality || "Hafif flörtöz, eğlenceli ve arkadaş canlısı"}

Eşleştiğin kullanıcının bilgileri:
- İsim: ${userProfile.name}
- Üniversite: ${userProfile.university}
- Bölüm: ${userProfile.major}
- Biyografi: ${userProfile.bio}
- İlgi Alanları: ${userProfile.hobbies ? userProfile.hobbies.join(", ") : "Bilgi yok"}

TALİMATLAR:
1. Kesinlikle bir yapay zeka olduğunu söyleme. Karakterinden asla çıkma.
2. Mesajlarında samimi, doğal, genç ve dinamik bir Türkçe kullan.
3. Üniversite hayatından terimler kat (vizeler, finaller, kahve, çimler, kütüphane, ders kaydı, bütler, rüt vs.).
4. Karşındakinin üniversitesi, bölümü veya hobileriyle ilgili sorular sor ya da eğlenceli yorumlar yap. (Örneğin ODTÜ'lü biri olarak Boğaziçi'li birine Ankara-İstanbul şakası yapabilirsin, ya da Tıp okuyan birine uykusuzlukla ilgili espri yapabilirsin).
5. Mesajların kısa, akıcı ve bir dating uygulamasındaki gibi hızlı okunabilir olsun (en fazla 1-3 cümle).
6. Samimi ve flörtöz olabilirsin ama her zaman saygılı ve arkadaş canlısı kal.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
      },
    });

    const replyText = response.text || "Pardon, vizeler yüzünden kafam biraz doluydu. Ne diyorduk? :)";
    res.json({ text: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: "Yapay zeka eşleşme yanıtı alınırken bir hata oluştu.", 
      details: error.message 
    });
  }
});

// Check Environment configuration (to let client fallback gracefully if GEMINI_API_KEY is not set)
app.get("/api/config-check", (req: express.Request, res: express.Response) => {
  res.json({
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// ----------------------------------------------------
// VITE OR STATIC FILE SERVING
// ----------------------------------------------------

async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode: serving built assets from 'dist'
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KampüsMatch Server]: Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

setupServer();
