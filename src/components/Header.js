import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, profile, signOut, isAdmin } = useAuth();

    const isHomePage = location.pathname === '/';

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <h1 onClick={() => navigate('/')} className="logo">
                    📦 Controle de Estoque
                </h1>

                <nav className="navigation">
                    {!isHomePage && (
                        <button
                            onClick={() => navigate('/')}
                            className="nav-button"
                        >
                            ← Voltar para Home
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/cadastro-produto')}
                        className="nav-button primary"
                    >
                        📦 Cadastrar Produto
                    </button>

                    <button
                        onClick={() => navigate('/movimentacoes/nova')}
                        className="nav-button primary"
                    >
                        📊 Nova Movimentação
                    </button>

                    {isAdmin && (
                        <button
                            onClick={() => navigate('/usuarios')}
                            className="nav-button admin"
                        >
                            👥 Gerenciar Usuários
                        </button>
                    )}
                </nav>

                <div className="user-info">
                    <span className="user-name">
                        Olá, {profile?.nome || user?.email}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        🚪 Sair
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;