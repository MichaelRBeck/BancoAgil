'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false); // Evita hydration mismatch no client
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleRedirect = (path: 'homepage' | 'transactions') => {
    // Como o backend identifica o usuário pelo cookie JWT,
    // não é necessário pegar userId aqui e passar como query param
    router.push(`/${path}`);
    setIsMobileMenuOpen(false); // Fecha menu após navegação
  };

  const handleLogout = () => {
    // Se estiver usando redux para logout, despache a ação aqui
    // Para simplificar, só redireciona para login e espera backend limpar cookie

    // Idealmente, você faria uma chamada para /api/logout para limpar cookie HttpOnly no backend
    // await fetch('/api/logout', { method: 'POST' });

    router.push('/');
    setIsMobileMenuOpen(false); // Fecha menu após logout
  };

  if (!isMounted) return null;

  return (
    <>
      <header className="flex items-center justify-between border-b border-[var(--accent)] px-6 py-3 bg-[var(--background)] relative z-50">
        {/* Logo clicável */}
        <div
          onClick={() => handleRedirect('homepage')}
          className="text-[var(--foreground)] cursor-pointer"
          role="link"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRedirect('homepage')}
        >
          <h2 className="text-lg font-bold tracking-[-0.015em] leading-tight">BancoAgil</h2>
        </div>

        {/* Menu desktop */}
        <div className="hidden sm:flex items-center gap-8">
          <button
            onClick={() => handleRedirect('homepage')}
            className="text-[var(--foreground)] text-sm font-medium hover:underline"
          >
            Início
          </button>
          <button
            onClick={() => handleRedirect('transactions')}
            className="text-[var(--foreground)] text-sm font-medium hover:underline"
          >
            Transações
          </button>
          <button
            onClick={handleLogout}
            className="text-[var(--warning)] text-sm font-medium hover:underline"
          >
            Sair
          </button>
        </div>

        {/* Botão menu mobile */}
        <div className="sm:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <X className="text-[var(--foreground)]" /> : <Menu className="text-[var(--foreground)]" />}
          </button>
        </div>
      </header>

      {/* Menu mobile suspenso */}
      {isMobileMenuOpen && (
        <nav className="sm:hidden fixed top-[56px] left-0 w-full bg-[var(--background)] border-b border-t border-[var(--accent)] px-6 py-4 flex flex-col gap-4 z-40 shadow-md" aria-label="Mobile menu">
          <button
            onClick={() => handleRedirect('homepage')}
            className="w-full text-[var(--foreground)] text-sm font-medium text-left hover:underline"
          >
            Início
          </button>
          <button
            onClick={() => handleRedirect('transactions')}
            className="w-full text-[var(--foreground)] text-sm font-medium text-left hover:underline"
          >
            Transações
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-[var(--warning)] text-sm font-medium text-left hover:underline"
          >
            Sair
          </button>
        </nav>
      )}
    </>
  );
}
