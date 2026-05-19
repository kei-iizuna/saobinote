import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ── カテゴリ定義 ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "植物",    icon: "🌿", color: "#2d6a4f", bg: "#d4edda" },
  { id: "昆虫",    icon: "🐛", color: "#856404", bg: "#fff3cd" },
  { id: "鳥・動物", icon: "🐦", color: "#1a4971", bg: "#dce8f5" },
  { id: "きのこ",  icon: "🍄", color: "#6a1b9a", bg: "#e8d5f5" },
  { id: "その他",  icon: "✨", color: "#555",    bg: "#f0ece3" },
];

const getCat = (id) => CATEGORIES.find(c => c.id === id) || CATEGORIES[4];

// ── スタイル定数 ──────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#f5f2eb",
    fontFamily: "'Noto Serif JP', Georgia, serif",
    color: "#2c2c1e",
  },
  header: {
    background: "linear-gradient(160deg, #1a3a2a 0%, #2d5a3d 60%, #3d7a52 100%)",
    padding: "20px 18px 16px",
    position: "relative",
    overflow: "hidden",
  },
  headerTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 900,
    color: "#fff",
    letterSpacing: 2,
  },
  headerSub: {
    margin: "4px 0 0",
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1,
  },
  card: {
    background: "#fff",
    borderRadius: 14,
    padding: "16px",
    marginBottom: 10,
    border: "1px solid #e8e2d8",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  btn: (bg, color) => ({
    background: bg,
    color: color || "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  }),
};

// ── 認証画面 ──────────────────────────────────────────────────────────────
function AuthScreen() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [mode,     setMode]     = useState("login"); // login | signup
  const [loading,  setLoading]  = useState(false);
  const [status,   setStatus]   = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setStatus("⚠️ メールとパスワードを入力してください"); return; }
    setLoading(true); setStatus("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatus("❌ " + error.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password || !name) { setStatus("⚠️ すべての項目を入力してください"); return; }
    setLoading(true); setStatus("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setStatus("❌ " + error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, name });
      setStatus("✅ 登録完了！メールを確認してログインしてください。");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#1a3a2a,#2d5a3d,#3d7a52)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        {/* ロゴ */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 8 }}>🌿</div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 3 }}>さおびノート</h1>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,255,255,0.7)", letterSpacing: 2 }}>然帯農法 観察記録</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 20, padding: "28px 24px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          {/* モード切替 */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {[{ id: "login", label: "ログイン" }, { id: "signup", label: "新規登録" }].map(m => (
              <button key={m.id} onClick={() => { setMode(m.id); setStatus(""); }}
                style={{ flex: 1, padding: "9px", borderRadius: 10, border: "2px solid", borderColor: mode === m.id ? "#2d5a3d" : "#e0d8cc", background: mode === m.id ? "#2d5a3d" : "#fff", color: mode === m.id ? "#fff" : "#888", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                {m.label}
              </button>
            ))}
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>お名前</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="例：飯綱 恵"
                style={{ width: "100%", border: "1.5px solid #c8e6c9", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>メールアドレス</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="example@mail.com"
              style={{ width: "100%", border: "1.5px solid #c8e6c9", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>パスワード</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="6文字以上"
              style={{ width: "100%", border: "1.5px solid #c8e6c9", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>

          {status && (
            <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 10, background: status.startsWith("✅") ? "#f0fdf4" : "#fef2f2", fontSize: 12, fontWeight: 600, color: status.startsWith("✅") ? "#2d5a3d" : "#dc2626" }}>
              {status}
            </div>
          )}

          <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading}
            style={{ ...S.btn(loading ? "#aaa" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)"), width: "100%", padding: "13px", fontSize: 14, letterSpacing: 1, borderRadius: 12 }}>
            {loading ? "処理中..." : mode === "login" ? "ログイン" : "登録する"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 観察投稿フォーム ──────────────────────────────────────────────────────
function PostForm({ user, profile, onPosted }) {
  const [category,  setCategory]  = useState("植物");
  const [species,   setSpecies]   = useState("");
  const [memo,      setMemo]      = useState("");
  const [location,  setLocation]  = useState("");
  const [photo,     setPhoto]     = useState(null);
  const [photoURL,  setPhotoURL]  = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [status,    setStatus]    = useState("");

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true); setStatus("");
    let photoStorageUrl = null;

    // 写真アップロード
    if (photo) {
      const ext  = photo.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("observation-photos")
        .upload(path, photo);
      if (uploadError) { setStatus("❌ 写真のアップロードに失敗しました"); setLoading(false); return; }
      const { data: urlData } = supabase.storage.from("observation-photos").getPublicUrl(path);
      photoStorageUrl = urlData.publicUrl;
    }

    // 記録を保存
    const { error } = await supabase.from("observations").insert({
      user_id:       user.id,
      category,
      species_name:  species || null,
      memo:          memo || null,
      photo_url:     photoStorageUrl,
      location_name: location || null,
    });

    if (error) { setStatus("❌ 保存に失敗しました: " + error.message); }
    else {
      setStatus("✅ 記録しました！");
      setSpecies(""); setMemo(""); setLocation(""); setPhoto(null); setPhotoURL(null);
      setTimeout(() => { setStatus(""); onPosted(); }, 1000);
    }
    setLoading(false);
  };

  return (
    <div style={{ ...S.card, border: "1.5px solid #c8e6c9" }}>
      <div style={{ fontWeight: 800, fontSize: 14, color: "#1a3a2a", marginBottom: 14 }}>🌱 新しい観察を記録する</div>

      {/* カテゴリ */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 6 }}>カテゴリ</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => setCategory(cat.id)}
              style={{ padding: "6px 12px", borderRadius: 20, border: "1.5px solid", borderColor: category === cat.id ? cat.color : "#ddd", background: category === cat.id ? cat.bg : "#fff", color: category === cat.id ? cat.color : "#888", fontSize: 12, fontWeight: category === cat.id ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>
              {cat.icon} {cat.id}
            </button>
          ))}
        </div>
      </div>

      {/* 種名 */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>種名 <span style={{ fontWeight: 400, color: "#aaa" }}>（不明でもOK）</span></div>
        <input value={species} onChange={e => setSpecies(e.target.value)} placeholder="例：タンポポ、モンシロチョウ..."
          style={{ width: "100%", border: "1.5px solid #e0d8cc", borderRadius: 10, padding: "9px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      {/* 場所 */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>場所</div>
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="例：北側エリア、果樹ゾーン..."
          style={{ width: "100%", border: "1.5px solid #e0d8cc", borderRadius: 10, padding: "9px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>

      {/* メモ */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>メモ</div>
        <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder="気づいたことを自由に..."
          rows={3}
          style={{ width: "100%", border: "1.5px solid #e0d8cc", borderRadius: 10, padding: "9px 12px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box", resize: "vertical" }} />
      </div>

      {/* 写真 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", marginBottom: 5 }}>写真</div>
        <label style={{ display: "inline-block", padding: "8px 16px", borderRadius: 10, border: "1.5px dashed #c8e6c9", background: "#f0fdf4", color: "#2d5a3d", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
          📷 写真を選ぶ
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />
        </label>
        {photoURL && (
          <div style={{ marginTop: 8 }}>
            <img src={photoURL} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10 }} />
          </div>
        )}
      </div>

      {status && (
        <div style={{ marginBottom: 12, padding: "10px 14px", borderRadius: 10, background: status.startsWith("✅") ? "#f0fdf4" : "#fef2f2", fontSize: 12, fontWeight: 600, color: status.startsWith("✅") ? "#2d5a3d" : "#dc2626" }}>
          {status}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        style={{ ...S.btn(loading ? "#aaa" : "linear-gradient(135deg,#1a3a2a,#2d5a3d)"), width: "100%", padding: "12px", fontSize: 14, borderRadius: 12 }}>
        {loading ? "保存中..." : "📝 記録する"}
      </button>
    </div>
  );
}

// ── 観察カード ────────────────────────────────────────────────────────────
function ObservationCard({ obs, profiles }) {
  const cat     = getCat(obs.category);
  const poster  = profiles[obs.user_id];
  const dateStr = new Date(obs.observed_at).toLocaleDateString("ja-JP", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ ...S.card, borderLeft: `4px solid ${cat.color}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>{cat.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: cat.color }}>
              {obs.species_name || "（種名不明）"}
            </div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{obs.category}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#2d5a3d", fontWeight: 600 }}>{poster?.name || "..."}</div>
          <div style={{ fontSize: 10, color: "#bbb" }}>{dateStr}</div>
        </div>
      </div>

      {obs.photo_url && (
        <img src={obs.photo_url} alt={obs.species_name} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, marginBottom: 8 }} />
      )}

      {obs.location_name && (
        <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>📍 {obs.location_name}</div>
      )}
      {obs.memo && (
        <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>{obs.memo}</div>
      )}
    </div>
  );
}

// ── 統計パネル ────────────────────────────────────────────────────────────
function StatsPanel({ observations }) {
  const catCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: observations.filter(o => o.category === cat.id).length,
  }));
  const total   = observations.length;
  const species = new Set(observations.filter(o => o.species_name).map(o => o.species_name)).size;

  return (
    <div style={{ ...S.card, background: "linear-gradient(135deg,#1a3a2a,#2d5a3d)", border: "none" }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 12, letterSpacing: 1 }}>生態系の記録</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{total}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>総観察数</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px", textAlign: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{species}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>確認種数</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {catCounts.filter(c => c.count > 0).map(cat => (
          <div key={cat.id} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "#fff", fontWeight: 600 }}>
            {cat.icon} {cat.id} {cat.count}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── メインアプリ ──────────────────────────────────────────────────────────
export default function App() {
  const [session,      setSession]      = useState(null);
  const [profile,      setProfile]      = useState(null);
  const [observations, setObservations] = useState([]);
  const [profiles,     setProfiles]     = useState({});
  const [view,         setView]         = useState("timeline"); // timeline | post
  const [loading,      setLoading]      = useState(true);

  // 認証状態の監視
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // プロフィール取得
  useEffect(() => {
    if (!session) return;
    supabase.from("profiles").select("*").eq("id", session.user.id).single()
      .then(({ data }) => setProfile(data));
  }, [session]);

  // 観察記録の取得
  const fetchObservations = async () => {
    const { data } = await supabase.from("observations")
      .select("*")
      .order("observed_at", { ascending: false })
      .limit(50);
    if (data) setObservations(data);

    // 投稿者プロフィールを一括取得
    const userIds = [...new Set(data?.map(o => o.user_id) || [])];
    if (userIds.length > 0) {
      const { data: profileData } = await supabase.from("profiles").select("*").in("id", userIds);
      if (profileData) {
        const map = {};
        profileData.forEach(p => { map[p.id] = p; });
        setProfiles(map);
      }
    }
  };

  useEffect(() => {
    if (!session) return;
    fetchObservations();

    // リアルタイム購読
    const channel = supabase.channel("observations")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "observations" }, () => {
        fetchObservations();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setObservations([]);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#1a3a2a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#fff", fontSize: 14, fontFamily: "'Noto Serif JP', serif" }}>読み込み中...</div>
    </div>
  );

  if (!session) return <AuthScreen />;

  return (
    <div style={S.app}>
      {/* ヘッダー */}
      <div style={S.header}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={S.headerTitle}>🌿 さおびノート</h1>
              <p style={S.headerSub}>然帯農法 観察記録 ／ {profile?.name || ""}</p>
            </div>
            <button onClick={handleLogout}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "5px 12px", color: "rgba(255,255,255,0.8)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              ログアウト
            </button>
          </div>
        </div>
      </div>

      {/* ナビ */}
      <div style={{ display: "flex", borderBottom: "2px solid #e0d8cc", background: "#faf8f3" }}>
        {[{ id: "timeline", label: "タイムライン", icon: "📋" }, { id: "post", label: "記録する", icon: "✏️" }].map(tab => (
          <button key={tab.id} onClick={() => setView(tab.id)}
            style={{ flex: 1, padding: "13px 4px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: view === tab.id ? 800 : 500, color: view === tab.id ? "#2d5a3d" : "#888", borderBottom: view === tab.id ? "3px solid #2d5a3d" : "3px solid transparent", fontFamily: "inherit" }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* コンテンツ */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "14px 12px 40px" }}>

        {view === "timeline" && (
          <div>
            <StatsPanel observations={observations} />
            {observations.length === 0 ? (
              <div style={{ ...S.card, textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1a3a2a", marginBottom: 8 }}>まだ観察記録がありません</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>「記録する」から最初の観察を追加してください</div>
                <button onClick={() => setView("post")}
                  style={{ ...S.btn("linear-gradient(135deg,#1a3a2a,#2d5a3d)"), marginTop: 16, padding: "10px 24px", borderRadius: 20 }}>
                  記録する →
                </button>
              </div>
            ) : (
              <div>
                {observations.map(obs => (
                  <ObservationCard key={obs.id} obs={obs} profiles={profiles} />
                ))}
              </div>
            )}
          </div>
        )}

        {view === "post" && (
          <PostForm
            user={session.user}
            profile={profile}
            onPosted={() => { fetchObservations(); setView("timeline"); }}
          />
        )}

      </div>
    </div>
  );
}
