'use client';

import { useState } from 'react';
import LoginModal from '../modals/loginModal';
import RegisterModal from '../modals/registerModal';
import { Menu, X } from 'lucide-react';

export default function HomeNavbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-[var(--accent)] px-6 py-3 bg-[var(--background)] relative z-50">
        <h2 className="text-lg font-bold text-[var(--foreground)]">BancoAgil</h2>

        {/* Botões para telas maiores */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-[var(--secondary)] text-[var(--neutral)] px-4 py-2 rounded-xl font-bold hover:bg-[var(--primary)] transition-colors"
          >
            Cadastrar
          </button>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-xl font-bold hover:bg-[var(--neutral)] transition-colors"
          >
            Log in
          </button>
        </div>

        {/* Ícone do menu hambúrguer */}
        <div className="sm:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="text-[var(--foreground)]" /> : <Menu className="text-[var(--foreground)]" />}
          </button>
        </div>
      </header>

      {/* Menu suspenso fixo sobre o conteúdo */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed top-[56px] left-0 w-full bg-[var(--background)] border-b border-t border-[var(--accent)] px-6 py-4 flex flex-col gap-4 z-40 shadow-md">
          <button
            onClick={() => {
              setShowRegisterModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-[var(--secondary)] text-[var(--neutral)] px-4 py-2 rounded-xl font-bold hover:bg-[var(--primary)] transition-colors"
          >
            Cadastrar
          </button>
          <button
            onClick={() => {
              setShowLoginModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="w-full bg-[var(--accent)] text-[var(--foreground)] px-4 py-2 rounded-xl font-bold hover:bg-[var(--neutral)] transition-colors"
          >
            Log in
          </button>
        </div>
      )}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}
