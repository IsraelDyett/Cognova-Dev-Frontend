export const messages = {
    en: {
        SESSION_ALREADY_ACTIVE: 'A session is already active',
        REDIRECT_TO_LOGIN: 'Redirecting to login page',
        USER_NOT_FOUND: 'Couldn\'t find your account.',
        INVALID_PASSWORD: 'Invalid password',
        USER_SIGNED_IN: 'User signed in successfully',
        SESSION_CREATION_FAILED: 'Failed to create session',
        USER_ALREADY_EXISTS: 'User already exists',
        USER_SIGNED_UP: 'User signed up successfully'
    }
}

export const getMessage = (key: string) => {
    return messages['en']?.[key as keyof typeof messages['en']] ?? key;
}