'use client';

import {
    createPasswordToggleStore,
    createFormSubmitStore,
    createFieldStore,
} from './stores';

/**
 * Hook for managing password visibility toggle
 */
export function usePasswordToggle(initialVisible = false) {
    const useStore = createPasswordToggleStore(initialVisible);
    const { isVisible, toggle, show, hide } = useStore();

    return {
        isVisible,
        toggle,
        show,
        hide,
        inputType: isVisible ? 'text' : 'password',
    } as const;
}

/**
 * Hook for managing form submission state
 */
export function useFormSubmit() {
    const useStore = createFormSubmitStore();
    const { isSubmitting, error, setSubmitting, setError, reset } = useStore();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        onSubmit: (formData: FormData) => Promise<void> | void
    ) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const formData = new FormData(e.currentTarget);
            await onSubmit(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    return {
        isSubmitting,
        error,
        setError,
        handleSubmit,
        reset,
    } as const;
}

/**
 * Hook for managing input field state
 */
export function useField<T = string>(initialValue: T) {
    const useStore = createFieldStore(initialValue);
    const { value, touched, error, setValue, setTouched, setError, reset } = useStore();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value as T);
    };

    const onBlur = () => {
        setTouched(true);
    };

    return {
        value,
        setValue,
        touched,
        error,
        setError,
        onChange,
        onBlur,
        reset,
        inputProps: {
            value: value as string,
            onChange,
            onBlur,
        },
    } as const;
}
