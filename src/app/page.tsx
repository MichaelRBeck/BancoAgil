'use client';

import { useState } from "react";
import styled from 'styled-components';
import Footer from "./components/footer/footer";
import HomeNavbar from "./components/navbar/homeNavbar";
import RegisterModal from './components/modals/registerModal';

// Styled Components

const MainContainer = styled.section`
  background-color: var(--accent);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
`;

const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--primary);
  line-height: 1.2;
`;

const MainButton = styled.button`
  background-color: var(--primary);
  color: var(--neutral);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--secondary);
  }
`;

const FeatureCard = styled.div`
  background-color: var(--neutral);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: 1px solid var(--accent);
  text-align: center;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
`;

const FAQContainer = styled.div`
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

// Main Component

export default function Home() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [hoverFeature, setHoverFeature] = useState<number | null>(null);

  return (
    <>
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <HomeNavbar />

        <MainContainer>
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 text-center md:text-left">
              <MainTitle>
                Controle total das suas finanças
              </MainTitle>
              <p className="text-lg mb-6 text-[var(--foreground)]">
                Gerencie seu dinheiro de forma simples, segura e eficiente com nossa plataforma digital.
              </p>
              <MainButton onClick={() => setShowRegisterModal(true)}>
                Criar Conta
              </MainButton>
            </div>
          </div>
        </MainContainer>

        <section className="py-16 bg-[var(--background)]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
            {[
              { title: "Transações em tempo real", desc: "Envie ou receba valores com apenas alguns cliques." },
              { title: "Foco na segurança", desc: "Camadas extras de proteção para sua tranquilidade." },
              { title: "Design intuitivo", desc: "Interface clara para o seu dia a dia." },
            ].map((feature, idx) => (
              <FeatureCard
                key={idx}
                onMouseEnter={() => setHoverFeature(idx)}
                onMouseLeave={() => setHoverFeature(null)}
              >
                <h3 className="text-xl font-bold mb-2 text-[var(--primary)]">{feature.title}</h3>
                <p className="text-[var(--foreground)]">{feature.desc}</p>
              </FeatureCard>
            ))}
          </div>
        </section>

        <section className="py-16 bg-[var(--accent)]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-6 text-[var(--primary)]">Seu dinheiro, sempre visível</h3>
            <div className="bg-[var(--neutral)] rounded-2xl p-8 shadow-md max-w-md mx-auto border border-[var(--accent)]">
              <p className="text-[var(--foreground)] text-lg mb-2">Saldo Atual</p>
              <p className="text-4xl font-extrabold text-[var(--secondary)] mb-4">R$ 3.220,00</p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-[var(--background)]">
          <FAQContainer>
            <h3 className="text-2xl font-bold text-center mb-8 text-[var(--primary)]">Perguntas Frequentes</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Preciso pagar para abrir conta?</h4>
                <p className="text-[var(--foreground)]">Não! A conta digital é 100% gratuita.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">O banco é seguro?</h4>
                <p className="text-[var(--foreground)]">Sim, utilizamos as melhores tecnologias pra isso.</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-[var(--foreground)]">Vocês têm suporte?</h4>
                <p className="text-[var(--foreground)]">Sim! Nosso time está disponível 24h via chat ou e-mail.</p>
              </div>
            </div>
          </FAQContainer>
        </section>

        <Footer />
      </div>

      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}
