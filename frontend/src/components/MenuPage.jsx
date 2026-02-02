import React, { useState, useEffect } from 'react';
import { getMenuItems } from '../api';
import { Icon } from './Icon';

const MenuPage = ({ slug }) => {
  const [venue, setVenue] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      loadMenu();
    }
  }, [slug]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMenuItems(slug);
      setVenue(data.venue);
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cartItems = items.filter((item) => cart[item.id] && cart[item.id] > 0);
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * cart[item.id],
    0
  );

  const handleAddToCart = (itemId) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      newCart[itemId]--;
      if (newCart[itemId] <= 0) delete newCart[itemId];
      return newCart;
    });
  };

  const handleSubmitOrder = async () => {
    if (!orderForm.name || !orderForm.phone || cartItems.length === 0) {
      alert('Заполните все поля и выберите товары');
      return;
    }

    try {
      const orderData = {
        name: orderForm.name,
        phone: orderForm.phone,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: cart[item.id],
        })),
        total,
      };

      // Отправить заказ
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/order`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        alert('✅ Заказ принят!');
        setCart({});
        setOrderForm({ name: '', phone: '' });
        setShowCart(false);
      }
    } catch (err) {
      alert('Ошибка при оформлении заказа');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <Icon name="loading" size={48} /> Загрузка меню...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <Icon name="error" size={48} /> {error}
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <Icon name="info" size={48} /> Заведение не найдено
        </div>
      </div>
    );
  }

  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || 'Другое';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.venueName}>{venue.name}</h1>
          {venue.description && (
            <p style={styles.venueDesc}>{venue.description}</p>
          )}
        </div>
        <a href="/" style={styles.backLink}>
          <Icon name="back" size={20} /> На главную
        </a>
      </header>

      {/* Cart Button */}
      <button
        onClick={() => setShowCart(!showCart)}
        style={{
          ...styles.cartButton,
          backgroundColor: Object.keys(cart).length > 0 ? '#8b5cf6' : '#333',
        }}
      >
        <Icon name="cart" size={20} />
        <span>Корзина</span>
        {Object.keys(cart).length > 0 && (
          <span style={styles.cartBadge}>
            {Object.values(cart).reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      {showCart && (
        <div style={styles.cartDrawer}>
          <div style={styles.cartContent}>
            <div style={styles.cartHeader}>
              <h2 style={styles.cartTitle}>Ваш заказ</h2>
              <button
                onClick={() => setShowCart(false)}
                style={styles.closeCartBtn}
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {cartItems.length === 0 ? (
              <p style={styles.emptyCart}>Корзина пуста</p>
            ) : (
              <>
                <div style={styles.cartItems}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={styles.cartItem}>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={styles.cartItemImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            console.error('Failed to load cart image:', item.imageUrl);
                          }}
                        />
                      )}
                      <div style={styles.cartItemContent}>
                        <h4 style={styles.cartItemName}>{item.name}</h4>
                        <p style={styles.cartItemPrice}>{item.price} ₴</p>
                      </div>
                      <div style={styles.quantityControl}>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          style={styles.quantityBtn}
                        >
                          −
                        </button>
                        <span style={styles.quantity}>{cart[item.id]}</span>
                        <button
                          onClick={() => handleAddToCart(item.id)}
                          style={styles.quantityBtn}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={styles.cartSummary}>
                  <div style={styles.totalRow}>
                    <span>Итого:</span>
                    <span style={styles.totalPrice}>{total} ₴</span>
                  </div>
                </div>

                <form style={styles.orderForm}>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={orderForm.name}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, name: e.target.value })
                    }
                    style={styles.formInput}
                  />
                  <input
                    type="tel"
                    placeholder="Ваш номер"
                    value={orderForm.phone}
                    onChange={(e) =>
                      setOrderForm({ ...orderForm, phone: e.target.value })
                    }
                    style={styles.formInput}
                  />
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    style={styles.submitOrderBtn}
                  >
                    <Icon name="order" size={16} /> Оформить заказ
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <main style={styles.main}>
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <section key={category} style={styles.section}>
            <h2 style={styles.categoryTitle}>{category}</h2>
            <div style={styles.itemsGrid}>
              {categoryItems.map((item) => (
                <div key={item.id} style={styles.itemCard}>
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={styles.itemImage}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.error('Failed to load item image:', item.imageUrl);
                      }}
                    />
                  )}
                  <div style={styles.itemContent}>
                    <h3 style={styles.itemName}>{item.name}</h3>
                    {item.description && (
                      <p style={styles.itemDesc}>{item.description}</p>
                    )}
                    <div style={styles.itemFooter}>
                      <span style={styles.itemPrice}>{item.price} ₴</span>
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        style={styles.addBtn}
                      >
                        <Icon name="add" size={16} /> Добавить
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} {venue.name} - Menu QR</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
    color: '#fff',
  },

  header: {
    padding: '2rem',
    borderBottom: '1px solid #333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '2rem',
  },

  headerContent: {
    flex: 1,
  },

  venueName: {
    margin: '0 0 0.5rem',
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #fff 0%, #ccc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },

  venueDesc: {
    margin: 0,
    fontSize: '1rem',
    color: '#888',
    fontWeight: '500',
  },

  backLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#888',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'color 0.2s',
  },

  cartButton: {
    position: 'sticky',
    top: '1rem',
    right: '2rem',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '50px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    float: 'right',
    margin: '1rem 2rem 0 0',
  },

  cartBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '24px',
    height: '24px',
    backgroundColor: '#ec4899',
    borderRadius: '50%',
    fontSize: '0.75rem',
    fontWeight: '700',
  },

  cartDrawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    maxWidth: '400px',
    height: '100vh',
    backgroundColor: '#111',
    borderLeft: '1px solid #333',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.5)',
    zIndex: 200,
    overflowY: 'auto',
    animation: 'slideInRight 0.3s ease-out',
  },

  cartContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1.5rem',
  },

  cartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333',
  },

  cartTitle: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: '700',
  },

  closeCartBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '1.5rem',
  },

  cartItems: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '1rem',
  },

  cartItem: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    alignItems: 'center',
  },

  cartItemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#222',
  },

  cartItemContent: {
    flex: 1,
  },

  cartItemName: {
    margin: '0 0 0.25rem',
    fontWeight: '600',
    fontSize: '0.9rem',
  },

  cartItemPrice: {
    margin: 0,
    color: '#8b5cf6',
    fontWeight: '700',
  },

  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  quantityBtn: {
    width: '24px',
    height: '24px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
  },

  quantity: {
    minWidth: '30px',
    textAlign: 'center',
    fontWeight: '600',
  },

  emptyCart: {
    textAlign: 'center',
    color: '#666',
    padding: '2rem 1rem',
  },

  cartSummary: {
    borderTop: '1px solid #333',
    paddingTop: '1rem',
    marginBottom: '1rem',
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    fontWeight: '700',
  },

  totalPrice: {
    color: '#8b5cf6',
    fontSize: '1.3rem',
  },

  orderForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  formInput: {
    padding: '0.75rem',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '1rem',
    fontFamily: 'inherit',
  },

  submitOrderBtn: {
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
    transition: 'all 0.2s',
  },

  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },

  section: {
    marginBottom: '3rem',
  },

  categoryTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    marginBottom: '1.5rem',
    paddingLeft: '1rem',
    borderLeft: '4px solid #8b5cf6',
  },

  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },

  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid #333',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    animation: 'slideIn 0.3s ease-out',
  },

  itemImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    backgroundColor: '#222',
  },

  itemContent: {
    padding: '1.5rem',
  },

  itemName: {
    margin: '0 0 0.5rem',
    fontSize: '1.1rem',
    fontWeight: '700',
  },

  itemDesc: {
    margin: '0 0 1rem',
    fontSize: '0.85rem',
    color: '#888',
    lineHeight: '1.4',
  },

  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  itemPrice: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#8b5cf6',
  },

  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },

  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    minHeight: '100vh',
    fontSize: '1.3rem',
    color: '#888',
  },

  error: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    minHeight: '100vh',
    fontSize: '1.3rem',
    color: '#ff8a8a',
  },

  footer: {
    textAlign: 'center',
    padding: '2rem',
    borderTop: '1px solid #333',
    color: '#666',
    fontSize: '0.9rem',
  },
};

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  button:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  input:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }
`;
if (!document.head.querySelector('style[data-menu-styles]')) {
  style.setAttribute('data-menu-styles', 'true');
  document.head.appendChild(style);
}

export default MenuPage;
