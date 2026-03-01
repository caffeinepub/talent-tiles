import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

type View = "login" | "register";

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  const [view, setView] = useState<View>("login");

  if (!isLoggedIn) {
    if (view === "register") {
      return (
        <RegisterPage
          onRegisterSuccess={() => setView("login")}
          onNavigateToLogin={() => setView("login")}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={() => {}}
        onNavigateToRegister={() => setView("register")}
      />
    );
  }

  return <DashboardPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
