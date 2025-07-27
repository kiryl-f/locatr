import { Routes, Route } from "react-router-dom";
import { Game } from "./pages/Game/Game";
import Main from "./pages/Main/Main";
import NotFound from "./pages/NotFound/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/game" element={<Game />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
