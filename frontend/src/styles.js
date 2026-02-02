/**
 * NoirQR - ЕДИНАЯ СИСТЕМА СТИЛЕЙ
 * Используется для всех компонентов
 * СТРОГИЙ СТАНДАРТ: Все inline styles через этот файл
 */

export const colors = {
  // Backgrounds
  bg: {
    primary: '#0a0a0a',
    secondary: '#111111',
    tertiary: '#1a1a1a',
  },
  
  // Accents
  accent: {
    purple: '#8b5cf6',
    cyan: '#06b6d4',
    pink: '#ec4899',
  },
  
  // Text
  text: {
    primary: '#ffffff',
    secondary: '#a1a1aa',
    muted: '#71717a',
  },
  
  // Borders & Glass
  border: 'rgba(255, 255, 255, 0.1)',
  borderHover: 'rgba(255, 255, 255, 0.2)',
  glass: 'rgba(255, 255, 255, 0.05)',
  
  // Shadows
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 8px 32px rgba(0, 0, 0, 0.3)',
    lg: '0 12px 48px rgba(0, 0, 0, 0.4)',
  },
};

// ============ КОМПОНЕНТ: КОНТЕЙНЕР СТРАНИЦЫ ============
export const pageContainer = {
  minHeight: '100vh',
  backgroundColor: colors.bg.primary,
  color: colors.text.primary,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

// ============ КОМПОНЕНТ: КАРТОЧКА ============
export const card = {
  backgroundColor: 'rgba(17, 17, 17, 0.8)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${colors.border}`,
  borderRadius: '16px',
  padding: '24px',
  transition: 'all 0.3s ease',
};

export const cardHover = {
  ...card,
  cursor: 'pointer',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: colors.shadow.lg,
  },
};

// ============ КОМПОНЕНТ: КНОПКА ============
export const button = {
  padding: '12px 24px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: 'inherit',
  fontSize: '1rem',
};

export const buttonPrimary = {
  ...button,
  background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan})`,
  color: colors.text.primary,
  boxShadow: colors.shadow.md,
};

export const buttonSecondary = {
  ...button,
  background: colors.glass,
  color: colors.text.secondary,
  border: `1px solid ${colors.border}`,
};

// ============ КОМПОНЕНТ: ВВОД ДАННЫХ ============
export const input = {
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${colors.border}`,
  borderRadius: '12px',
  padding: '12px 16px',
  color: colors.text.primary,
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  outline: 'none',
};

export const textarea = {
  ...input,
  minHeight: '100px',
  resize: 'vertical',
};

// ============ КОМПОНЕНТ: НАВИГАЦИЯ ============
export const navbar = {
  backgroundColor: '#ffffff',
  borderBottom: `1px solid ${colors.border}`,
  padding: '0.75rem 0',
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

export const navContent = {
  maxWidth: '1000px',
  margin: '0 auto',
  padding: '0 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

// ============ КОМПОНЕНТ: СЕТКА ============
export const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
  width: '100%',
};

export const gridResponsive = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '2rem',
  alignItems: 'start',
};

// ============ КОМПОНЕНТ: ФОРМА ============
export const formGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '1.25rem',
};

export const label = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: colors.text.secondary,
  margin: 0,
};

// ============ КОМПОНЕНТ: ТЕКСТ ============
export const headingLg = {
  fontSize: '3.5rem',
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
  color: colors.text.primary,
};

export const headingMd = {
  fontSize: '1.875rem',
  fontWeight: 700,
  color: colors.text.primary,
  margin: 0,
  marginBottom: '0.5rem',
};

export const headingSm = {
  fontSize: '1.2rem',
  fontWeight: 600,
  color: colors.text.primary,
  margin: 0,
};

export const bodyText = {
  fontSize: '1rem',
  color: colors.text.secondary,
  margin: 0,
};

export const mutedText = {
  fontSize: '0.875rem',
  color: colors.text.muted,
  margin: 0,
};

// ============ ГРАДИЕНТ ТЕКСТА ============
export const gradientText = {
  background: `linear-gradient(135deg, ${colors.accent.purple}, ${colors.accent.cyan}, ${colors.accent.pink})`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

// ============ ПУСТОЕ СОСТОЯНИЕ ============
export const emptyState = {
  border: `2px dashed ${colors.border}`,
  borderRadius: '12px',
  padding: '3rem 1rem',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
};

// ПРАВИЛО: Никогда не используй:
// ❌ @apply с неправильными классами
// ❌ Tailwind классы типа placeholder-noir-400
// ❌ Миксование разных систем стилизации
// ✅ Всегда используй переменные из этого файла
