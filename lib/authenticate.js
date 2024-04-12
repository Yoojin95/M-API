const TOKEN_KEY = "access_token";

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

export const authenticateUser = async (user, password) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      setToken(token);
      return true;
    } else {
      const { message } = await res.json();
      throw new Error(message || "Failed to authenticate");
    }
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};

export const registerUser = async (user, password, password2) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: user, password, password2 }),
    });

    if (res.ok) {
      return true;
    } else {
      const { message } = await res.json();
      throw new Error(message || "Failed to register");
    }
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};

export const readToken = () => {
  return getToken();
};
export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const payload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );

  return JSON.parse(payload);
};
