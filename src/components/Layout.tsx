import React from 'react';
import Link from 'next/link';
import styles from '../styles/Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <nav>
                    <ul className={styles.navList}>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/login">Login</Link>
                        </li>
                        <li>
                            <Link href="/deployments">Deployments</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className={styles.main}>{children}</main>
            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Your Company Name</p>
            </footer>
        </div>
    );
};

export default Layout;