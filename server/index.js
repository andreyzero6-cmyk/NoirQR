import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import QRCode from 'qrcode';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = path.join(__dirname, 'db.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Создаем папку uploads если её нет
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Configurе multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static(UPLOADS_DIR));

// ============ DATABASE HELPERS ============
const readDB = () => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultDB = { venues: [], orders: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDB, null, 2));
      return defaultDB;
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch (error) {
    console.error('Error reading DB:', error);
    return { venues: [], orders: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing DB:', error);
  }
};

// ============ AUTH MIDDLEWARE (BASIC ADMIN) ============
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'test-admin-123';

const adminAuth = (req, res, next) => {
  const token = req.headers['x-admin-token'];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// ============ AUTH ENDPOINTS ============

// REGISTER
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = readDB();

  // Check if user exists
  if (db.users && db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // In production, hash this with bcrypt!
    createdAt: new Date().toISOString()
  };

  if (!db.users) db.users = [];
  db.users.push(newUser);
  writeDB(db);

  // Generate token (in production use JWT)
  const token = Buffer.from(`${newUser.id}:${email}`).toString('base64');

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const db = readDB();
  const user = db.users && db.users.find(u => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  // Generate token (in production use JWT)
  const token = Buffer.from(`${user.id}:${email}`).toString('base64');

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// VERIFY TOKEN
app.post('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, email] = decoded.split(':');

    const db = readDB();
    const user = db.users && db.users.find(u => u.id == userId && u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// ============ AUTH MIDDLEWARE FOR USER ROUTES ============
const userAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, email] = decoded.split(':');

    const db = readDB();
    const user = db.users && db.users.find(u => u.id == userId && u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ VENUE ENDPOINTS ============

// GET user's venues (authenticated)
app.get('/api/admin/venues', userAuth, (req, res) => {
  const db = readDB();
  const userVenues = (db.venues || []).filter(v => v.userId == req.user.id);
  res.json(userVenues);
});

// GET all venues (public - for menu display)
app.get('/api/venues', (req, res) => {
  const db = readDB();
  res.json(db.venues);
});

// GET single venue by slug (public)
app.get('/api/venue/:slug', (req, res) => {
  const db = readDB();
  const venue = db.venues.find(v => v.slug === req.params.slug);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });
  res.json(venue);
});

// CREATE venue (authenticated)
app.post('/api/admin/venue', userAuth, (req, res) => {
  const { name, slug, telegramChatId, themeColor, description } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Missing required fields (name, slug)' });
  }

  const db = readDB();

  // Check if slug already exists for this user
  if (db.venues && db.venues.find(v => v.slug === slug && v.userId == req.user.id)) {
    return res.status(400).json({ error: 'Slug already exists for this user' });
  }

  const newVenue = {
    id: Date.now(),
    userId: req.user.id,
    name,
    slug,
    telegramChatId: telegramChatId || '',
    themeColor: themeColor || '#8b5cf6',
    description: description || '',
    menuItems: [],
    createdAt: new Date().toISOString()
  };

  if (!db.venues) db.venues = [];
  db.venues.push(newVenue);
  writeDB(db);

  res.status(201).json(newVenue);
});

// UPDATE venue (authenticated)
app.put('/api/admin/venue/:id', userAuth, (req, res) => {
  const { name, slug, telegramChatId, themeColor, description } = req.body;
  const venueId = parseInt(req.params.id);

  const db = readDB();
  const venue = db.venues.find(v => v.id === venueId);

  if (!venue) return res.status(404).json({ error: 'Venue not found' });
  if (venue.userId != req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  venue.name = name || venue.name;
  venue.slug = slug || venue.slug;
  venue.telegramChatId = telegramChatId || venue.telegramChatId;
  venue.themeColor = themeColor || venue.themeColor;
  venue.description = description || venue.description;

  writeDB(db);
  res.json(venue);
});

// DELETE venue (authenticated)
app.delete('/api/admin/venue/:id', userAuth, (req, res) => {
  const venueId = parseInt(req.params.id);

  const db = readDB();
  const venueIndex = db.venues.findIndex(v => v.id === venueId);

  if (venueIndex === -1) return res.status(404).json({ error: 'Venue not found' });
  if (db.venues[venueIndex].userId != req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  db.venues.splice(venueIndex, 1);
  writeDB(db);

  res.json({ message: 'Venue deleted' });
});

// ============ FILE UPLOAD ENDPOINT ============

// UPLOAD file (authenticated)
app.post('/api/upload', userAuth, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    filename: req.file.filename,
    url: fileUrl,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

// ============ MENU ITEM ENDPOINTS ============

// GET menu items by venue slug (public)
app.get('/api/venue/:slug/menu', (req, res) => {
  const db = readDB();
  const venue = db.venues.find(v => v.slug === req.params.slug);
  if (!venue) return res.status(404).json({ error: 'Venue not found' });
  res.json(venue.menuItems || []);
});

// CREATE menu item (admin only)
app.post('/api/admin/venue/:id/menu-item', adminAuth, (req, res) => {
  const { name, price, description, imageUrl, category } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  const venue = db.venues.find(v => v.id === parseInt(req.params.id));

  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  const newItem = {
    id: Date.now(),
    name,
    price: parseFloat(price),
    description: description || '',
    imageUrl: imageUrl || '',
    category: category || 'Other',
    isAvailable: true,
    createdAt: new Date().toISOString()
  };

  if (!venue.menuItems) venue.menuItems = [];
  venue.menuItems.push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

// UPDATE menu item (admin only)
app.put('/api/admin/menu-item/:itemId', adminAuth, (req, res) => {
  const db = readDB();
  let found = false;

  for (let venue of db.venues) {
    const item = venue.menuItems?.find(m => m.id === parseInt(req.params.itemId));
    if (item) {
      Object.assign(item, req.body);
      found = true;
      break;
    }
  }

  if (!found) return res.status(404).json({ error: 'Item not found' });

  writeDB(db);
  res.json({ message: 'Item updated' });
});

// DELETE menu item (admin only)
app.delete('/api/admin/menu-item/:venueId/:itemId', adminAuth, (req, res) => {
  const db = readDB();
  const venue = db.venues.find(v => v.id === parseInt(req.params.venueId));

  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  venue.menuItems = venue.menuItems.filter(m => m.id !== parseInt(req.params.itemId));
  writeDB(db);
  res.json({ message: 'Item deleted' });
});

// ============ QR CODE GENERATION ============
app.get('/api/admin/venue/:id/qr', adminAuth, async (req, res) => {
  const db = readDB();
  const venue = db.venues.find(v => v.id === parseInt(req.params.id));

  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${venue.slug}`;

  try {
    const qrCode = await QRCode.toDataURL(qrUrl, { width: 300 });
    res.json({ qrCode, url: qrUrl, qrImage: qrCode });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// GET QR Code as PNG (direct image, public)
app.get('/api/venue/:id/qr-image', async (req, res) => {
  const db = readDB();
  const venue = db.venues.find(v => v.id === parseInt(req.params.id));

  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/menu/${venue.slug}`;

  try {
    const qrCode = await QRCode.toBuffer(qrUrl, { width: 300 });
    res.contentType('image/png');
    res.send(qrCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// ============ ORDER ENDPOINTS ============

// CREATE order (public)
app.post('/api/order', async (req, res) => {
  const { slug, cart } = req.body;

  if (!slug || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  const db = readDB();
  const venue = db.venues.find(v => v.slug === slug);

  if (!venue) return res.status(404).json({ error: 'Venue not found' });

  // Create order record
  const order = {
    id: Date.now(),
    venueId: venue.id,
    venueName: venue.name,
    slug,
    cart,
    totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'pending',
    customerPhone: req.body.customerPhone || 'Not provided',
    customerName: req.body.customerName || 'Anonymous',
    createdAt: new Date().toISOString()
  };

  if (!db.orders) db.orders = [];
  db.orders.push(order);
  writeDB(db);

  // Send to Telegram
  if (venue.telegramChatId && process.env.TELEGRAM_BOT_TOKEN) {
    try {
      const message = formatOrderMessage(order);
      await sendTelegramMessage(venue.telegramChatId, message);
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
      // Still return success to client
    }
  }

  res.status(201).json({ orderId: order.id, message: 'Order received' });
});

// GET all orders (admin only)
app.get('/api/admin/orders', adminAuth, (req, res) => {
  const db = readDB();
  res.json(db.orders || []);
});

// GET orders by venue (admin only)
app.get('/api/admin/venue/:id/orders', adminAuth, (req, res) => {
  const db = readDB();
  const orders = (db.orders || []).filter(o => o.venueId === parseInt(req.params.id));
  res.json(orders);
});

// ============ TELEGRAM HELPER ============

const formatOrderMessage = (order) => {
  const items = order.cart
    .map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');

  return `
🍕 <b>New Order - ${order.venueName}</b>

<b>Customer:</b> ${order.customerName}
<b>Phone:</b> ${order.customerPhone}

<b>Items:</b>
${items}

<b>Total:</b> $${order.totalPrice.toFixed(2)}

<b>Order ID:</b> ${order.id}
<i>${new Date(order.createdAt).toLocaleString()}</i>
  `.trim();
};

const sendTelegramMessage = async (chatId, message) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML'
  });
};

// ============ SERVER START ============
app.listen(PORT, () => {
  console.log(`🚀 NoirQR Server running on http://localhost:${PORT}`);
  console.log(`📊 Admin token: ${ADMIN_TOKEN}`);
  console.log(`💾 DB location: ${DB_PATH}`);
});