import { Routes, Route } from 'react-router';
import Game from '../pages/Game';
import Home from '../pages/Home';

function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path=":gameId" element={<Game />} />
    </Routes>
  );
}

export default AppRoutes;
