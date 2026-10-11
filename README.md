# Akram Sherif — Portfolio Website

Bilingual (English default, Arabic secondary) single-page, read-only portfolio for freelance web developer Akram Sherif (أكرم شريف).

Built with React, TypeScript, Vite, and Tailwind CSS, featuring optional Firebase integration (free Spark plan) with automatic fallback to static content.

---

## Firebase Setup (Free Spark Plan)

This application can run completely standalone without Firebase, or connect to a free Firebase project (Spark Plan) for managing projects and profile links via Firestore.

Follow these exact steps to connect your Firebase project:

### 1. Create a Firebase Project
1. Navigate to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and enter a project name.
3. You can disable Google Analytics (optional) and click **Create project**. Ensure the project remains on the free **Spark plan**.

### 2. Enable Firestore Database
1. In the Firebase Console left navigation, select **Build > Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to your users.
4. Start in **Production mode** (security rules will be deployed in Step 5).

### 3. Enable Authentication (Google Sign-In)
1. In the Firebase Console left navigation, select **Build > Authentication**.
2. Click **Get started**.
3. Under the **Sign-in method** tab, choose **Google** and click **Enable**.
4. Configure your project support email and save.

### 4. Register Web App & Copy Configuration to `.env`
1. Go to **Project Settings** (gear icon in the top left) > **General**.
2. Under **Your apps**, click the **Web** icon (`</>`) to add a web application.
3. Give your web app a nickname and click **Register app**.
4. Copy the config parameters and create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project_id.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```

> **Note**: `.env` is ignored by Git in `.gitignore` to prevent committing credentials. See `.env.example` for the template.

### 5. Publish Firestore Security Rules
In the Firebase Console, go to **Firestore Database > Rules**, paste the contents of `firestore.rules`, and click **Publish**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.uid == '1vNYVIKO7TVuFvtIY1oqKCCULvs2';
    }

    match /projects/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /settings/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6. Seed Default Projects
You can populate the initial projects in Firestore using the helper function in `src/lib/seed.ts`:
- Import and execute `seedDefaultProjects()` in the development console, or manually add the documents in the Firebase console:
  - `projects/dahr`:
    - `order`: 1
    - `published`: true
    - `category`: `{ en: "E-commerce", ar: "متجر إلكتروني" }`
    - `title`: `{ en: "Dahr: Perfume E-commerce Website", ar: "Dahr — متجر عطور إلكتروني" }`
    - `description`: `{ en: "...", ar: "..." }`
    - `features`: `{ en: [...], ar: [...] }`
    - `tools`: `["HTML", "CSS", "JavaScript", "React", "Firebase"]`
  - `projects/education`:
    - `order`: 2
    - `published`: true
    - `category`: `{ en: "Education", ar: "تعليم" }`
    - `title`: `{ en: "Education and Study Abroad Website", ar: "موقع تعليمي للدراسة بالخارج" }`
    - `description`: `{ en: "...", ar: "..." }`
    - `features`: `{ en: [...], ar: [...] }`
    - `tools`: `["HTML", "CSS", "JavaScript", "React"]`
  - `settings/profile`:
    - `photoUrl`: `""`
    - `links`: `{ mostaql: "", khamsat: "", upwork: "" }`

---

## Deploy on GitHub Pages

The project is preconfigured with GitHub Actions for automated deployment to GitHub Pages using hash routing (`HashRouter`).

### Exact Deployment Steps

1. **Create the repo and push the code**:
   - Create a new repository on GitHub (e.g. `https://github.com/USERNAME/REPO_NAME`).
   - Push your code to the `main` branch.

2. **Configure Pages Source**:
   - In your GitHub repository, navigate to **Settings** > **Pages**.
   - Under **Build and deployment**, set **Source** to **GitHub Actions**.

3. **Add Repository Variables**:
   - In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions** > **Variables** tab (Repository variables).
   - Add `VITE_BASE`: set to `/REPO_NAME/` (e.g. `/my-portfolio/`, or `/` if deploying to a custom domain or a user site `USERNAME.github.io`).
   - Add the Firebase configuration variables (obtain from Firebase Project Settings > General > Web app):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

4. **Push to main**:
   - Trigger the automated deployment by pushing to `main` (or run manually via **Actions** > **Deploy to GitHub Pages** > **Run workflow**).

5. **Open the site**:
   - Once the action finishes, open your published site at: `https://USERNAME.github.io/REPO_NAME/`

6. **Authorize your domain for Google Sign-In**:
   - In the [Firebase Console](https://console.firebase.google.com/), go to **Authentication** > **Settings** > **Authorized domains**.
   - Click **Add domain** and enter `USERNAME.github.io`.
   - This ensures Google Authentication works securely on your GitHub Pages site.

### Admin Dashboard Address
The protected administrator dashboard is accessible directly at:
```
https://USERNAME.github.io/REPO_NAME/#/admin
```
*(Direct visits and refreshes work without 404 errors thanks to `HashRouter`)*

---

## Static Fallback Behavior
If Firebase environment variables are not supplied or Firestore is unreachable:
- The site continues to run smoothly with zero console errors.
- Content is loaded seamlessly from `src/content/site.ts`.
- A single informational warning is logged to the browser console.
