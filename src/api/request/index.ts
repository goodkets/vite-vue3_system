import type {
    InternalAxiosRequestConfig,
    AxiosResponse,
    AxiosError,
  } from "axios";
  import axios from "axios";
  import { message } from "ant-design-vue";
  import { getItem } from "@/utils/storeages";
  
  const request = axios.create({
    // baseURL: '/api',
    baseURL: import.meta.env.VITE_WEB_API,
    timeout: 10000,
  });
  
  // 响应失败拦截处理
  const handleError = (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 504) {
      //登录失效，这里自己处理-----清除令牌缓存，比如登录啥的，用户信息等
      // clearAuthCache()
      location.href = "/login";
    }
    message.error(error.message || "error");
    return Promise.reject(error);
  };
  //请求拦截
  request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getItem("token");
    if (token) {
      config.headers["token"] = `${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  }, handleError);
  
  //响应拦截
  request.interceptors.response.use((response: AxiosResponse) => {
    const data = response.data;
    if (data.state == 0 || data.state == 200) {
      return data;
    } else {
      message.error(data.message);
      return Promise.reject(data.msg);
    }
  }, handleError);
  
  export default request;