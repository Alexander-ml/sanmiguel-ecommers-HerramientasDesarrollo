declare module 'react-google-recaptcha' {
    import type { Component, CSSProperties } from 'react';

    export interface ReCAPTCHAProps {
        sitekey: string;
        onChange?: (token: string | null) => void;
        onExpired?: () => void;
        onErrored?: () => void;
        theme?: 'light' | 'dark';
        size?: 'compact' | 'normal' | 'invisible';
        tabindex?: number;
        hl?: string;
        badge?: 'bottomright' | 'bottomleft' | 'inline';
        type?: 'image' | 'audio';
        style?: CSSProperties;
        className?: string;
        grecaptcha?: unknown;
    }

    export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
        reset(): void;
        execute(): Promise<string>;
        executeAsync(): Promise<string>;
        getValue(): string | null;
    }
}