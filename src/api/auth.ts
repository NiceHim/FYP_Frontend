import base from "@/api/base";

export async function register(userName: string, password: string) {
    const params = {
        userName: userName,
        password: password
    }
    const { data } = await base.post("/auth/register", params);
    return data;
}

export async function login(userName: string, password: string) {
    const params = {
        userName: userName,
        password: password
    }
    const { data } = await base.post("/auth/login", params);
    return data;
}