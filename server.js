import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = path.resolve('database.json');

const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], stats: {} }));
  }
};

const getDB = () => {
  initDB();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};

const saveDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// Start DB
initDB();

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  const db = getDB();
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Email already exists. Please login instead." });
  }
  db.users.push({ name, email, password });
  if (db.stats[name] === undefined) {
    db.stats[name] = { tokens: 0, sessions: [], profilePic: null };
  }
  saveDB(db);
  const userStats = db.stats[name];
  res.json({ success: true, name, tokens: userStats.tokens, sessions: userStats.sessions, profilePic: userStats.profilePic });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const db = getDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const statsEntry = db.stats[user.name];
    
    // Normalise to structure
    if (statsEntry === undefined || typeof statsEntry !== 'object') {
      db.stats[user.name] = { tokens: (typeof statsEntry === 'number' ? statsEntry : 0), sessions: [], profilePic: null };
      saveDB(db);
    }
    
    const userStats = db.stats[user.name];
    // Final Type Insurance
    if (typeof userStats.tokens !== 'number') userStats.tokens = 0;
    if (!Array.isArray(userStats.sessions)) userStats.sessions = [];
    
    res.json({ success: true, name: user.name, tokens: userStats.tokens, sessions: userStats.sessions, profilePic: userStats.profilePic });
  } else {
    res.status(401).json({ error: "Account not found or incorrect password. Try signing up!" });
  }
});

app.post('/api/social-login', (req, res) => {
  const { name } = req.body;
  const db = getDB();
  
  if (db.stats[name] === undefined || typeof db.stats[name] !== 'object') {
    db.stats[name] = { 
      tokens: (typeof db.stats[name] === 'number' ? db.stats[name] : 0), 
      sessions: [], 
      profilePic: null 
    };
    saveDB(db);
  }
  
  const userStats = db.stats[name];
  if (typeof userStats.tokens !== 'number') userStats.tokens = 0;
  if (!Array.isArray(userStats.sessions)) userStats.sessions = [];

  res.json({ success: true, name, tokens: userStats.tokens, sessions: userStats.sessions, profilePic: userStats.profilePic });
});

app.post('/api/update-tokens', (req, res) => {
  const { name, tokensAdded, session } = req.body;
  const db = getDB();
  
  // Guard against non-existent stats entry
  if (db.stats[name] === undefined || typeof db.stats[name] !== 'object') {
    db.stats[name] = { tokens: 0, sessions: [], profilePic: null };
  }
  
  // Ensure we have a valid object with fields
  const userStats = db.stats[name];
  if (typeof userStats.tokens !== 'number') userStats.tokens = 0;
  if (!Array.isArray(userStats.sessions)) userStats.sessions = [];
  if (userStats.profilePic === undefined) userStats.profilePic = null;

  // Add the tokens safely
  const tAdd = parseInt(tokensAdded) || 0;
  userStats.tokens += tAdd;

  if (session) {
    userStats.sessions.unshift(session);
    db.stats[name].sessions = userStats.sessions.slice(0, 10);
  }
  
  saveDB(db);
  res.json({ success: true, newTotal: userStats.tokens, sessions: userStats.sessions });
});

app.post('/api/update-profile-pic', (req, res) => {
  const { name, profilePic } = req.body;
  const db = getDB();
  if (db.stats[name]) {
    db.stats[name].profilePic = profilePic;
    saveDB(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get('/api/stats/:name', (req, res) => {
  const db = getDB();
  const userStats = typeof db.stats[req.params.name] === 'number'
    ? { tokens: db.stats[req.params.name], sessions: [], profilePic: null }
    : (db.stats[req.params.name] || { tokens: 0, sessions: [], profilePic: null });
  res.json(userStats);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`EcoAI Local Database running on http://localhost:${PORT}`);
});
