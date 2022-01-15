import {AxiosRequestConfig, AxiosStatic} from "axios";
import {useKalilaSession} from "@frontend/shared-ui";
import {useEffect, useState} from "react";


export function useApiClient(axios: AxiosStatic) {
  const {session} = useKalilaSession();
  const [accessTokenInterceptorId, setAccessTokenInterceptorId] = useState<number | null>(null);
  const accessTokenInterceptors = (config: AxiosRequestConfig) => {
    console.log('auth interceptor called')
    config.headers = {...config.headers, Authorization: `Bearer ${session?.user?.token}`}
    return config;
  };
  axios.interceptors.request.use(accessTokenInterceptors, error => Promise.reject(error));

  // useEffect(() => {
  //   const accessTokenInterceptors = (config: AxiosRequestConfig) => {
  //     console.log('auth interceptor called')
  //     config.headers = {...config.headers, Authorization: `Bearer ${session?.user?.token}`}
  //     return config;
  //   };
  //   const id = axios.interceptors.request.use(accessTokenInterceptors, error => Promise.reject(error));
  //   if (accessTokenInterceptorId !== null) {
  //     axios.interceptors.request.eject(accessTokenInterceptorId)
  //   }
  //   setAccessTokenInterceptorId(id);
  // }, [session])
  return {apiClient: axios}
}
