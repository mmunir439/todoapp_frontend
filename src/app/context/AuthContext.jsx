"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, getErrorMessage } from "../utils/api";
import { getToken, removeToken, setToken } from "../utils/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const data = await authApi.getMe();
      const profile = data?.user || data;
      setUser(profile);
      return profile;
    } catch {
      removeToken();
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    const token = data?.token || data?.accessToken;
    if (!token) throw new Error("No token received from server");

    setToken(token);
    const profile = data?.user || (await authApi.getMe());
    setUser(profile?.user || profile);
    return profile;
  };

  const register = async (payload) => {
    return authApi.register(payload);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/login");
  };

  const updateProfile = async (payload) => {
    const data = await authApi.updateMe(payload);
    const profile = data?.user || data;
    setUser(profile);
    return profile;
  };

  const deleteAccount = async () => {
    await authApi.deleteMe();
    removeToken();
    setUser(null);
    router.push("/register");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        refreshUser: fetchUser,
        getErrorMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
