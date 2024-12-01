export const messages = {
	en: {
		SESSION_ALREADY_ACTIVE: "You're already logged in on another device",
		REDIRECT_TO_LOGIN: "Taking you to the login page...",
		USER_NOT_FOUND:
			"We couldn't find an account with that email. Would you like to create one?",
		INVALID_PASSWORD: "The password you entered doesn't match our records. Please try again.",
		SIGN_IN: "Welcome back! You've successfully signed in.",
		SESSION_CREATION_FAILED: "We had trouble logging you in. Please try again.",
		USER_ALREADY_EXISTS:
			"An account with this email already exists. Would you like to sign in instead?",
		SIGN_UP: "Welcome! Your account has been created successfully.",
		SIGN_UP_FAILED: "We have trouble creating your account. Please try again.",
	},
};

export const getMessage = (key: string) => {
	return messages["en"]?.[key as keyof (typeof messages)["en"]] ?? key;
};
