import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Game } from "./pages/Game/Game";
import { GameSummary } from "./pages/GameSummary/GameSummary";
import { Login } from "./pages/Auth/Login";
import { Register } from "./pages/Auth/Register";
import Main from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound";
import { GET_ME } from "./graphql/queries/getMe";
import { useAuthStore } from "./stores/authStore";
import { useTokenRefresh } from "./hooks/useTokenRefresh";
import { TokenRefreshIndicator } from "./components/TokenRefreshIndicator/TokenRefreshIndicator";

export default function App() {
  const { setUser } = useAuthStore();
  const { data } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
  });

  // Automatically refresh tokens before expiry
  useTokenRefresh();

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data, setUser]);

  return (
    <>
      <TokenRefreshIndicator />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/game" element={<Game />} />
        <Route path="/summary" element={<GameSummary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
