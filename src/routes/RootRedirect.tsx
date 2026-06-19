import { Navigate } from 'react-router-dom';
import { detectLang } from '../i18n/language';

export default function RootRedirect() {
  return <Navigate to={`/${detectLang()}`} replace />;
}
