/**
 * Icon Component - Красивые иконки вместо смайликов
 */

export const Icon = ({ name, size = 24 }) => {
  const icons = {
    // Navigation
    home: '🏠',
    admin: '⚙️',
    back: '←',
    close: '✕',
    menu: '☰',
    
    // Actions
    add: '➕',
    edit: '✏️',
    delete: '🗑️',
    save: '💾',
    cancel: '❌',
    search: '🔍',
    refresh: '🔄',
    settings: '⚙️',
    
    // Items & Categories
    coffee: '☕',
    food: '🍔',
    salad: '🥗',
    dessert: '🍰',
    drink: '🥤',
    bread: '🥖',
    meat: '🥩',
    fish: '🐟',
    vegetable: '🥦',
    fruit: '🍎',
    pizza: '🍕',
    burger: '🍔',
    dish: '🍽️',
    
    // Commerce
    cart: '🛒',
    order: '📋',
    phone: '📞',
    location: '📍',
    qr: '📱',
    payment: '💳',
    price: '💰',
    
    // Status
    loading: '⏳',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
    
    // User & Profile
    user: '👤',
    users: '👥',
    profile: '👨‍💼',
    logout: '🚪',
    password: '🔐',
    mail: '📧',
    login: '🔓',
    
    // Communication
    message: '💬',
    email: '📧',
    telegram: '📱',
    
    // General
    star: '⭐',
    heart: '❤️',
    like: '👍',
    check: '✓',
    cross: '✕',
  };

  return (
    <span 
      style={{
        fontSize: `${size}px`,
        display: 'inline-block',
        lineHeight: 1,
      }}
    >
      {icons[name] || '•'}
    </span>
  );
};

export default Icon;
