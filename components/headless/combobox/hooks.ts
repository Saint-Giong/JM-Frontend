'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

export interface UseComboboxOptions<T> {
    items: T[];
    filterFn?: (item: T, query: string) => boolean;
    onSelect?: (item: T) => void;
    initialValue?: T | null;
}

export interface UseComboboxReturn<T> {
    isOpen: boolean;
    query: string;
    selectedItem: T | null;
    filteredItems: T[];
    highlightedIndex: number;
    inputProps: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        onFocus: () => void;
        onBlur: () => void;
        onKeyDown: (e: React.KeyboardEvent) => void;
        role: 'combobox';
        'aria-expanded': boolean;
        'aria-haspopup': 'listbox';
        'aria-autocomplete': 'list';
    };
    listboxProps: {
        role: 'listbox';
    };
    getOptionProps: (item: T, index: number) => {
        role: 'option';
        'aria-selected': boolean;
        onClick: () => void;
        onMouseEnter: () => void;
    };
    open: () => void;
    close: () => void;
    toggle: () => void;
    setQuery: (query: string) => void;
    selectItem: (item: T) => void;
    clearSelection: () => void;
}

export function useCombobox<T>({
    items,
    filterFn,
    onSelect,
    initialValue = null,
}: UseComboboxOptions<T>): UseComboboxReturn<T> {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<T | null>(initialValue);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const filteredItems = useMemo(() => {
        if (!query || !filterFn) return items;
        return items.filter((item) => filterFn(item, query));
    }, [items, query, filterFn]);

    // Reset highlighted index when filtered items change
    useEffect(() => {
        setHighlightedIndex(0);
    }, [filteredItems.length]);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setHighlightedIndex(0);
    }, []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    const selectItem = useCallback(
        (item: T) => {
            setSelectedItem(item);
            onSelect?.(item);
            close();
        },
        [onSelect, close]
    );

    const clearSelection = useCallback(() => {
        setSelectedItem(null);
        setQuery('');
    }, []);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (!isOpen) {
                        open();
                    } else {
                        setHighlightedIndex((prev) =>
                            prev < filteredItems.length - 1 ? prev + 1 : prev
                        );
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (isOpen && filteredItems[highlightedIndex]) {
                        selectItem(filteredItems[highlightedIndex]);
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    close();
                    break;
                case 'Tab':
                    close();
                    break;
            }
        },
        [isOpen, filteredItems, highlightedIndex, open, close, selectItem]
    );

    const handleBlur = useCallback(() => {
        // Delay close to allow click on option
        blurTimeoutRef.current = setTimeout(() => {
            close();
        }, 150);
    }, [close]);

    const handleFocus = useCallback(() => {
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
        open();
    }, [open]);

    const inputProps = {
        value: query,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            if (!isOpen) open();
        },
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        role: 'combobox' as const,
        'aria-expanded': isOpen,
        'aria-haspopup': 'listbox' as const,
        'aria-autocomplete': 'list' as const,
    };

    const listboxProps = {
        role: 'listbox' as const,
    };

    const getOptionProps = useCallback(
        (item: T, index: number) => ({
            role: 'option' as const,
            'aria-selected': item === selectedItem,
            onClick: () => selectItem(item),
            onMouseEnter: () => setHighlightedIndex(index),
        }),
        [selectedItem, selectItem]
    );

    return {
        isOpen,
        query,
        selectedItem,
        filteredItems,
        highlightedIndex,
        inputProps,
        listboxProps,
        getOptionProps,
        open,
        close,
        toggle,
        setQuery,
        selectItem,
        clearSelection,
    };
}


