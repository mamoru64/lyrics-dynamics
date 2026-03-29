import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000",
});

interface TextAliveTokenResponse {
    token: string;
}

export const fetchTextAliveToken = async (): Promise<string> => {
    const { data } = await api.get<TextAliveTokenResponse>("/api/textalive/token");
    return data.token;
};