import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './queryClient.ts';
import { callLogin } from "@/auth/KeycloakService.ts";
import './index.css';

const renderApp = function() {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        // <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router}/>
            </QueryClientProvider>
        // </React.StrictMode>
    );
}

callLogin(renderApp);
