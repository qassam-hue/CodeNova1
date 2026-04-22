import { useState, useRef, useEffect } from "react";

const USERS = {
  Qassam: { color: "#00f5d4", avatar: "QA" },
  "Nourhan Hassouna": { color: "#f72585", avatar: "NH" },
  "محمد نزار زيادة": { color: "#ffd60a", avatar: "MN" },
};

const initialMessages = [
  { id: 1, type: "system", text: "🚀 مرحبا بتيم CodeNova" },
  { id: 2, type: "join", user: "Qassam" },
  { id: 3, type: "join", user: "Nourhan Hassouna" },
  { id: 4, type: "join", user: "محمد نزار زيادة" },
];

function formatTime(date) {
  return date.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });
}

export default function CodeNovaChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [currentUser] = useState("Qassam");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      type: "message",
      user: currentUser,
      text: input.trim(),
      time: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.root}>
      {/* Sidebar */}
      <div style={{ ...styles.sidebar, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={styles.sidebarHeader}>
          <span style={styles.logo}>[CodeNova]</span>
          <button style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <div style={styles.sidebarSection}>الأعضاء النشطون</div>
        {Object.entries(USERS).map(([name, u]) => (
          <div key={name} style={styles.memberRow}>
            <div style={{ ...styles.avatarSmall, background: u.color + "33", color: u.color, border: `1px solid ${u.color}66` }}>
              {u.avatar}
            </div>
            <div>
              <div style={styles.memberName}>{name}</div>
              <div style={styles.memberStatus}>● نشط</div>
            </div>
          </div>
        ))}
        <div style={styles.sidebarSection}>القنوات</div>
        <div style={styles.channelRow}>
          <span style={{ color: "#00f5d4" }}>#</span> دردشة-التيم
        </div>
        <div style={{ ...styles.channelRow, opacity: 0.4 }}>
          <span>#</span> عام
        </div>
      </div>
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
            <div style={styles.userBadge}>
              <div style={{ ...styles.avatar, background: USERS[currentUser].color + "22", color: USERS[currentUser].color, border: `1.5px solid ${USERS[currentUser].color}` }}>
                {USERS[currentUser].avatar}
              </div>
              <span style={styles.userName}>{currentUser}</span>
            </div>
          </div>
          <span style={styles.logo}>[CodeNova]</span>
        </div>

        {/* Channel bar */}
        <div style={styles.channelBar}>
          <span style={styles.fireIcon}>🔥</span>
          <span style={styles.firebaseLabel}>Firebase</span>
          <div style={styles.channelTitle}>
            <span style={styles.onlineDot} />
            دردشة التيم — Real-time
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messages}>
          {messages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} style={styles.systemMsg}>
                  <div style={styles.systemLine} />
                  <span>{msg.text}</span>
                  <div style={styles.systemLine} />
                </div>
              );
            }
            if (msg.type === "join") {
              const u = USERS[msg.user];
              return (
                <div key={msg.id} style={styles.joinMsg}>
                  🎉 <span style={{ color: u?.color }}>{msg.user}</span> انضم لتيم CodeNova!
                </div>
              );
            }
            const u = USERS[msg.user];
            const isMe = msg.user === currentUser;
            return (
              <div key={msg.id} style={{ ...styles.msgRow, flexDirection: isMe ? "row-reverse" : "row" }}>
                <div style={{ ...styles.avatar, background: u?.color + "22", color: u?.color, border: `1.5px solid ${u?.color}66`, flexShrink: 0 }}>
                  {u?.avatar}
                </div>
                <div style={{ maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start", gap: 3 }}>
                  <div style={{ ...styles.msgMeta, flexDirection: isMe ? "row-reverse" : "row" }}>
                    <span style={{ ...styles.msgUser, color: u?.color }}>{msg.user}</span>
                    <span style={styles.msgTime}>{formatTime(msg.time)}</span>
                  </div>
                  <div style={{ ...styles.bubble, background: isMe ? u?.color + "18" : "#ffffff0a", border: `1px solid ${isMe ? u?.color + "44" : "#ffffff11"}`, borderRadius: isMe ? "18px 4px 18px 18px" : "4px 18px 18px 18px" }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={styles.inputArea}>
          <div style={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اكتب رسالة..."
              style={styles.textarea}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{ ...styles.sendBtn, opacity: input.trim() ? 1 : 0.4, cursor: input.trim() ? "pointer" : "default" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div style={styles.inputHint}>Enter للإرسال · Shift+Enter لسطر جديد</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  root: {
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    direction: "rtl",
    background: "#0a0a0f",
    minHeight: "100vh",
    display: "flex",
    color: "#e2e8f0",
    position: "relative",
    overflow: "hidden",
  },
  sidebar: {
    position: "fixed",
    top: 0, right: 0,
    width: 260,
    height: "100%",
    background: "#0f0f1a",
    borderLeft: "1px solid #1e1e3a",
    zIndex: 100,
    transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
    padding: "0 0 20px",
    overflowY: "auto",
  },
  sidebarHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 16px", borderBottom: "1px solid #1e1e3a",
  },
  closeBtn: {
    background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 18,
  },
  overlay: {
    position: "fixed", inset: 0, background: "#00000088", zIndex: 99,
  },
  sidebarSection: {
    padding: "16px 16px 8px", fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: 1,
  },
  memberRow: {
    display: "flex", alignItems: "center", gap: 10, padding: "8px 16px", cursor: "pointer",
  },
  avatarSmall: {
    width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 700,
  },
  memberName: { fontSize: 13, fontWeight: 500 },
  memberStatus: { fontSize: 11, color: "#00f5d4", opacity: 0.7 },
  channelRow: {
    display: "flex", alignItems: "center", gap: 8, padding: "7px 16px", fontSize: 13,
    color: "#aaa", cursor: "pointer",
  },
  main: {
    flex: 1, display: "flex", flexDirection: "column", height: "100vh",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 16px", background: "#0d0d18", borderBottom: "1px solid #1a1a2e",
    position: "sticky", top: 0, zIndex: 10,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 10 },
  menuBtn: {
    background: "none", border: "1px solid #1e1e3a", color: "#aaa",
    borderRadius: 8, width: 36, height: 36, cursor: "pointer", fontSize: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  userBadge: {
    display: "flex", alignItems: "center", gap: 8,
    background: "#ffffff08", borderRadius: 20, padding: "4px 12px 4px 4px",
    border: "1px solid #ffffff11",
  },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 800,
  },
  userName: { fontSize: 13, fontWeight: 600 },
  logo: { fontSize: 18, fontWeight: 800, color: "#a855f7", letterSpacing: -0.5 },
  channelBar: {
    display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
    background: "#0d0d18", borderBottom: "1px solid #1a1a2e",
    fontSize: 13,
  },
  fireIcon: { fontSize: 16 },
  firebaseLabel: { color: "#f97316", fontSize: 12, fontWeight: 600 },
  channelTitle: {
    marginRight: "auto", fontWeight: 700, fontSize: 14, color: "#e2e8f0",
    display: "flex", alignItems: "center", gap: 6,
  },
  onlineDot: {
    width: 8, height: 8, borderRadius: "50%", background: "#22c55e",
    boxShadow: "0 0 6px #22c55e",
  },
  messages: {
    flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex",
    flexDirection: "column", gap: 8,
  },
  systemMsg: {
    display: "flex", alignItems: "center", gap: 10, color: "#555",
    fontSize: 12, margin: "8px 0",
  },
  systemLine: { flex: 1, height: 1, background: "#1e1e3a" },
  joinMsg: {
    textAlign: "center", fontSize: 13, color: "#888",
    background: "#ffffff05", borderRadius: 8, padding: "6px 12px",
    border: "1px solid #ffffff08",
  },
  msgRow: {
    display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 4,
  },
  msgMeta: {
    display: "flex", alignItems: "center", gap: 6,
  },
  msgUser: { fontSize: 12, fontWeight: 700 },
  msgTime: { fontSize: 11, color: "#555" },
  bubble: {
    padding: "9px 14px", fontSize: 14, lineHeight: 1.5,
    wordBreak: "break-word",
  },
  inputArea: {
    padding: "12px 16px 16px", background: "#0d0d18", borderTop: "1px solid #1a1a2e",
  },
  inputWrapper: {
    display: "flex", alignItems: "flex-end", gap: 8,
    background: "#ffffff08", borderRadius: 14, padding: "8px 8px 8px 14px",
    border: "1px solid #ffffff12",
  },
  textarea: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#e2e8f0", fontSize: 14, lineHeight: 1.5, resize: "none",
    fontFamily: "inherit", direction: "rtl", maxHeight: 120,
  },
  sendBtn: {
    background: "linear-gradient(135deg, #a855f7, #6366f1)",
    border: "none", color: "#fff", borderRadius: 10,
    width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, transition: "opacity 0.2s",
  },
  inputHint: {
    fontSize: 11, color: "#444", textAlign: "center", marginTop: 6,
  },
};
