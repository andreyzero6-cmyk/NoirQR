import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from './Icon';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    // Проверяем если уже залогинены
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      navigate('/admin-secret');
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // ВХОД
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка входа');
        }

        // Сохраняем токен и данные пользователя
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        navigate('/admin-secret');
      } else {
        // РЕГИСТРАЦИЯ
        if (!name.trim()) {
          throw new Error('Введите имя');
        }

        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Ошибка регистрации');
        }

        // Автоматически логинимся после регистрации
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        navigate('/admin-secret');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <Link to="/" style={styles.logo}>
            <Icon name="admin" size={32} />
          </Link>
          <h1 style={styles.title}>
            {isLogin ? 'Вход' : 'Регистрация'}
          </h1>
          <p style={styles.subtitle}>
            {isLogin 
              ? 'Управляйте своим рестораном' 
              : 'Создайте аккаунт администратора'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBox}>
            <Icon name="error" size={20} />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} style={styles.form}>
          {!isLogin && (
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Icon name="user" size={16} /> Имя ресторана
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название вашего ресторана"
                style={styles.input}
                disabled={loading}
                required
              />
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Icon name="mail" size={16} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ваш@email.com"
              style={styles.input}
              disabled={loading}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <Icon name="password" size={16} /> Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              style={styles.input}
              disabled={loading}
              minLength={6}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <>
                <Icon name="loading" size={18} /> Загрузка...
              </>
            ) : (
              <>
                <Icon name={isLogin ? 'login' : 'add'} size={18} />
                {isLogin ? 'Войти' : 'Создать аккаунт'}
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div style={styles.toggle}>
          <p>
            {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              style={styles.toggleBtn}
              disabled={loading}
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </div>

        {/* Demo Info */}
        <div style={styles.demoBox}>
          <h3 style={styles.demoTitle}>👨‍💼 Demo аккаунт</h3>
          <p style={styles.demoText}>
            Email: <code style={styles.code}>demo@noirqr.com</code><br/>
            Пароль: <code style={styles.code}>demo1234</code>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(17, 17, 17, 0.8)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '2rem',
    backdropFilter: 'blur(10px)',
    animation: 'slideUp 0.3s ease-out',
  },

  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },

  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    borderRadius: '8px',
    marginBottom: '1rem',
    textDecoration: 'none',
    color: '#fff',
    fontSize: '24px',
  },

  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#fff',
    margin: '0.5rem 0',
  },

  subtitle: {
    fontSize: '0.95rem',
    color: '#888',
    margin: '0.5rem 0 0 0',
  },

  errorBox: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#ff6b6b',
    fontSize: '0.9rem',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ccc',
  },

  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },

  submitBtn: {
    padding: '0.9rem 1rem',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    marginTop: '0.5rem',
  },

  toggle: {
    textAlign: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #333',
    marginBottom: '1rem',
  },

  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#8b5cf6',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '600',
    padding: '0',
    textDecoration: 'underline',
  },

  demoBox: {
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '0.85rem',
  },

  demoTitle: {
    color: '#8b5cf6',
    margin: '0 0 0.5rem 0',
    fontSize: '0.9rem',
    fontWeight: '600',
  },

  demoText: {
    color: '#aaa',
    margin: '0',
    lineHeight: '1.6',
  },

  code: {
    background: '#1a1a1a',
    padding: '0.2rem 0.4rem',
    borderRadius: '3px',
    fontFamily: 'monospace',
    color: '#fff',
    fontSize: '0.8rem',
  },
};

export default LoginPage;
