import axios from "axios";
import { parseCookies } from "nookies";
const cookies = parseCookies();
export const api = axios.create({
  baseURL: "http://localhost:3333",
  // 1. clone, 2.yarn, 3.yarn dev: https://github.com/rocketseat-education/ignite-reactjs-auth-backend

  headers: {
    Authorization: `Bearer ${cookies["nextauth.token"]}`,
  },
});
