import React, { useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { useAppDispatch } from '@/store/hooks';
import { fetchUser, logout } from '@/store/slices/user';

type AuthContainerProps = {
    children: JSX.Element;
};

export default function AuthContainer({ children }: AuthContainerProps) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        supabase.auth.startAutoRefresh();
        dispatch(fetchUser());

        supabase.auth.onAuthStateChange((event, session) => {
            console.log(event, session);

            if (event === 'SIGNED_IN') {
                dispatch(fetchUser());
            } else if (event === 'SIGNED_OUT') {
                dispatch(logout());
            }
        });
    }, [dispatch]);

    return <>{children}</>;
}
