import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            localStorage.setItem('userId', data.userId);
            router.push('/');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
            <h1>Login</h1>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="id">ID:</label>
                    <input
                        id="id"
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        style={{ padding: '0.5rem' }}
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: '0.5rem' }}
                    />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;