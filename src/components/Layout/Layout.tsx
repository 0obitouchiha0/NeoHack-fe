import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';

import styles from './styles.module.scss';
import { useAppDispatch } from '../../store/store';
import { logout } from '../../store/slices/userSlice';

interface LayoutProps {
    children: React.ReactElement
}

const Layout = ({children}: LayoutProps) => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
    };

    return (
        <div className={styles.layout}>
            <nav className={styles.nav}>
                <div className={styles.links}>
                    <h6 className={styles.links__link}>
                        <Link to="/">Pensioners</Link>
                    </h6>
                    <h6 className={styles.links__link}>
                        <Link to="/courses">Курсы</Link>
                    </h6>
                    <h6 className={styles.links__link}>
                        <Link to="/mycourses">Мои курсы</Link>
                    </h6>
                </div>
                <div className={styles.account}>
                    <Link to="/profile">
                        <UserOutlined style={{color: '#fff', fontSize: 32}}/>
                    </Link>
                    <LogoutOutlined style={{color: '#fff', fontSize: 22}} onClick={handleLogout}/>
                </div>
            </nav>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default Layout;