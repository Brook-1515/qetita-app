# Qetita — Direct Rent & Sale Platform (MVP)

Cross-platform starter app for Android, iOS and Web, with Amharic/English UI.

## Included in this MVP
- Browse sample rental and sale listings
- Search by title, neighbourhood or location
- Switch between Rent and Sale
- Property detail view with price, bedrooms, bathrooms and size
- Direct call and WhatsApp contact buttons (uses the device's installed apps)
- Add-listing form (local demo state only)
- Amharic / English language toggle

## Run it
1. Install Node.js (LTS) and npm.
2. Unzip this project and open a terminal in the project folder.
3. Run `npm install`.
4. Run `npx expo start`.
5. Scan the QR code with Expo Go, or press `a` for Android, `i` for iOS simulator, or `w` for web.

## Important MVP limitations
This is a working front-end prototype with sample data. It does **not** yet have:
- A production backend or cloud database
- Real user registration, login, or identity verification
- Persistent listing uploads / photo storage
- Live maps or GPS
- Payment processing or service-charge collection
- Admin moderation and fraud reporting

Before launch, connect a secure backend (for example, Supabase or Firebase), implement phone OTP authentication, verify property ownership, add moderation, and obtain legal/payment-provider approval. Never collect or store sensitive identity documents in this demo.

## Suggested next build phase
Backend schema, user accounts, verified-owner workflow, image upload, map integration, moderation dashboard, and payment-provider integration.


## Android APK build (cloud, no computer needed for the build itself)

This project includes `eas.json` with an internal Android APK profile. Expo Application Services (EAS) builds the APK on Expo's servers.

The build still needs an Expo account and an authenticated EAS CLI session to link the project and start the cloud build. This ZIP alone is not an APK. Once the cloud build completes, Expo provides an install link that can be opened on the Android phone.

Build command after project setup:
`eas build --platform android --profile preview`

For a first-time setup, EAS also needs the project linked to an Expo account (`eas login` and `eas build:configure`). Keep account passwords and access tokens private; do not send them in chat.
