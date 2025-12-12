# Sol Bounties API

Este proyecto es el esqueleto inicial de la API para **Sol Bounties**, una plataforma gamificada donde los usuarios completan retos (bounties) para ganar puntos, obtener insignias (badges) y subir de nivel. Está construido en **Node.js** con **NestJS** siguiendo una arquitectura modular y desacoplada.

## Características clave

Las funcionalidades que se pretenden incluir en la primera versión incluyen:

1. **Registro y autenticación de usuarios**: permitir que nuevos usuarios creen una cuenta y que usuarios existentes inicien sesión de forma segura.
2. **Gestión de perfiles**: cada usuario tiene un perfil donde se muestran sus puntos acumulados, badges obtenidos y el nivel o tier alcanzado.
3. **Retos/Bounties**: listar y gestionar bounties. Los usuarios pueden explorar los desafíos disponibles, y los administradores pueden crearlos, editarlos o cerrarlos.
4. **Envío de soluciones (submissions)**: los participantes pueden subir sus respuestas o entregas para un bounty y así optar por puntos y recompensas.
5. **Sistema de leaderboard**: clasificaciones globales y por temporada para mostrar el progreso y la competitividad entre los usuarios.
6. **Insignias y niveles**: otorgar badges y subir de tier a los usuarios según su actividad y puntos acumulados.
7. **Notificaciones**: alertas básicas cuando se publica un nuevo bounty, cuando un submission es aceptado o se reciben nuevas recompensas.
8. **Panel administrativo**: interfaz para que los administradores gestionen bounties y moderen submissions.
9. **Conexión con la red de Solana**: exponer un endpoint que permita consultar el saldo en SOL de una dirección pública. Esta funcionalidad hace posible integrar un frontend con la wallet Phantom: el usuario se conecta con Phantom, se obtiene su clave pública y se consulta el saldo a través de la API.

## Historias de usuario básicas

Algunas historias de usuario que guían el diseño de estas funcionalidades son:

- **Como usuario quiero registrarme y acceder a la plataforma** para poder participar en los bounties.
- **Como usuario quiero ver mi perfil con mis puntos, badges y nivel** para conocer mi progreso dentro de la plataforma.
- **Como usuario quiero explorar los bounties disponibles** para elegir en cuáles participar.
- **Como usuario quiero subir una solución a un bounty** para obtener puntos y recompensas.
- **Como usuario quiero ver el ranking general** para comparar mi posición con otros usuarios.
- **Como administrador quiero crear, editar y cerrar bounties** para mantener la plataforma actualizada y relevante.
 - **Como usuario quiero conectar mi wallet de Solana (Phantom) y ver mi saldo** para saber cuántos SOL tengo disponibles antes de participar en los bounties.

Estas historias se irán refinando y ampliando a medida que evolucione el desarrollo.

## Estructura del proyecto

El árbol de directorios principal es el siguiente:

```
sol-bounties-api/
├─ src/
│  ├─ main.ts                 # punto de entrada de la aplicación NestJS
│  ├─ app.module.ts           # módulo raíz que importa los demás módulos
│  ├─ config/                 # configuración de entorno y de la base de datos
│  ├─ common/                 # componentes comunes (dtos, filtros, guards, etc.)
│  ├─ infra/                  # capa de infraestructura (db, proveedores externos)
│  └─ modules/                # módulos de dominio
│     ├─ auth/                # autenticación y autorización
│     ├─ users/               # gestión de usuarios
│     ├─ profiles/            # datos públicos/privados del usuario
│     ├─ bounties/            # retos y recompensas
│     ├─ submissions/         # envíos de los usuarios
│     ├─ leaderboard/         # rankings
│     ├─ badges/              # insignias
│     ├─ tiers/               # niveles de usuario
│     ├─ notifications/       # notificaciones de sistema
│     ├─ solana/              # integración con la red de Solana (balance de wallets)
│     └─ wallet/              # solicitud y verificación de firmas con wallets Phantom
└─ README.md
```

Cada módulo contiene sus propios controladores, servicios, dtos y entidades para favorecer la cohesión y la separación de responsabilidades. Este esqueleto se irá completando y ajustando a medida que se definan nuevas historias de usuario y requisitos de negocio.

## Integración con Phantom y consulta de saldo

Para permitir que los usuarios consulten su saldo en la red de Solana, se ha creado un nuevo módulo `solana`. Este módulo utiliza la biblioteca [`@solana/web3.js`](https://github.com/solana-labs/solana-web3.js) para conectarse a un nodo JSON‑RPC y exponer un servicio que calcula el saldo de una cuenta.

1. **Configura el endpoint RPC**: en el archivo `.env` define la variable `SOLANA_RPC_ENDPOINT` con la URL de tu nodo RPC (por defecto se utiliza `https://api.mainnet-beta.solana.com`).
2. **Obtén la dirección pública**: en el frontend, usa `window.phantom.solana.connect()` o la biblioteca `@solana/wallet-adapter` para conectar la wallet Phantom del usuario y extraer su clave pública.
3. **Consulta el saldo**: realiza una petición `GET` a `/api/v1/solana/balance/{publicKey}` (sustituyendo `{publicKey}` por la clave pública obtenida). La respuesta tendrá el formato `{ "address": "...", "balance": 1.23 }` donde `balance` está expresado en SOL.

Esta integración permite que los usuarios visualicen su saldo directamente dentro de la plataforma, mejorando la experiencia y fomentando la transparencia sobre sus recursos disponibles antes de participar en los retos.

## Verificación de wallets Phantom y asociación a usuarios

Además de consultar el saldo, la API implementa un mecanismo de **firma de mensajes** para asociar de forma segura una wallet Phantom a un usuario. El flujo es el siguiente:

1. **Solicitar mensaje de firma** (`POST /wallet/request-message`): el cliente envía su `userId` y el backend devuelve un texto único con un nonce y la fecha de emisión. Este mensaje queda almacenado temporalmente en el servidor.
2. **Firmar el mensaje en el frontend**: usando la API de Phantom (`signMessage`) o las utilidades de `@solana/wallet-adapter`, el usuario firma el mensaje y obtiene una firma (`Uint8Array`) que se codifica en base58. El frontend también conoce la clave pública de la wallet.
3. **Verificar la firma** (`POST /wallet/verify`): el frontend envía el `userId`, la clave pública (`publicKey`), la firma (`signature`) y el mensaje original. El backend verifica que el mensaje coincide con el emitido anteriormente y utiliza `nacl.sign.detached.verify` con `tweetnacl` para comprobar la firma【114656727194764†L1024-L1040】. Si es correcta, actualiza el usuario asociando su `walletAddress` a la clave pública proporcionada y devuelve `{ verified: true }`.

Esta implementación sigue las recomendaciones oficiales de Phantom para solicitar firmas a los usuarios y validarlas en el servidor. Al utilizar un nonce aleatorio y almacenar el mensaje en el backend, se previenen ataques de repetición y se garantiza que la firma corresponde a un mensaje generado por la propia API.

## Frontend de ejemplo con Next.js

La carpeta **`sol-bounties-web`** contiene un frontend básico creado con **Next.js** y React. Esta aplicación demuestra cómo conectar la wallet Phantom, solicitar el mensaje de firma a la API y verificar la firma. Características principales:

- Utiliza los paquetes `@solana/wallet-adapter-react` y `@solana/wallet-adapter-react-ui` para gestionar wallets y mostrar un botón listo para usar (`WalletMultiButton`).
- Contiene un botón “Verificar Wallet” que, una vez conectada la wallet, realiza el siguiente flujo:
  1. Envía una solicitud al backend (`/wallet/request-message`) para obtener el mensaje a firmar.
  2. Firma el mensaje con la wallet del usuario usando el método `signMessage` y codifica la firma en base58.
  3. Envía la firma, el mensaje y la clave pública al endpoint `/wallet/verify` para validar la firma.
  4. Muestra al usuario si la verificación fue exitosa o un error en caso contrario.

Para ejecutar el frontend localmente:

```bash
cd sol-bounties-web
npm install
npm run dev
```

Debes definir la variable de entorno `NEXT_PUBLIC_API_BASE_URL` con la URL base de la API (por ejemplo `http://localhost:3000/api/v1`). También puedes configurar `NEXT_PUBLIC_SOLANA_RPC_ENDPOINT` para apuntar a tu nodo RPC si no utilizas el predeterminado (`https://api.mainnet-beta.solana.com`).

Este frontend proporciona un punto de partida sobre cómo integrar la autenticación de wallets en el cliente. A partir de aquí se pueden añadir más páginas, estilos y lógica de negocio para manejar registros, envíos de bounties, listado de retos, etc.

## Sistema de insignias (MVP)

Para gamificar la experiencia de Sol Bounties se ha diseñado un sistema de insignias inspirado en buenas prácticas de gamificación. Las insignias no solo sirven como recompensas estéticas, sino que guían y refuerzan comportamientos clave para el crecimiento de la plataforma【593216356805316†L31-L37】. A continuación se describen las diez insignias incluidas en el MVP:

| Código | Nombre | Descripción | Requisito |
|------|--------|-------------|-----------|
| `FIRST_BOUNTY_WIN` | Primer Bounty | Reconoce al usuario por completar y ganar su primer bounty | Completar y obtener la aprobación en tu primer bounty |
| `FIVE_BOUNTIES` | Cazador Novato | Premia la constancia inicial | Completar 5 bounties con éxito |
| `STREAK_7_DAYS` | Constancia | Fomenta la participación regular | Enviar submissions durante 7 días consecutivos |
| `COMMUNITY_HELPER` | Comunidad Activa | Incentiva el apoyo y colaboración | Dar feedback útil o votar 10 submissions de otros usuarios |
| `GITHUB_CONNECT` | GitHub Integrado | Favorece la integración con repositorios de código | Conectar tu cuenta de GitHub y realizar tu primer PR a través de la plataforma |
| `FAST_SOLVER` | Velocidad | Motiva a resolver rápidamente los retos | Ser el primer usuario en enviar una solución correcta a un bounty |
| `POINTS_1000` | Leyenda | Reconoce a los usuarios de alto impacto | Alcanzar un total acumulado de 1 000 puntos en la plataforma |
| `SEASON_WINNER` | Campeón de Temporada | Celebra el rendimiento global | Finalizar una temporada en el top 3 del leaderboard |
| `WALLET_VERIFIED` | Wallet Verificada | Valida la identidad y acceso Web3 | Completar el flujo de verificación de wallet Phantom |
| `WELCOME` | Bienvenido | Da la bienvenida a nuevos usuarios | Registrarte en la plataforma |

El sistema de insignias se puede extender fácilmente añadiendo nuevos códigos y requisitos en `BadgesService`. Cada insignia está diseñada para alinear acciones individuales con el valor de la comunidad【593216356805316†L96-L104】; por ejemplo, “Comunidad Activa” recompensa acciones que mejoran la calidad del contenido, y “GitHub Integrado” promueve la colaboración con proyectos reales.

### Ejemplo de flujo de otorgamiento

Cuando un usuario verifica su wallet con Phantom, el endpoint `/wallet/verify` no sólo actualiza su dirección, sino que también asigna automáticamente la insignia `WALLET_VERIFIED`. De manera similar, tras crear una cuenta, el servicio de usuarios puede otorgar la insignia `WELCOME`. Para otros eventos, como completar bounties o conectar GitHub, se puede invocar el método `BadgesService.awardBadge` desde los servicios correspondientes.

### Buenas prácticas para el futuro

Implementar distintos tipos de insignias —basadas en esfuerzo, consistencia, contribución social o excelencia— permite que usuarios con distintos perfiles encuentren motivaciones alineadas con sus intereses【593216356805316†L122-L130】. Además, mostrar públicamente estas insignias puede generar reconocimiento y reputación dentro y fuera de la plataforma【593216356805316†L51-L60】.