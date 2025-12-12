import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import bs58 from 'bs58';

/**
 * Página de inicio de la aplicación web. Permite al usuario conectar su wallet
 * Phantom, solicitar un mensaje de firma al backend y verificar la firma.
 * Una vez verificada, el backend asociará la wallet al usuario y el frontend
 * mostrará un mensaje de confirmación.
 */
export default function Home() {
  const { publicKey, signMessage } = useWallet();
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Identificador de usuario con el que se probará la vinculación. En un
  // entorno real, este valor debería provenir de la sesión o autenticación.
  const userId = 'demo-user-id';

  /**
   * Maneja el flujo de verificación. Envía una solicitud al API para
   * generar el mensaje, luego firma el mensaje con la wallet Phantom y
   * finalmente envía la firma al API para su verificación.
   */
  const handleVerify = async () => {
    setError(null);
    if (!publicKey || !signMessage) {
      setError('Conecta tu wallet Phantom antes de continuar');
      return;
    }
    try {
      // Solicitar el mensaje a firmar al backend
      const reqRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/wallet/request-message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        },
      );
      const { message } = await reqRes.json();
      // Firmar el mensaje usando la wallet
      const encoded = new TextEncoder().encode(message);
      const signed = await signMessage!(encoded);
      const signature = bs58.encode(signed);
      // Enviar la firma al backend para verificación
      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || '/api'}/wallet/verify`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            publicKey: publicKey.toBase58(),
            signature,
            message,
          }),
        },
      );
      const verifyData = await verifyRes.json();
      if (verifyData.verified) {
        setVerified(true);
      } else {
        setError('No se pudo verificar la firma');
      }
    } catch (e: any) {
      setError(e.message || 'Error inesperado');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-4">
      <h1 className="text-2xl font-semibold">Bienvenido a Sol Bounties</h1>
      {/* Botón para conectar la wallet */}
      <WalletMultiButton />
      {publicKey && (
        <button
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          onClick={handleVerify}
        >
          Verificar Wallet
        </button>
      )}
      {verified && (
        <p className="text-green-600">Wallet verificada correctamente 🎉</p>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}