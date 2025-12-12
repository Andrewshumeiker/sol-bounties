import type { AppProps } from 'next/app';
import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

// Importa estilos globales
import '../styles/globals.css';

// Import CSS para los componentes del wallet modal
require('@solana/wallet-adapter-react-ui/styles.css');

/**
 * Este componente de nivel superior configura el proveedor de conexión
 * con la blockchain de Solana y registra los wallets disponibles.
 */
function MyApp({ Component, pageProps }: AppProps) {
  // Obtiene el endpoint RPC desde la variable de entorno o usa mainnet por defecto
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ||
    'https://api.mainnet-beta.solana.com';
  // Instancia de wallets disponibles. Aquí sólo se registra Phantom
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Component {...pageProps} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;