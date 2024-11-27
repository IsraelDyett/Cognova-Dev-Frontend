"use client";
import { User } from "@prisma/client";
import React, { createContext, useContext } from "react";

const DefaultProps = { user: {} as User };

export interface AuthContextType {
	user: User;
}

const AuthContext = createContext<AuthContextType>(DefaultProps);

export const AuthProvider: React.FC<{ children: React.ReactNode; user: User }> = ({
	children,
	user,
}) => {
	return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
