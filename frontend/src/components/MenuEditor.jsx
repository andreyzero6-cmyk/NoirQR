import React, { useState, useEffect } from 'react';
import { createMenuItem, getMenuItems, updateMenuItem, deleteMenuItem } from '../api';
import Icon from './Icon';

const MenuEditor = ({ venueId, onClose }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    category: 'Напитки',
  });

  useEffect(() => {
    loadItems();
  }, [venueId]);

  const loadItems = async () => {
    try {
      setLoading(true);
      // Нужна информация о заведении - получаем его через API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/venues`
      );
      const venues = await response.json();
      const venue = venues.find((v) => v.id === parseInt(venueId));
      if (venue && venue.menuItems) {
        setItems(venue.menuItems);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Заполните название и цену');
      return;
    }

    try {
      if (editingId) {
        await updateMenuItem(editingId, formData);
        alert('✅ Товар обновлен');
      } else {
        await createMenuItem(venueId, {
          ...formData,
          price: parseFloat(formData.price),
        });
        alert('✅ Товар добавлен');
      }
      setFormData({ name: '', price: '', description: '', imageUrl: '', category: 'Напитки' });
      setEditingId(null);
      setShowForm(false);
      loadItems();
    } catch (error) {
      alert('Ошибка: ' + error.message);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить товар?')) {
      try {
        await deleteMenuItem(venueId, id);
        loadItems();
        alert('✅ Товар удален');
      } catch (error) {
        alert('Ошибка: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', imageUrl: '', category: 'Напитки' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataWithFile = new FormData();
      formDataWithFile.append('file', file);

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formDataWithFile,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData({ ...formData, imageUrl: data.url });
      alert('✅ Фото загружено');
    } catch (error) {
      alert('Ошибка загрузки: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        <div style={styles.header}>
          <h2 style={styles.title}>Редактор меню</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <Icon name="close" size={20} />
          </button>
        </div>

        <div style={styles.body}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addBtn}
          >
            <Icon name="add" size={16} /> Добавить товар
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Название *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Капучино"
                  style={styles.input}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Цена *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="150"
                    step="0.01"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Категория</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.select}
                  >
                    <option>☕ Напитки</option>
                    <option>🥗 Салаты</option>
                    <option>🍔 Основное</option>
                    <option>🍰 Десерты</option>
                    <option>📍 Другое</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Классический итальянский кофе с молочной пеной"
                  style={styles.textarea}
                  rows="3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Фото</label>
                <div style={styles.imageUploadSection}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    style={styles.fileInput}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" style={styles.fileLabel}>
                    {uploading ? '⏳ Загрузка...' : '📤 Выберите файл'}
                  </label>
                </div>
                
                <div style={styles.imageOptions}>
                  <p style={styles.orText}>ИЛИ</p>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    style={styles.input}
                  />
                </div>

                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={styles.imagePreview}
                    onError={(e) => {
                      console.error('Failed to load preview image:', formData.imageUrl);
                      e.target.style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div style={styles.formButtons}>
                <button type="submit" style={styles.submitBtn}>
                  <Icon name="save" size={16} /> {editingId ? 'Сохранить' : 'Добавить'}
                </button>
                <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                  <Icon name="cancel" size={16} /> Отмена
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <p style={styles.loading}>Загрузка...</p>
          ) : items.length === 0 ? (
            <p style={styles.empty}>Товары не добавлены</p>
          ) : (
            <div style={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} style={styles.itemCard}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={styles.itemImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('Failed to load image:', item.imageUrl);
                      }}
                    />
                  )}
                  <div style={styles.itemContent}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <p style={styles.itemPrice}>{item.price} ₴</p>
                    {item.description && (
                      <p style={styles.itemDesc}>{item.description}</p>
                    )}
                  </div>
                  <div style={styles.itemActions}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={styles.editBtn}
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Icon name="delete" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modal: {
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

  modalContent: {
    backgroundColor: '#111',
    borderRadius: '16px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    border: '1px solid #222',
    animation: 'slideUp 0.3s ease-out',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    borderBottom: '1px solid #222',
    position: 'sticky',
    top: 0,
    backgroundColor: '#111',
  },

  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#fff',
  },

  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: 0,
  },

  body: {
    padding: '2rem',
  },

  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#222',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '2rem',
    transition: 'all 0.2s',
  },

  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },

  formGroup: {
    marginBottom: '1.5rem',
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },

  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#fff',
    fontSize: '0.9rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  select: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },

  textarea: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    resize: 'vertical',
  },

  imagePreview: {
    marginTop: '0.5rem',
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '6px',
    maxHeight: '150px',
  },

  formButtons: {
    display: 'flex',
    gap: '1rem',
  },

  submitBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },

  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: '#333',
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

  loading: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },

  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem',
  },

  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  itemCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    animation: 'slideIn 0.2s ease-out',
  },

  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#222',
  },

  itemContent: {
    flex: 1,
  },

  itemName: {
    margin: '0 0 0.5rem',
    fontWeight: '600',
    color: '#fff',
  },

  itemPrice: {
    margin: '0 0 0.5rem',
    fontWeight: '700',
    color: '#8b5cf6',
    fontSize: '1.1rem',
  },

  itemDesc: {
    margin: 0,
    color: '#888',
    fontSize: '0.85rem',
  },

  itemActions: {
    display: 'flex',
    gap: '0.5rem',
  },

  editBtn: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  deleteBtn: {
    padding: '0.5rem 0.75rem',
    backgroundColor: '#3d2020',
    color: '#ff8a8a',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  imageUploadSection: {
    marginBottom: '1rem',
  },

  fileInput: {
    display: 'none',
  },

  fileLabel: {
    display: 'block',
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    border: '2px dashed #444',
    borderRadius: '6px',
    textAlign: 'center',
    color: '#888',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  imageOptions: {
    textAlign: 'center',
    margin: '1rem 0',
  },

  orText: {
    color: '#666',
    fontSize: '0.9rem',
    margin: '0.5rem 0',
  },
};

export default MenuEditor;
