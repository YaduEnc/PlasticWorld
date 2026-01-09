import { useState } from 'react'
import './LandingPage.css'

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-text">PlasticWorld</span>
          </div>
          
          <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
            <a href="#features" className="nav-link">Features</a>
            <a href="#security" className="nav-link">Security</a>
            <a href="#about" className="nav-link">About</a>
            <a href="/signin" className="nav-button">Sign In</a>
          </div>
          
          <button 
            className="nav-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Secure messaging
              <br />
              for everyone
            </h1>
            <p className="hero-description">
              End-to-end encrypted conversations with real-time delivery. 
              Simple, elegant, and secure.
            </p>
            <div className="hero-actions">
            <a href="/signin" className="button-primary">Get Started</a>
            <a href="#features" className="button-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="features-container">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">End-to-End Encryption</h3>
              <p className="feature-description">
                Your messages are encrypted with Signal Protocol. 
                Only you and the recipient can read them.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-Time Delivery</h3>
              <p className="feature-description">
                Instant message delivery with typing indicators 
                and read receipts.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Friend Management</h3>
              <p className="feature-description">
                Connect with friends, send requests, and manage 
                your social network.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Multi-Device</h3>
              <p className="feature-description">
                Access your messages from any device. 
                Sync seamlessly across platforms.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Media Sharing</h3>
              <p className="feature-description">
                Share photos, videos, audio, and files 
                securely with your contacts.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3 className="feature-title">Privacy First</h3>
              <p className="feature-description">
                Your data stays private. We don't store 
                unencrypted messages on our servers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="security">
        <div className="security-container">
          <div className="security-content">
            <h2 className="section-title">Security</h2>
            <p className="security-description">
              Built with Signal Protocol, the same encryption used by 
              Signal and WhatsApp. Your conversations are protected with 
              perfect forward secrecy.
            </p>
            <div className="security-list">
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>Signal Protocol encryption</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>Perfect forward secrecy</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>Zero-knowledge architecture</span>
              </div>
              <div className="security-item">
                <span className="security-check">✓</span>
                <span>Open-source encryption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2 className="cta-title">Ready to get started?</h2>
          <p className="cta-description">
            Join thousands of users who trust PlasticWorld for secure messaging.
          </p>
          <button className="button-primary button-large">Sign Up Free</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h4 className="footer-title">PlasticWorld</h4>
              <p className="footer-text">Secure messaging for everyone.</p>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Product</h4>
              <a href="#features" className="footer-link">Features</a>
              <a href="#security" className="footer-link">Security</a>
              <a href="#" className="footer-link">Pricing</a>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Company</h4>
              <a href="#about" className="footer-link">About</a>
              <a href="#" className="footer-link">Blog</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
            
            <div className="footer-section">
              <h4 className="footer-title">Legal</h4>
              <a href="#" className="footer-link">Privacy</a>
              <a href="#" className="footer-link">Terms</a>
              <a href="#" className="footer-link">Security</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">
              © 2026 PlasticWorld. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
