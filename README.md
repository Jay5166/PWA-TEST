# Business AI Assistant PWA + Push Notification Hub

A complete Progressive Web App (PWA) prototype combining:
- **Groq AI Chatbot** (powered by LLaMA 3.3 70B, strictly grounded in the business knowledge base)
- **Admin Knowledge Base Editor** (live browser-backed business truth source)
- **Web Push Notifications** (text & rich image notifications via VAPID & Service Worker)
- **PWA Installation** (instant Android/desktop installation & iOS Safari Add-to-Home-Screen guide)
- **QR Code Launcher** (auto-configured to current origin for instant smartphone testing)
- **Admin Control Dashboard** (stats, subscriber viewer, AI tester, notification composer)

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Service Worker & PWA**: `/public/sw.js`, `/public/manifest.json`, Web Push API
- **Backend / APIs**: Express & Vercel Serverless Functions (`/api/chat`, `/api/push/subscribe`, `/api/push/send`, `/api/push/subscribers`, `/api/push/vapid-public-key`)
- **AI Engine**: Groq Cloud API (`llama-3.3-70b-versatile`)
- **Data Layer**: Browser Storage (`localStorage` for Knowledge Base, settings, and histories) + Server memory for active push subscriber endpoints.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` (for local development or Vercel Environment Variables):

```env
# Groq AI Cloud API (https://console.groq.com)
GROQ_API_KEY="gsk_..."
GROQ_MODEL="llama-3.3-70b-versatile"

# Web Push VAPID Keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY="B..."
VAPID_PUBLIC_KEY="B..."
VAPID_PRIVATE_KEY="..."
VAPID_SUBJECT="mailto:admin@example.com"

# Port & URL
PORT="3000"
APP_URL="http://localhost:3000"
```

### How to Generate VAPID Keys

Run this one-line command in your terminal:

```bash
npx web-push generate-vapid-keys
```

It will output:
```text
Public Key:
BN...

Private Key:
xy...
```
- Copy the **Public Key** to both `NEXT_PUBLIC_VAPID_PUBLIC_KEY` and `VAPID_PUBLIC_KEY`.
- Copy the **Private Key** to `VAPID_PRIVATE_KEY`.

> **Note**: For local prototype testing, the server automatically generates ephemeral VAPID keys if none are set, allowing you to test Web Push immediately without setup friction!

---

## 🚀 How to Run Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build & Preview**:
   ```bash
   npm run build
   npm run preview
   ```

---

## ☁️ Deploying Directly to Vercel

1. Push this repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework Preset: **Vite** (Root directory: `./`).
4. Add the Environment Variables:
   - `GROQ_API_KEY`
   - `GROQ_MODEL` (`llama-3.3-70b-versatile`)
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_SUBJECT`
5. Click **Deploy**. Vercel will automatically build the client SPA and serve the serverless functions in `/api/*`!

---

## 🧪 STEP-BY-STEP TESTING GUIDE

Follow this exact workflow to test and demonstrate every module:

### Step 1: Open the Customer PWA
- Go to `http://localhost:3000` (or your deployed Vercel HTTPS URL).
- Notice the business branding: **ABC Digital Solutions**, logo badge, and quick actions.

### Step 2: Test Notification Permission Flow
1. On the main home screen, locate the **"🔔 STAY UPDATED"** section.
2. Click **[ ENABLE NOTIFICATIONS ]**.
3. Your browser will prompt: *"ais-... wants to show notifications"*. Click **Allow**.
4. Notice the section automatically updates to: **"✓ Notifications Enabled — You will receive important updates"**.
5. The button never asks repeatedly once granted.

### Step 3: Test PWA Installation
- **On Chromium/Android**: Click **[ INSTALL APP ]** in the "📱 Mobile Experience" banner. The browser's native install dialog appears.
- **On iOS Safari**: Click **[ Install on iOS / Safari ]**. A step-by-step visual sheet guides the user to tap **Share** -> **Add to Home Screen** -> **Add**.
- Once running in standalone mode, the install button automatically hides!

### Step 4: Test Groq AI Business Chatbot
1. Tap the **"🤖 ASK OUR AI"** button (or bottom nav **AI Chat**).
2. Ask:
   ```text
   What services do you provide?
   ```
3. The AI reads the Knowledge Base and answers:
   ```text
   We provide Website Development, Mobile App Development, SEO, Digital Marketing, and E-commerce Development.
   ```
4. Ask about business hours:
   ```text
   What are your hours on Saturday?
   ```
   AI responds with exact Saturday emergency hours from the Knowledge Base.

### Step 5: Test the Admin Control Panel
1. Click the **[ Admin ]** button in the top header (or bottom navigation).
2. Enter the demo credentials:
   - **Email**: `admin@example.com`
   - **Password**: `admin123`
   *(Or click "Autofill" for 1-click test)*.
3. You are now inside the **Admin Dashboard** showing:
   - Connected Subscribers
   - Sent Notifications
   - Knowledge Base Status
   - Groq AI Status

### Step 6: Test Real-Time Knowledge Base Updates
1. In the Admin sidebar, click **Knowledge Base**.
2. Add a new service line to the text:
   ```text
   6. AI Automation & Custom Chatbot Integrations: Enterprise LLM pipelines and automation workflows.
   ```
3. Click **[ SAVE KNOWLEDGE BASE ]**. Toast confirms: *"✓ Knowledge Base saved successfully"*.
4. Click **[ Test AI ]** (or go to **AI Assistant Test** in sidebar).
5. Type:
   ```text
   Do you provide AI automation?
   ```
6. The AI answers using the newly updated knowledge base:
   ```text
   Yes! We provide AI Automation & Custom Chatbot Integrations...
   ```

### Step 7: Test Sending a Push Notification
1. In the Admin sidebar, navigate to **Send Notification**.
2. Fill in:
   - **Title**: `New Service Available`
   - **Message**: `We now provide AI automation and custom chatbot integrations!`
   - **Button Action Text**: `Explore AI`
3. Click **[ SEND NOTIFICATION ]**.
4. The system broadcasts the Web Push message to all connected subscriber devices!
5. If testing on your phone or browser, an OS-level push notification alert pops up!
6. Click **Notification History** in the sidebar to inspect the delivery record.

### Step 8: Test Smartphone Onboarding via QR Code
1. In the Admin sidebar, go to **QR Code Launcher**.
2. The page displays a crisp QR code pointing to `window.location.origin`.
3. Open your smartphone camera and scan the QR code.
4. Open the link on your phone, click **Enable Notifications**, and send a push notification from your computer admin dashboard to see your phone alert in real-time!

---

## ⚠️ Prototype Notes & Architecture

This application is built as a **rapid client prototype**:
- **Local Browser Storage**: Knowledge base, chat history, settings, and notification logs are stored in `localStorage` for zero-setup portability.
- **In-Memory Push Store**: Subscriber endpoints are held in server memory for active demonstration sessions.
- **Production Migration**: To convert this prototype into a multi-tenant enterprise system, replace `localStorage` and in-memory subscriptions with PostgreSQL, Supabase, or MongoDB.
