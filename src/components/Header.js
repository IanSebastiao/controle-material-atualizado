import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';

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
                </nav>
            </div>
        </header>
    );
};

export default Header;