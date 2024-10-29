import React, { cache, use } from 'react'
import { authUser } from '../auth/actions';
import { AuthProvider } from './auth-context';

const cachedUser = cache(async () => {
    const user = await authUser();
    if (user) {
        return user;
    }
    return null;
});

function AuthWrapper({ children }: { children: React.ReactNode }): React.ReactElement {
    const user = use(cachedUser());
    return (
        <AuthProvider user={user}>
            {children}
        </AuthProvider>
    );
}

export default function layout() {
    return (
        <AuthWrapper>
            <div>layout</div>
        </AuthWrapper>
    )
}
