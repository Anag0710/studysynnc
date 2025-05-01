import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { GroupProvider } from '../contexts/GroupContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <GroupProvider>
        <Component {...pageProps} />
      </GroupProvider>
    </AuthProvider>
  );
}

export default MyApp;