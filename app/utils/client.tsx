"use client";

import axios from "axios";
import { useCallback } from "react";
import { toast, userToken } from "./helper";

const client = (token?: string) => {
    const axiosInstance = axios.create({
        baseURL: !process.env.NEXT_PUBLIC_ENV ? "http://localhost:5000/api" : "https://task-manager-server-uw4k.onrender.com/api",
    })

    const authToken = token || userToken()

    if (authToken) {
        axiosInstance.interceptors.request.use(config => {
            config.headers.Authorization = `Bearer ${authToken}`;
            return config;
        })
    }

    return axiosInstance;
}

export const useClient = () => {
    const token = userToken()
    return useCallback(
        () => client(token || ""), [token])
}

export default client;

