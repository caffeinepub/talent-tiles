# Talent Tiles

## Current State
- React + Motoko full-stack app on ICP
- Auth: Internet Identity (no username/password)
- LoginPage shows an "Login with Internet Identity" button
- DashboardPage is rendered after II login
- App.tsx routes based on `identity` from `useInternetIdentity`
- Backend: stores CreatorProfiles with 12 sample entries; uses authorization mixin
- No Register page exists
- No username/password system exists

## Requested Changes (Diff)

### Add
- Backend: `registerUser(username, password)` -- stores hashed credentials per principal, returns success/error
- Backend: `loginUser(username, password)` -- validates credentials, returns session token / success flag
- Backend: `logoutUser()` -- invalidates session
- Frontend: `AuthContext` (React context acting as AuthService) -- holds auth state (isLoggedIn, username), exposes login/register/logout functions
- Frontend: `RegisterPage` -- form with username + password + confirm password fields; on success redirects to Login
- Frontend: `LoginPage` (updated) -- username + password form; "Register" link below; on success redirects to Dashboard
- Frontend: Route guard logic -- if not authenticated, redirect to Login; Dashboard only accessible when logged in

### Modify
- `LoginPage.tsx` -- replace Internet Identity button with username/password form; keep purple branding and hero panel
- `App.tsx` -- replace II-based routing with AuthContext-based routing; add route for `/register`; protect `/dashboard`
- Backend `main.mo` -- add user credentials storage and auth functions alongside existing creator data

### Remove
- Direct usage of `useInternetIdentity` for auth routing in `App.tsx` (keep the hook file for potential future use)
- Internet Identity login button from the login form UI

## Implementation Plan
1. Update `main.mo` to add username/password auth: store user records (username + hashed password), `registerUser`, `loginUser`, `logoutUser`, `isAuthenticated` query
2. Regenerate backend bindings (`backend.d.ts`) via `generate_motoko_code`
3. Create `src/frontend/src/context/AuthContext.tsx` -- React context with `login(username, password)`, `register(username, password)`, `logout()`, `isLoggedIn`, `username` state; uses backend calls
4. Create `src/frontend/src/pages/RegisterPage.tsx` -- form page with username/password/confirm fields, calls `AuthContext.register`, redirects to login on success
5. Update `src/frontend/src/pages/LoginPage.tsx` -- replace II button with username + password form, add "Register" link, call `AuthContext.login`, redirect to dashboard on success
6. Update `src/frontend/src/App.tsx` -- wrap with `AuthProvider`, implement route logic: unauthenticated → LoginPage, `/register` → RegisterPage, authenticated → DashboardPage (protected)
7. Update `DashboardPage.tsx` -- use `AuthContext` for logout and display username instead of principal
