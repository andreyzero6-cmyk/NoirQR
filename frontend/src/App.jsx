import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, Navigate, useLocation } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import MenuPage from './components/MenuPage';
import LoginPage from './components/LoginPage';
import { Icon } from './components/Icon';

// ============ PROTECTED ROUTE ============
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

// ============ MAIN APP COMPONENT ============
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} />} />
        <Route path="/menu/:slug" element={<MenuPageWrapper />} />
      </Routes>
    </BrowserRouter>
  );
};

// ============ MENU PAGE WRAPPER ============
const MenuPageWrapper = () => {
  const { slug } = useParams();
  return <MenuPage slug={slug} />;
};

// ============ HOME PAGE COMPONENT ============
const HomePage = () => {
  const token = localStorage.getItem('token');

  return (
    <>
      <div style={styles.homePage}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.container}>
            <Link to="/" style={styles.logo}>
              <Icon name="qr" size={28} /> NoirQR
            </Link>
            <nav style={styles.nav}>
              <a href="#features" style={styles.navLink}>
                Возможности
              </a>
              {token ? (
                <Link to="/admin" style={styles.adminBtn}>
                  <Icon name="admin" size={16} /> Панель
                </Link>
              ) : (
                <Link to="/login" style={styles.adminBtn}>
                  <Icon name="admin" size={16} /> Вход
                </Link>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              QR-меню для ресторанов
              <span style={styles.highlight}> следующего поколения</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Создавайте динамические меню, управляйте QR-кодами и получайте заказы прямо в Telegram
            </p>
            <div style={styles.heroCTA}>
              <Link to={token ? '/admin' : '/login'} style={styles.primaryBtn}>
                <Icon name="add" size={16} /> Начать работу
              </Link>
              <a href="#features" style={styles.secondaryBtn}>
                <Icon name="menu" size={16} /> Узнать больше
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={styles.features}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Мощные возможности</h2>
            <div style={styles.featuresGrid}>
              <FeatureCard
                icon="rocket"
                title="Быстрое создание"
                desc="Создайте меню за 2 минуты. Никаких сложностей."
              />
              <FeatureCard
                icon="palette"
                title="Красивый дизайн"
                desc="Современный минималистичный интерфейс вашего меню"
              />
              <FeatureCard
                icon="settings"
                title="Полный контроль"
                desc="Управляйте ценами, товарами и описаниями в реальном времени"
              />
              <FeatureCard
                icon="share"
                title="Легкая рассылка"
                desc="QR-код или прямая ссылка для клиентов"
              />
              <FeatureCard
                icon="phone"
                title="Мобильная оптимизация"
                desc="Работает идеально на всех устройствах и экранах"
              />
              <FeatureCard
                icon="zap"
                title="Данные сохраняются"
                desc="Все ваши меню автоматически сохраняются локально"
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={styles.howItWorks}>
          <div style={styles.container}>
            <h2 style={styles.sectionTitle}>Как это работает</h2>
            <div style={styles.stepsGrid}>
              <StepCard
                number="1"
                icon="add"
                title="Создайте заведение"
                desc="Заполните информацию о вашем ресторане или кафе"
              />
              <StepCard
                number="2"
                icon="menu"
                title="Добавьте товары"
                desc="Загрузите фото, названия, цены и описания товаров"
              />
              <StepCard
                number="3"
                icon="qr"
                title="Получите QR-код"
                desc="Скачайте QR-код для печати или размещения"
              />
              <StepCard
                number="4"
                icon="order"
                title="Получайте заказы"
                desc="Клиенты заказывают, вы получаете уведомления"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={styles.ctaSection}>
          <div style={styles.container}>
            <h2 style={styles.ctaTitle}>Готовы начать?</h2>
            <p style={styles.ctaSubtitle}>
              Присоединяйтесь к ресторанам, которые уже используют NoirQR
            </p>
            <Link to={token ? '/admin' : '/login'} style={styles.largeCTA}>
              Запустить панель управления <Icon name="expand" size={16} />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          <div style={styles.container}>
            <div style={styles.footerContent}>
              <div>
                <h3 style={styles.footerBrand}>
                  <Icon name="qr" size={20} /> NoirQR
                </h3>
                <p style={styles.footerDesc}>Современное QR-меню для вашего ресторана</p>
              </div>
              <div style={styles.footerLinks}>
                <h4 style={styles.footerTitle}>Меню</h4>
                <a href="#features" style={styles.footerLink}>
                  Возможности
                </a>
                <a href="/" style={styles.footerLink}>
                  На главную
                </a>
              </div>
              <div style={styles.footerLinks}>
                <h4 style={styles.footerTitle}>Контакты</h4>
                <a href="mailto:support@noirqr.com" style={styles.footerLink}>
                  support@noirqr.com
                </a>
              </div>
            </div>
            <div style={styles.footerBottom}>
              <p>© 2024 NoirQR. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

// ============ FEATURE CARD COMPONENT ============
const FeatureCard = ({ icon, title, desc }) => {
  return (
    <div style={styles.featureCard}>
      <div style={styles.featureIcon}>
        <Icon name={icon} size={32} />
      </div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDesc}>{desc}</p>
    </div>
  );
};

// ============ STEP CARD COMPONENT ============
const StepCard = ({ number, icon, title, desc }) => {
  return (
    <div style={styles.stepCard}>
      <div style={styles.stepNumber}>{number}</div>
      <Icon name={icon} size={32} style={{ color: '#8b5cf6' }} />
      <h3 style={styles.stepTitle}>{title}</h3>
      <p style={styles.stepDesc}>{desc}</p>
    </div>
  );
};

const styles = {
  homePage: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
    color: '#fff',
    overflow: 'hidden',
  },

  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: 'rgba(15, 15, 15, 0.8)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '1rem 0',
  },

  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: '1.5rem',
    fontWeight: '800',
    textDecoration: 'none',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'all 0.3s',
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },

  navLink: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.3s',
  },

  adminBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
  },

  hero: {
    padding: '6rem 2rem',
    textAlign: 'center',
  },

  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },

  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '900',
    margin: '0 0 1.5rem',
    lineHeight: '1.2',
  },

  highlight: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#888',
    margin: '0 0 3rem',
    lineHeight: '1.6',
  },

  heroCTA: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  primaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },

  secondaryBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },

  features: {
    padding: '6rem 2rem',
    backgroundColor: 'rgba(139, 92, 246, 0.03)',
    borderTop: '1px solid rgba(139, 92, 246, 0.1)',
    borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
  },

  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    textAlign: 'center',
    margin: '0 0 4rem',
  },

  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  featureCard: {
    padding: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },

  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem',
    color: '#8b5cf6',
  },

  featureTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    margin: '0 0 1rem',
  },

  featureDesc: {
    color: '#888',
    lineHeight: '1.6',
    margin: 0,
  },

  howItWorks: {
    padding: '6rem 2rem',
  },

  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  stepCard: {
    padding: '2rem',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    borderRadius: '12px',
    textAlign: 'center',
    position: 'relative',
  },

  stepNumber: {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '30px',
    height: '30px',
    backgroundColor: '#8b5cf6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '1rem',
  },

  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    margin: '2rem 0 0.5rem',
  },

  stepDesc: {
    color: '#888',
    fontSize: '0.95rem',
  },

  ctaSection: {
    padding: '4rem 2rem',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    textAlign: 'center',
  },

  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: '0 0 1rem',
  },

  ctaSubtitle: {
    fontSize: '1.1rem',
    color: '#888',
    margin: '0 0 2rem',
  },

  largeCTA: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.25rem 3rem',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.3s',
  },

  footer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '4rem 2rem 2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto 2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },

  footerBrand: {
    margin: '0 0 0.5rem',
    fontSize: '1.2rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  footerDesc: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },

  footerLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  footerTitle: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },

  footerLink: {
    color: '#666',
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.3s',
  },

  footerBottom: {
    textAlign: 'center',
    color: '#555',
    fontSize: '0.85rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};

// ============ GLOBAL STYLES ============
const initializeGlobalStyles = () => {
  const style = document.createElement('style');
  style.setAttribute('data-app-styles', 'true');
  style.textContent = `
    * {
      scroll-behavior: smooth;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    button:hover:not(:disabled),
    a:hover {
      transform: translateY(-2px);
    }

    header {
      padding: 1rem 0;
    }

    @media (max-width: 768px) {
      header .container {
        flex-direction: column;
        gap: 1rem;
      }

      h1 {
        font-size: 2rem !important;
      }

      section {
        padding: 3rem 1rem !important;
      }

      .container {
        padding: 0 1rem !important;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .feature-card,
    .step-card {
      animation: fadeIn 0.6s ease-out forwards;
    }
  `;

  if (!document.head.querySelector('style[data-app-styles]')) {
    document.head.appendChild(style);
  }
};

// Initialize global styles when component mounts
if (typeof document !== 'undefined') {
  initializeGlobalStyles();
}

export default App;
