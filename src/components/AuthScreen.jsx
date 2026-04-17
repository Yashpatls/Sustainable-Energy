import React, { useState } from 'react';
import { Leaf, ShieldAlert, UserPlus, ArrowRight, User, Mail, Lock } from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showGoogleMock, setShowGoogleMock] = useState(false);
  const [showFacebookMock, setShowFacebookMock] = useState(false);
  const [showMicrosoftMock, setShowMicrosoftMock] = useState(false);

  const handleAuth = async () => {
    setErrorMsg("");
    if (!email || !password) {
      setErrorMsg("Please fill in your Email and Password.");
      return;
    }

    try {
      if (isSignUp) {
        if (!name) {
          setErrorMsg("Please enter your Full Name.");
          return;
        }
        const res = await fetch('http://localhost:3000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          onLogin(data.name, data.tokens || 0, data.sessions || [], data.profilePic);
        }

      } else {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          onLogin(data.name, data.tokens || 0, data.sessions || [], data.profilePic);
        }
      }
    } catch (err) {
      setErrorMsg("Unable to connect to the local database server.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAuth();
  };

  const handleSocialLogin = async (provider) => {
    if (provider === "Google") setShowGoogleMock(true);
    else if (provider === "Facebook") setShowFacebookMock(true);
    else if (provider === "Microsoft") setShowMicrosoftMock(true);
  };

  const handleSocialSelect = async (selectedName, provider) => {
    setShowGoogleMock(false);
    setShowFacebookMock(false);
    setShowMicrosoftMock(false);
    try {
      const res = await fetch('http://localhost:3000/api/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: selectedName })
      });
      const data = await res.json();
      onLogin(data.name, data.tokens || 0, data.sessions || [], data.profilePic);
    } catch(err) {
      console.error(`${provider} Login Error:`, err);
      setErrorMsg(`Unable to connect to the DB Server. Check if 'node server.js' is running.`);
    }
  };
  
  return (
    <div className="auth-container">
      {/* Google Mock */}
      {showGoogleMock && (
        <div className="google-mock-overlay" onClick={() => setShowGoogleMock(false)}>
          <div className="google-mock-card" onClick={e => e.stopPropagation()}>
            <div style={{textAlign: 'center', marginBottom: '16px'}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <h3 style={{color: '#202124', margin: '16px 0 8px', fontSize: '1.5rem', fontWeight: '400'}}>Sign in</h3>
              <p style={{color: '#444746', fontSize: '1rem', margin: 0}}>Choose a Google account</p>
            </div>
            <div style={{ borderTop: '1px solid #dadce0', margin: '24px -24px 0' }}></div>
            <div className="google-account-item" onClick={() => handleSocialSelect("Yash Varmora", "Google")}>
              <div className="g-avatar" style={{background: '#ea4335'}}>Y</div>
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#3c4043', fontWeight: '500', fontSize: '0.95rem'}}>Yash Varmora</div>
                <div style={{color: '#5f6368', fontSize: '0.85rem'}}>yash@varmora.com</div>
              </div>
            </div>
            <div className="google-account-item" onClick={() => handleSocialSelect("Eco Researcher", "Google")}>
              <div className="g-avatar" style={{background: '#34A853'}}>E</div>
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#3c4043', fontWeight: '500', fontSize: '0.95rem'}}>Eco Researcher</div>
                <div style={{color: '#5f6368', fontSize: '0.85rem'}}>researcher@gmail.com</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #dadce0', margin: '0 -24px 24px' }}></div>
            <button onClick={() => setShowGoogleMock(false)} style={{ margin: '0 auto', display: 'block', color: '#1a73e8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: '8px 16px', borderRadius: '4px' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Facebook Mock */}
      {showFacebookMock && (
        <div className="google-mock-overlay" onClick={() => setShowFacebookMock(false)}>
          <div className="google-mock-card" onClick={e => e.stopPropagation()} style={{ background: '#fff', border: 'none' }}>
            <div style={{textAlign: 'center', marginBottom: '16px'}}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <h3 style={{color: '#1c1e21', margin: '16px 0 8px', fontSize: '1.5rem', fontWeight: '700'}}>Log in with Facebook</h3>
              <p style={{color: '#606770', fontSize: '1rem', margin: 0}}>Choose your profile</p>
            </div>
            <div style={{ borderTop: '1px solid #dadce0', margin: '24px -24px 0' }}></div>
            <div className="google-account-item" onClick={() => handleSocialSelect("Yash Facebook", "Facebook")}>
              <div className="g-avatar" style={{background: '#1877F2'}}>Y</div>
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#1c1e21', fontWeight: '600', fontSize: '0.95rem'}}>Yash Varmora</div>
                <div style={{color: '#606770', fontSize: '0.85rem'}}>Logged in as Facebook User</div>
              </div>
            </div>
            <div className="google-account-item" onClick={() => handleSocialSelect("FB Tester", "Facebook")}>
              <div className="g-avatar" style={{background: '#4267b2'}}>T</div>
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#1c1e21', fontWeight: '600', fontSize: '0.95rem'}}>FB Tester Account</div>
                <div style={{color: '#606770', fontSize: '0.85rem'}}>Available for testing</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #dadce0', margin: '0 -24px 24px' }}></div>
            <button onClick={() => setShowFacebookMock(false)} style={{ margin: '0 auto', display: 'block', color: '#1877f2', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: '8px 16px' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Microsoft Mock */}
      {showMicrosoftMock && (
        <div className="google-mock-overlay" onClick={() => setShowMicrosoftMock(false)}>
          <div className="google-mock-card" onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '0' }}>
            <div style={{textAlign: 'left', marginBottom: '24px'}}>
              <svg width="100" height="22" viewBox="0 0 21 21"><path d="M10 0H0v10h10V0z" fill="#F25022"/><path d="M21 0H11v10h10V0z" fill="#7FBA00"/><path d="M10 11H0v10h10V11z" fill="#00A4EF"/><path d="M21 11H11v10h10V11z" fill="#FFB900"/></svg>
              <h3 style={{color: '#1b1b1b', margin: '24px 0 8px', fontSize: '1.5rem', fontWeight: '600'}}>Pick an account</h3>
            </div>
            <div className="google-account-item" style={{ borderRadius: '0', border: 'none' }} onClick={() => handleSocialSelect("Yash Microsoft", "Microsoft")}>
              <div className="g-avatar" style={{background: '#1b1b1b', borderRadius: '50%'}}>Y</div>
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#1b1b1b', fontWeight: '400', fontSize: '0.95rem'}}>yash@varmora.onmicrosoft.com</div>
                <div style={{color: '#1b1b1b', fontSize: '0.85rem'}}>Signed in</div>
              </div>
            </div>
            <div className="google-account-item" style={{ borderRadius: '0', border: 'none' }} onClick={() => handleSocialSelect("MS Guest", "Microsoft")}>
              <div className="g-avatar" style={{background: '#737373', borderRadius: '50%'}}><User size={16}/></div>
              <div style={{textAlign: 'left'}}>
                <div style={{color: '#1b1b1b', fontWeight: '400', fontSize: '0.95rem'}}>guest_account@outlook.com</div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}></div>
            <button onClick={() => setShowMicrosoftMock(false)} style={{ float: 'right', color: '#1b1b1b', background: '#ccc', border: 'none', cursor: 'pointer', padding: '6px 20px' }}>Cancel</button>
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>
      )}
      <div className="card glass auth-card">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Leaf size={48} className="text-gradient" style={{ margin: '0 auto 16px' }} />
          <h2>{isSignUp ? "Create EcoProfile" : "Welcome Back"}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to track your AI carbon footprint.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => handleSocialLogin("Google")} className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
          <button onClick={() => handleSocialLogin("Facebook")} className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/><path d="M15.83 14.323h-3.328v8.385c-1.637.336-3.351.336-4.988 0v-8.385H4.718v-3.469h2.796V9.43c0-2.741 1.666-4.234 4.145-4.669 1.488 0 3.036.262 3.036.262v2.953H11.96c-1.69 0-2.213.913-2.213 2.126v2.25h4.615l-.532 3.469h-2.796z" fill="#FFF"/></svg>
            Continue with Facebook
          </button>
          <button onClick={() => handleSocialLogin("Microsoft")} className="social-btn">
            <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0H0v10h10V0z" fill="#F25022"/><path d="M21 0H11v10h10V0z" fill="#7FBA00"/><path d="M10 11H0v10h10V11z" fill="#00A4EF"/><path d="M21 11H11v10h10V11z" fill="#FFB900"/></svg>
            Continue with Microsoft
          </button>
        </div>

        <div className="auth-divider"><span>or continue with email id</span></div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isSignUp && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={18} />
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={handleKeyDown} />
              </div>
            </div>
          )}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
            </div>
          </div>
          
          {errorMsg && <div className="auth-error"><ShieldAlert size={14} style={{display:'inline', marginRight:'6px', verticalAlign:'text-bottom'}}/> {errorMsg}</div>}

          <button onClick={handleAuth} className="btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
            {isSignUp ? (
              <><UserPlus size={18} /> Sign Up & Start Saving</>
            ) : (
              <>Login <ArrowRight size={18} /></>
            )}
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', marginLeft: '8px' }}>
            {isSignUp ? "Login here" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
