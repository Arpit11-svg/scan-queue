const API_BASE_URL = "http://localhost:5000/api/v1";

export async function apiRequest(path, options = {}) {
    const respone = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });

    const data = await respone.json();

    if (!respone.ok) {
        throw new Error(data.message || "Request Failed");
    }

    return data;

}