# LaserTags Test Tools

These HTML pages help you test your QR code workflow without needing a full frontend build.

## Files

### 1. `qr-generator.html` - QR Code Generator
**Purpose:** Create QR codes for testing

**How to use:**
1. Open `qr-generator.html` in your browser
2. Enter contact ID from your database
3. Fill in pet details
4. Click "Generate QR Code"
5. Download the QR code image
6. Print it or view on screen to test scanning

**Features:**
- Live preview of tag design
- Download QR codes as PNG
- Switch between local/production URLs
- Beautiful UI for easy testing

### 2. `contact-page.html` - Contact Landing Page
**Purpose:** What people see when they scan a QR code

**How it works:**
- QR code points to: `http://localhost:3003/contact/1`
- This page fetches contact info from your backend API
- Displays pet name, owner info, and call/email buttons
- Mobile-friendly design

## Testing Workflow

### Quick Test (5 minutes)

1. **Start your backend:**
   ```bash
   cd C:\Projects\McpServer
   npm run dev
   ```

2. **Create a test contact in Claude:**
   ```
   Save a new contact:
   First name: Test
   Last name: Owner
   Pet name: Buddy
   Phone: 555-0100
   Email: test@example.com
   ```
   
   Note the Contact ID that's returned (e.g., ID: 1)

3. **Generate QR code:**
   - Open `qr-generator.html` in browser
   - Enter the Contact ID
   - Click "Generate QR Code"
   - Download the QR code image

4. **Test scanning:**
   - Open the QR code on your computer screen
   - Scan with your phone's camera
   - Should open a URL like: `http://localhost:3003/contact/1`
   - **Note:** Your phone needs to be on the same WiFi network as your computer!

### Full Test (with actual scanning)

If you want to test scanning with your phone:

**Option A: Use ngrok (easiest)**
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3003

# Copy the https URL (e.g., https://abc123.ngrok.io)
# Update qr-generator.html baseUrl to use this URL
```

**Option B: Deploy backend to production**
- Deploy backend to Railway/Render
- Update qr-generator.html baseUrl to production URL
- Generate QR code with production URL

## Setting Up Contact Page in Backend

To make the contact page work, add this route to your backend (`server.js`):

```javascript
// Serve contact landing page
app.get('/contact/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../LaserTags/test-tools/contact-page.html'));
});
```

Or copy `contact-page.html` to your backend's `public` folder.

## Customization

### Change Colors/Design

Edit the `<style>` section in each HTML file:

**QR Generator:**
- Line 16-17: Background gradient
- Line 66: Button color

**Contact Page:**
- Line 13: Background gradient  
- Line 37-38: Header gradient
- Line 159-160: Call button color

### Change API URL

**For Production:**

Edit `contact-page.html` line 189:
```javascript
const API_URL = 'https://your-production-url.com';
```

Edit `qr-generator.html` line 63 to add your production URL:
```html
<option value="https://your-production-url.com">Production</option>
```

## Troubleshooting

### QR code doesn't load on phone

**Problem:** Phone can't reach `localhost:3003`

**Solutions:**
1. Make sure phone is on same WiFi network
2. Find your computer's IP address:
   ```bash
   ipconfig  # Windows
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```
3. Update backend to listen on all interfaces:
   ```javascript
   app.listen(3003, '0.0.0.0', () => { ... });
   ```
4. Generate QR code with IP: `http://192.168.1.100:3003/contact/1`

OR

Use ngrok to create a public URL (recommended for testing)

### Contact info doesn't display

**Check:**
1. Backend server is running: `npm run dev`
2. Contact exists in database: Ask Claude `Get contact 1`
3. Browser console for errors (F12)
4. Backend is configured to allow CORS from HTML file

### QR code generator page is blank

**Solutions:**
1. Check browser console for errors (F12)
2. Make sure you're opening the HTML file (not just the file path)
3. Try different browser (Chrome recommended)

## Production Deployment

When ready to deploy:

1. **Update API URLs:**
   - `contact-page.html`: Change `API_URL` to production backend
   - `qr-generator.html`: Add production URL option

2. **Host contact page:**
   - Copy `contact-page.html` to your deployed frontend
   - Or serve from backend's public folder
   - Must be accessible at `/contact/:id` route

3. **Generate production QR codes:**
   - Use production URL in qr-generator
   - Download and laser engrave on tags
   - Test scanning before shipping to customers

## Tips

- **Test with multiple contacts** - Make sure it works with different IDs
- **Test on mobile** - The contact page is mobile-first
- **Save QR codes** - Keep a copy of generated QR codes with contact ID
- **Print test** - Print a QR code to verify it scans well
- **QR size** - Minimum 2cm x 2cm for reliable scanning

## Example Testing Session

```bash
# Terminal 1 - Start backend
cd C:\Projects\McpServer
npm run dev

# Terminal 2 - Start Claude Desktop MCP
# (Already running)

# Claude Desktop
Save contact: John Doe, pet Max, phone 555-0123, email john@test.com
# Returns: Contact ID: 1

# Browser
Open: qr-generator.html
Enter: Contact ID = 1
Click: Generate QR Code
Click: Download QR Code
Save: lasertag-qr-Max-1.png

# Phone
Scan: lasertag-qr-Max-1.png
Opens: http://localhost:3003/contact/1
See: Max's info with call/email buttons
```

## Next Steps

Once testing is complete:
1. Integrate these into your main LaserTags frontend
2. Deploy backend with contact route
3. Generate production QR codes
4. Laser engrave on actual tags
5. Ship to customers! 🚀
