'use client';

import { useState } from "react";
import Footer from "./components/footer/footer";
import HomeNavbar from "./components/navbar/homeNavbar";
import RegisterModal from './components/modals/registerModal';
import {
  MainContainer,
  MainTitle,
  MainButton,
  FeatureCard,
  FAQContainer
} from "./../../styled/home";

export default function Home() {
  // Estado para controlar se o modal de registro está aberto ou fechado
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  
  // Estado para controlar qual feature está sendo "hovered" (usado para efeitos visuais)
  const [hoverFeature, setHoverFeature] = useState<number | null>(null);

  // Lista das funcionalidades que serão exibidas na seção de features
  const features = [
    { title: "Transações em tempo real", desc: "Envie ou receba valores com apenas alguns cliques." },
    { title: "Foco na segurança", desc: "Camadas extras de proteção para sua tranquilidade." },
    { title: "Design intuitivo", desc: "Interface clara para o seu dia a dia." },
  ];

  return (
    <>
      {/* Container principal da página, com cores baseadas em variáveis CSS */}
      <div className="bg-[var(--background)] text-[var(--foreground)]">

        {/* Navbar principal */}
        <HomeNavbar />

        {/* Seção principal do conteúdo da home */}
        <MainContainer>
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
            {/* Texto principal e botão para abrir modal de cadastro */}
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

        {/* Seção de Features (funcionalidades) */}
        <section className="py-16 bg-[var(--background)]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
            {/* Mapeia o array de features para mostrar cards com título e descrição */}
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                onMouseEnter={() => setHoverFeature(idx)}  // Marca feature como "hovered"
                onMouseLeave={() => setHoverFeature(null)} // Remove efeito de hover
              >
                <h3 className="text-xl font-bold mb-2 text-[var(--primary)]">{feature.title}</h3>
                <p className="text-[var(--foreground)]">{feature.desc}</p>
              </FeatureCard>
            ))}
          </div>
        </section>

        {/* Seção de saldo atual */}
        <section className="py-16 bg-[var(--accent)]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h3 className="text-3xl font-bold mb-6 text-[var(--primary)]">Seu dinheiro, sempre visível</h3>
            <div className="bg-[var(--neutral)] rounded-2xl p-8 shadow-md max-w-md mx-auto border border-[var(--accent)]">
              <p className="text-[var(--foreground)] text-lg mb-2">Saldo Atual</p>
              <p className="text-4xl font-extrabold text-[var(--secondary)] mb-4">R$ 3.220,00</p>
            </div>
          </div>
        </section>

        {/* Seção de Perguntas Frequentes */}
        <section className="py-16 bg-[var(--background)]">
          <FAQContainer>
            <h3 className="text-2xl font-bold text-center mb-8 text-[var(--primary)]">Perguntas Frequentes</h3>
            <div className="space-y-6">
              {/* Cada bloco representa uma pergunta e sua resposta */}
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

        {/* Footer do site */}
        <Footer />
      </div>

      {/* Modal de registro que abre quando showRegisterModal é true */}
      {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
    </>
  );
}
