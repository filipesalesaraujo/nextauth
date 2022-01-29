import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";
let cookies = parseCookies();
let isRefreshing = false;
let failedRequestCount = [];

export const api = axios.create({
  baseURL: "http://localhost:3333",
  // 1. clone, 2.yarn, 3.yarn dev: https://github.com/rocketseat-education/ignite-reactjs-auth-backend
  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response.status === 401) {
      if (error.response.data?.code === "token.expired") {
        cookies = parseCookies();
        const { "nextauth.refreshToken": refreshToken } = cookies;
        const originalConfig = error.config;
        if (!isRefreshing) {
          isRefreshing = true;
          api
            .post("/refresh", {
              refreshToken,
            })
            .then((response) => {
              const { token } = response.data;
              setCookie(undefined, "nextauth.token", token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: "/",
              });
              setCookie(
                undefined,
                "nextauth.refreshToken",
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: "/",
                }
              );
              api.defaults.headers["Authorization"] = `Bearer ${token}`;
              failedRequestCount.forEach((request) => request.onSuccess(token));
              failedRequestCount = [];
            })
            .catch((err) => {
              failedRequestCount.forEach((request) => request.onFailure(err));
              failedRequestCount = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }
        return new Promise((resolve, reject) => {
          failedRequestCount.push({
            onSuccess: (token: string) => {
              originalConfig.headers["Authorization"] = `Bearer ${token}`;
              resolve(api(originalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
      }
    }
  }
);
