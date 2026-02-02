import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserVenues, createVenue, deleteVenue } from '../api';
import { Icon } from './Icon';
import MenuEditor from './MenuEditor';

const AdminPage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedVenueForMenu, setSelectedVenueForMenu] = useState(null);
  const [showQRModal, setShowQRModal] = useState(null);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    telegramId: '',
  });

  useEffect(() => {
    // Получаем информацию о пользователе
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserVenues();
      setVenues(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      setError('Заполните название и slug');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createVenue(formData);
      setFormData({ name: '', slug: '', description: '', telegramId: '' });
      setShowForm(false);
      await loadVenues();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVenue = async (id) => {
    if (!confirm('Удалить это заведение?')) return;

    try {
      setError(null);
      await deleteVenue(id);
      await loadVenues();
    } catch (err) {
      setError(err.message);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '');
  };

  if (selectedVenueForMenu) {
    return (
      <MenuEditor
        venueId={selectedVenueForMenu.id}
        onClose={() => setSelectedVenueForMenu(null)}
      />
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <Icon name="admin" size={32} /> Панель администратора
          </h1>
          <p style={styles.subtitle}>{user ? `Добро пожаловать, ${user.name}!` : 'Управляйте вашими заведениями и меню'}</p>
        </div>
        <div style={styles.headerButtons}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.primaryBtn}
            title="Добавить новое заведение"
          >
            <Icon name="add" size={20} /> Новое заведение
          </button>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            title="Выйти из аккаунта"
          >
            <Icon name="close" size={18} /> Выход
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorBox}>
          <Icon name="error" size={20} /> {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={styles.formSection}>
          <h2 style={styles.formTitle}>Добавить новое заведение</h2>
          <form onSubmit={handleAddVenue} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Название заведения *</label>
              <input
                type="text"
                placeholder="Моя кофейня"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>URL адрес (slug) *</label>
                <input
                  type="text"
                  placeholder="moya-kofeyna"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telegram ID</label>
                <input
                  type="text"
                  placeholder="123456789"
                  value={formData.telegramId}
                  onChange={(e) =>
                    setFormData({ ...formData, telegramId: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Описание</label>
              <textarea
                placeholder="Описание вашего заведения"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={styles.textarea}
                rows="4"
              />
            </div>

            <div style={styles.formButtons}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  ...styles.submitBtn,
                  opacity: submitting ? 0.6 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                <Icon name="save" size={16} />
                {submitting ? 'Сохранение...' : 'Создать заведение'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    name: '',
                    slug: '',
                    telegramId: '',
                    description: '',
                  });
                  setError(null);
                }}
                style={styles.cancelBtn}
              >
                <Icon name="cancel" size={16} /> Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Venues List */}
      <div style={styles.venuesSection}>
        {loading ? (
          <div style={styles.loading}>
            <Icon name="loading" size={40} /> Загрузка заведений...
          </div>
        ) : venues.length === 0 ? (
          <div style={styles.empty}>
            <Icon name="info" size={40} /> Заведений нет
          </div>
        ) : (
          <div style={styles.venuesGrid}>
            {venues.map((venue) => (
              <div key={venue.id} style={styles.venueCard}>
                <div style={styles.venueCardHeader}>
                  <h3 style={styles.venueName}>{venue.name}</h3>
                  <span style={styles.venueBadge}>{venue.slug}</span>
                </div>

                {venue.description && (
                  <p style={styles.venueDesc}>{venue.description}</p>
                )}

                <div style={styles.venueInfo}>
                  <div style={styles.infoItem}>
                    <Icon name="qr" size={16} />
                    <span>QR Код</span>
                  </div>
                  {venue.telegramId && (
                    <div style={styles.infoItem}>
                      <Icon name="telegram" size={16} />
                      <span>{venue.telegramId}</span>
                    </div>
                  )}
                </div>

                <div style={styles.cardActions}>
                  <button
                    onClick={() => {
                      setShowQRModal(venue);
                    }}
                    style={styles.actionBtn}
                    title="Показать QR код"
                  >
                    <Icon name="qr" size={18} />
                    QR
                  </button>

                  <button
                    onClick={() => setSelectedVenueForMenu(venue)}
                    style={styles.actionBtn}
                    title="Редактировать меню"
                  >
                    <Icon name="menu" size={18} />
                    Меню
                  </button>

                  <a
                    href={`/menu/${venue.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.actionBtn}
                    title="Открыть открытое меню"
                  >
                    <Icon name="expand" size={18} />
                    Просмотр
                  </a>

                  <button
                    onClick={() => handleDeleteVenue(venue.id)}
                    style={styles.deleteBtn}
                    title="Удалить заведение"
                  >
                    <Icon name="delete" size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.qrModal}>
            <button
              onClick={() => setShowQRModal(null)}
              style={styles.modalClose}
            >
              <Icon name="close" size={24} />
            </button>
            <h2 style={styles.modalTitle}>QR код для {showQRModal.name}</h2>
            <div style={styles.qrContainer}>
              <img
                src={`http://localhost:3001/api/venue/${showQRModal.id}/qr-image`}
                alt="QR Code"
                style={styles.qrCode}
                onError={(e) => {
                  console.error('QR Load Error:', e);
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p style={styles.qrInfo}>
              Отсканируйте этот QR код, чтобы открыть меню
            </p>
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = `http://localhost:3001/api/venue/${showQRModal.id}/qr-image`;
                link.download = `qr-${showQRModal.slug}.png`;
                link.click();
              }}
              style={styles.downloadBtn}
            >
              <Icon name="download" size={16} /> Скачать QR код
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: '#fff',
    padding: '2rem',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '3rem',
    gap: '2rem',
    flexWrap: 'wrap',
  },

  headerContent: {
    flex: 1,
  },

  title: {
    margin: '0 0 0.5rem',
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  subtitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#888',
    fontWeight: '500',
  },

  primaryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },

  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },

  headerButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },

  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid #dc2626',
    borderRadius: '8px',
    color: '#ff8a8a',
    marginBottom: '2rem',
    animation: 'slideDown 0.3s ease-out',
  },

  formSection: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    animation: 'slideDown 0.3s ease-out',
  },

  formTitle: {
    margin: '0 0 1.5rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },

  label: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#ccc',
  },

  input: {
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'inherit',
    transition: 'all 0.2s',
  },

  textarea: {
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    transition: 'all 0.2s',
  },

  formButtons: {
    display: 'flex',
    gap: '1rem',
  },

  submitBtn: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  },

  cancelBtn: {
    flex: 1,
    padding: '0.75rem 1.5rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  },

  venuesSection: {
    marginTop: '2rem',
  },

  loading: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
  },

  empty: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#888',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    fontSize: '1.1rem',
  },

  venuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },

  venueCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '1.5rem',
    transition: 'all 0.3s ease',
    animation: 'slideIn 0.3s ease-out',
  },

  venueCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '1rem',
    gap: '1rem',
  },

  venueName: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },

  venueBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#333',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#8b5cf6',
    whiteSpace: 'nowrap',
  },

  venueDesc: {
    margin: '0 0 1rem',
    color: '#aaa',
    fontSize: '0.9rem',
    lineHeight: '1.5',
  },

  venueInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.85rem',
    color: '#999',
  },

  cardActions: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    gap: '0.5rem',
  },

  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.6rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textDecoration: 'none',
  },

  deleteBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.6rem',
    backgroundColor: '#3d2020',
    color: '#ff8a8a',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },

  qrModal: {
    backgroundColor: '#111',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    position: 'relative',
    border: '1px solid #333',
    animation: 'slideUp 0.3s ease-out',
  },

  modalClose: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    padding: '0.5rem',
  },

  modalTitle: {
    margin: '0 0 1.5rem',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },

  qrContainer: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
  },

  qrCode: {
    maxWidth: '300px',
    width: '100%',
    height: 'auto',
  },

  qrInfo: {
    textAlign: 'center',
    color: '#888',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },

  downloadBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#8b5cf6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
};

// Add keyframe animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  button:hover {
    transform: translateY(-2px);
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }
`;
if (!document.head.querySelector('style[data-admin-styles]')) {
  style.setAttribute('data-admin-styles', 'true');
  document.head.appendChild(style);
}

export default AdminPage;
