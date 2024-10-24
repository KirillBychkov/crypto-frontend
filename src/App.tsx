// import PusherClient from 'pusher-js';
import { Outlet } from 'react-router-dom';
import * as Toast from "@radix-ui/react-toast";
import { ThemeProvider } from './components/theme-provider';
import { createContext, useState } from "react";

export const ToastContext = createContext({
    open: false,
    status: false,
    text: ""
});

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
    const [toast, setToast] = useState({
        open: false,
        status: false,
        text: ""
    });

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastContext.Provider value={{ toast, setToast }}>
            <Toast.Provider swipeDirection="right">
              <Outlet />

              <Toast.Root
                className={(!toast.status? "bg-green-700" : "bg-red-700") + " grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"}
                open={toast.open}
                onOpenChange={(open) => setToast(toast => ({ ...toast, open }))}
              >
                <Toast.Title className="mb-[5px] text-[15px] font-medium text-white [grid-area:_title]">
                    {toast.text}
                </Toast.Title>
                <Toast.Action className="[grid-area:_action]"
                    asChild altText="Goto schedule to undo">
                    <button className="inline-flex h-[25px] items-center justify-center rounded bg-background px-2.5 text-xs font-medium leading-[25px] text-white">
                        Close
                    </button>
                </Toast.Action>
              </Toast.Root>

              <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
            </Toast.Provider>
        </ToastContext.Provider>
    </ThemeProvider>
  );
}

export default App;
