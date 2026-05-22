import { useState, useEffect, type ReactNode } from 'react';

const DRAFT_PASSWORD = process.env.NEXT_PUBLIC_DRAFT_PASSWORD || '';
const STORAGE_KEY = 'draft-auth';

type DraftGuardProps = {
    children: ReactNode;
};

export default function DraftGuard({ children }: DraftGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === DRAFT_PASSWORD) {
            sessionStorage.setItem(STORAGE_KEY, 'true');
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
            setPassword('');
        }
    };

    // Prevent flash of content / hydration mismatch
    if (!mounted) {
        return null;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                padding: '2rem',
            }}
        >
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                        filter: 'grayscale(1)',
                        opacity: 0.5,
                    }}
                >
                    🔒
                </div>
                <h2 style={{ marginBottom: '0.5rem' }}>Draft Content</h2>
                <p
                    style={{
                        color: 'rgb(var(--color-text-muted))',
                        marginBottom: '2rem',
                        fontSize: '0.875rem',
                    }}
                >
                    This section contains unpublished drafts. Enter the password to continue.
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        placeholder="Password"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: `2px solid ${error ? '#ef4444' : 'rgb(var(--color-border))'}`,
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            fontSize: '1rem',
                            outline: 'none',
                            boxSizing: 'border-box',
                            marginBottom: '0.75rem',
                            transition: 'border-color 0.2s',
                        }}
                    />
                    {error && (
                        <p
                            style={{
                                color: '#ef4444',
                                fontSize: '0.8rem',
                                marginBottom: '0.75rem',
                                marginTop: 0,
                            }}
                        >
                            Wrong password. Try again.
                        </p>
                    )}
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            border: '2px solid rgb(var(--color-border))',
                            backgroundColor: 'rgb(var(--color-text))',
                            color: 'rgb(var(--color-bg))',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.85')}
                        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                        Unlock
                    </button>
                </form>
            </div>
        </div>
    );
}
