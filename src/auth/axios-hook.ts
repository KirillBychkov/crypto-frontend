import axios, { AxiosInstance } from 'axios';
import { useState, useEffect } from 'react';
import { useAuth } from './auth-hook';

type axiosInstances = {
  instanceTrade: AxiosInstance | null,
  instanceArbitrage: AxiosInstance | null,
  instanceDairy: AxiosInstance | null
};

export const useAxios = (config = {
  headers: {}
}) => {
  const { token, refreshToken, initialized: authInitialized, updateToken,  } = useAuth();

  const [initialized, setInitialized] = useState(false);
  const [axiosInstance, setAxiosInstance] = useState<axiosInstances>({
    instanceTrade: null,
    instanceArbitrage: null,
    instanceDairy: null
  });

  useEffect(() => {
    // const instanceTrade = axios.create({
    //   ...config,
    //   baseURL: 'http://localhost:8082/v1/',
    //   headers: {
    //     ...(config.headers || {}),
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //   },
    // });
    // instanceTrade.interceptors.request.use((config) => {
    //   if (token) {
    //     const cb = () => {
    //       config.headers.Authorization = `Bearer ${token}`;
    //       config.headers.withCredentials = true;
    //       return Promise.resolve(config);
    //     };
    //     return updateToken(cb);
    //   }
    // });
    //
    // const instanceArbitrage = axios.create({
    //   ...config,
    //   baseURL: 'http://localhost:8083/v1/',
    //   headers: {
    //     ...(config.headers || {}),
    //     'Content-Type': 'application/json',
    //     accept: 'application/json',
    //   },
    // });
    // instanceArbitrage.interceptors.request.use((config) => {
    //   if (token) {
    //     const cb = () => {
    //       config.headers.Authorization = `Bearer ${token}`;
    //       config.headers.withCredentials = true;
    //       return Promise.resolve(config);
    //     };
    //     return updateToken(cb);
    //   }
    // });

    const instanceDairy = axios.create({
      ...config,
      baseURL: import.meta.env.VITE_SERVER_URL,
      headers: {
        ...(config.headers || {}),
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    });
    instanceDairy.interceptors.request.use((config) => {
      if (token) {
        const cb = () => {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers.withCredentials = true;
          return Promise.resolve(config);
        };
        return updateToken(cb);
      }
    });

    setAxiosInstance(prev => ({
      ...prev,
      // instanceTrade, instanceArbitrage,
      instanceDairy
    }));
    setInitialized(true);

    return () => {
      setAxiosInstance({
        instanceTrade: null,
        instanceArbitrage: null,
        instanceDairy: null
      });
      setInitialized(false);
    };
  }, [token, refreshToken, authInitialized]);

  return {
    tradeService: axiosInstance.instanceTrade,
    arbitrageService: axiosInstance.instanceArbitrage,
    dairyService: axiosInstance.instanceDairy,
    initialized
  };
};

export default { useAxios };
