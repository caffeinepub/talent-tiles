import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { sampleCreators } from "./data/sampleCreators";
import CreatorProfilePage from "./pages/CreatorProfilePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

type View = "login" | "register";

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  const [view, setView] = useState<View>("login");
  const [selectedCreatorId, setSelectedCreatorId] = useState<bigint | null>(
    null,
  );

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

  if (selectedCreatorId !== null) {
    const creator =
      sampleCreators.find((c) => c.id === selectedCreatorId) ??
      sampleCreators[0];
    return (
      <CreatorProfilePage
        creator={creator}
        onBack={() => setSelectedCreatorId(null)}
      />
    );
  }

  return <DashboardPage onViewCreator={(id) => setSelectedCreatorId(id)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
