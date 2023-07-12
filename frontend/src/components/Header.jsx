import React from 'react';
import logo from '../static/images/logo.svg';
import { Link, useLocation } from 'react-router-dom';

function Header({ isLoggedIn, email, onSignOut }) {
  const location = useLocation();
  return (
    <header className='header'>
      <img src={logo} className='header__logo' alt='Логотип Места России' />
      {location.pathname === '/signin' && (
        <Link className='header__link' to={'/signup'}>
          Регистрация
        </Link>
      )}
      {location.pathname === '/signup' && (
        <Link className='header__link' to={'/signin'}>
          Вход
        </Link>
      )}
      {isLoggedIn && (
        <>
          <div className='header__align'>
            {email}
            <Link className='header__link' to={'/signin'} onClick={onSignOut}>
              Выйти
            </Link>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
