# 🧪 NoirQR MVP - Quick Testing Guide

## ✅ Servers Running

Both servers are currently running:
- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173

## 🎯 Test Scenario 1: User Isolation (CRITICAL TEST)

### Objective
Verify that each user sees only their own venues and menus.

### Steps

#### Part A: Create First Account
1. Open browser → `http://localhost:5173`
2. Click "Create Account"
3. Register:
   - Email: `user1@example.com`
   - Password: `password123`
4. ✅ Should redirect to Admin Page
5. Click "Add Venue"
6. Create venue:
   - Name: `Coffee Shop A`
   - Slug: `coffee-a`
   - Theme Color: `#FF6B6B` (red)
7. ✅ Venue should appear in list
8. Click "Edit Menu"
9. Add first menu item:
   - Name: `Cappuccino`
   - Price: `150`
   - Category: `☕ Напитки`
   - Upload or paste image URL
10. ✅ Item should appear in menu list

#### Part B: Create Second Account
1. Click Logout (top right)
2. Click "Create Account"
3. Register:
   - Email: `user2@example.com`
   - Password: `password123`
4. ✅ Should redirect to Admin Page with EMPTY venues list (important!)
5. Create venue:
   - Name: `Burger Place B`
   - Slug: `burger-b`
   - Theme Color: `#4ECDC4` (teal)
6. ✅ Venue should appear in list
7. Add menu item:
   - Name: `Cheeseburger`
   - Price: `250`
   - Category: `🍔 Основное`

#### Part C: Verify Isolation
1. **Still logged in as user2** - Admin Page shows only "Burger Place B" ✅
2. Click Logout
3. Login as `user1@example.com` / `password123`
4. ✅ Admin Page should show ONLY "Coffee Shop A" (not "Burger Place B")
5. Click Edit Menu on "Coffee Shop A"
6. ✅ Menu should show ONLY "Cappuccino" (not "Cheeseburger")
7. Click Logout
8. Login as `user2@example.com`
9. ✅ Admin Page shows ONLY "Burger Place B"

**Expected Result:** ✅ Each user sees only their own venues

---

## 📤 Test Scenario 2: File Upload

### Objective
Verify that users can upload image files for menu items.

### Steps

1. Login with any account (or use demo: `demo@noirqr.com` / `demo1234`)
2. Go to Admin Page
3. Click on any venue → Edit Menu
4. Click "Add Venue Item" button
5. In the form, find the image section with "📤 Choose File" button
6. Click the button and select an image file (JPEG/PNG)
7. ✅ File should upload (you'll see a brief loading state)
8. ✅ Image preview should appear
9. Complete the form and save item
10. ✅ Image should display in the menu list

### Alternative: URL Image
1. Instead of uploading, enter a URL in the "OR" section:
   - Example: `https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500`
2. ✅ Image preview should appear
3. Save item
4. ✅ Image should display in menu

---

## ✏️ Test Scenario 3: Menu Item Editing

### Objective
Verify full CRUD operations on menu items.

### Steps

1. Login and go to Admin Page
2. Edit Menu for any venue
3. Add a menu item:
   - Name: `Test Item`
   - Price: `100`
   - Description: `Test description`
   - Category: Any
4. ✅ Item appears in list

#### Edit Item
5. Click ✏️ Edit button on the item
6. ✅ Form fills with item data
7. Change:
   - Name: `Updated Item`
   - Price: `150`
   - Description: `Updated description`
8. Click Save
9. ✅ Item updates in list immediately

#### Delete Item
10. Click 🗑️ Delete button
11. ✅ Confirmation dialog appears
12. Click OK
13. ✅ Item removed from list

---

## 🧬 Test Scenario 4: Demo Account

### Objective
Test with pre-existing demo account (instant login).

### Steps

1. Open http://localhost:5173
2. Click "Login"
3. Email: `demo@noirqr.com`
4. Password: `demo1234`
5. ✅ Should log in and show existing venues
6. Try editing one of the demo venues
7. Try adding/editing/deleting menu items
8. Try uploading images

---

## 🔴 Troubleshooting

### Issue: Can't upload file
**Solution:**
- Check backend is running on port 3001
- Check `/uploads` directory exists in `server/`
- Check file is <5MB and is JPEG/PNG/GIF/WebP
- Check browser console for error messages

### Issue: Venues from other users are visible
**Solution:**
- Clear localStorage: F12 → Application → Storage → Clear All
- Logout and login again
- Check that you're using the latest token

### Issue: Images not displaying
**Solution:**
- Verify image URL is correct
- For uploaded files, check `/uploads` directory in server folder
- Check browser console for 404 errors

### Issue: Can't login
**Solution:**
- Verify backend is running: `http://localhost:3001` should respond
- Check email/password are correct
- Try registering new account
- Check browser console for errors

---

## 📊 Demo Data

### Pre-existing Demo Account
- Email: `demo@noirqr.com`
- Password: `demo1234`
- Has some sample venues (you can see them after login)

### Test Accounts (create yourself)
- Account 1: `user1@test.com` / `pass123`
- Account 2: `user2@test.com` / `pass123`

---

## ✨ What Should Work

- ✅ Register new account
- ✅ Login with email/password
- ✅ See only your venues in Admin Page
- ✅ Create new venues
- ✅ Edit venue details
- ✅ Delete venues
- ✅ Create menu items with prices in ₴ (hryvnias)
- ✅ Upload images via file picker
- ✅ Use image URLs (optional)
- ✅ Edit menu items
- ✅ Delete menu items
- ✅ Logout and login with different account - see different data
- ✅ All prices show ₴ symbol (not ₽)

---

## 🎉 Success Criteria

All tests pass when:
1. Each registered user sees ONLY their own venues
2. Users can successfully upload image files
3. Menu items can be created/edited/deleted
4. All prices display with ₴ symbol
5. Different users don't see each other's data
6. File upload shows preview before saving

---

**Last Updated:** 2025-01-30
**Servers Status:** ✅ Running (Backend: 3001, Frontend: 5173)
