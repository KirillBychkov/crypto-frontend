// import PusherClient from 'pusher-js';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';

// export const pusherClient = new PusherClient("app-key", {
//     cluster: "",
//     httpHost: "127.0.0.1",
//     httpPort: 6001,
//     wsHost: "127.0.0.1",
//     wsPort: 6001,
//     wssPort: 6001,
//     forceTLS: false,
//     enabledTransports: ["ws", "wss"],
//     authTransport: "ajax",
//     authEndpoint: "/api/pusher-auth",
//     auth: {
//         headers: {
//             "Content-Type": "application/json",
//         },
//     },
// });

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
    </ThemeProvider>
  );
}

export default App;
