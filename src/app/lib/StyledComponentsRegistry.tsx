'use client';

import React, { useState } from 'react';
// Importa os utilitários do styled-components para gerenciar estilos no SSR (Server Side Rendering)
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
// Hook do Next.js para injetar HTML gerado no servidor na renderização
import { useServerInsertedHTML } from 'next/navigation';

// Componente que gerencia o registro dos estilos do styled-components
export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Cria uma instância do ServerStyleSheet, que coleta estilos gerados no SSR
  const [sheet] = useState(() => new ServerStyleSheet());

  // Hook do Next.js que insere o CSS gerado durante a renderização do servidor
  useServerInsertedHTML(() => {
    // Pega os estilos CSS coletados pela instância do ServerStyleSheet
    const styles = sheet.getStyleElement();

    // Limpa as tags antigas para evitar duplicações em renderizações subsequentes
    sheet.instance.clearTag();

    // Retorna os estilos para serem inseridos no HTML renderizado pelo servidor
    return <>{styles}</>;
  });

  // StyleSheetManager aplica os estilos coletados à árvore React durante a renderização
  return <StyleSheetManager sheet={sheet.instance}>{children}</StyleSheetManager>;
}
