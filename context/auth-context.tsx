'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
	isLoggedIn: boolean;
	userId: string | null;
	token: string | null;
	login: (token: string, userId: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [userId, setUserId] = useState<string | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("anilistToken");
		const storedUserId = localStorage.getItem("userId");
		if (storedToken && storedUserId) {
			setToken(storedToken);
			setUserId(storedUserId);
			setIsLoggedIn(true);
		}
	}, []);

	const login = (newToken: string, newUserId: string) => {
		setToken(newToken);
		setUserId(newUserId);
		setIsLoggedIn(true);
		localStorage.setItem("anilistToken", newToken);
		localStorage.setItem("userId", newUserId);
	};

	const logout = () => {
		setToken(null);
		setUserId(null);
		setIsLoggedIn(false);
		localStorage.removeItem("anilistToken");
		localStorage.removeItem("userId");
	};

	return (
		<AuthContext.Provider value={{ isLoggedIn, userId, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
