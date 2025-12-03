'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { type StoreApi, useStore } from 'zustand';
import {
    createPasswordToggleStore,
    type PasswordToggleState,
} from './stores';

// Password Field Context
const PasswordFieldContext = createContext<StoreApi<PasswordToggleState> | null>(null);

export const usePasswordFieldContext = () => {
    const store = useContext(PasswordFieldContext);
    if (!store) {
        throw new Error('usePasswordFieldContext must be used within PasswordField');
    }

    const isVisible = useStore(store, (state) => state.isVisible);
    const toggle = useStore(store, (state) => state.toggle);
    const show = useStore(store, (state) => state.show);
    const hide = useStore(store, (state) => state.hide);

    return {
        isVisible,
        toggle,
        show,
        hide,
        inputType: isVisible ? 'text' : 'password',
    } as const;
};

// Password Field Component
export interface PasswordFieldProps {
    children: ReactNode;
    className?: string;
}

export function PasswordField({ children, className }: PasswordFieldProps) {
    const storeRef = useRef<StoreApi<PasswordToggleState>>(null);
    if (!storeRef.current) {
        storeRef.current = createPasswordToggleStore();
    }

    return (
        <PasswordFieldContext.Provider value={storeRef.current}>
            <div className={className}>{children}</div>
        </PasswordFieldContext.Provider>
    );
}
