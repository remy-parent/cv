import { Navigate, Route, Routes } from 'react-router-dom';
import RootRedirect from './routes/RootRedirect';
import LocaleLayout from './routes/LocaleLayout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/:lang" element={<LocaleLayout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
