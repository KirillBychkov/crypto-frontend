import App from './App';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Dairy } from '@/pages/dairy/components/Dairy';
import { Deposit } from '@/pages/deposit/Deposit';
import { Wrapper } from '@/common/Wrapper';
// import { ChartPage } from "@/pages/chart/chart.tsx";
// import { Arbitrage } from "@/pages/arbitrage/arbitrage.tsx";
import { SharePage } from "@/pages/share/group";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/deposit',
        element: <Deposit />,
      },
      {
        path: '/',
        element: <Wrapper />,
        children: [
          {
            path: '/',
            element: <Navigate to={"dairy"} />,
          },
          {
            path: '/dairy',
            element: <Dairy />,
          },
          {
          //   path: '/chart',
          //   element: <ChartPage />,
          // },
          // {
          //   path: '/arbitrage',
          //   element: <Arbitrage />,
          },
          {
            path: '/share/:id',
            element: <SharePage />,
          },
        ],
      },
    ],
  },
]);
