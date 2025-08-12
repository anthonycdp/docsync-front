import { useEffect, useCallback } from 'react'

/**
 * Hook para scroll inteligente com configurações otimizadas por tipo de página
 */
export const usePageScroll = (elementRef, pageType = 'default') => {
  const pageConfigs = {
    // Página de download - foca no título de sucesso
    download: {
      block: 'center',
      delay: 200, // Aguarda animações de entrada
      fallbackToTop: true
    },
    // Página de revisão - foca no cabeçalho  
    preview: {
      block: 'start',
      delay: 150,
      fallbackToTop: true
    },
    // Página de processamento - foca na barra de progresso
    processing: {
      block: 'center', 
      delay: 100,
      fallbackToTop: true
    },
    // Páginas de upload - foca na área ativa
    upload: {
      block: 'center',
      delay: 200,
      fallbackToTop: true
    },
    // Configuração padrão
    default: {
      block: 'center',
      delay: 150, 
      fallbackToTop: true
    }
  }

  const config = pageConfigs[pageType] || pageConfigs.default
  
  const performScroll = useCallback(() => {
    const scrollToElement = () => {
      if (elementRef?.current) {
        // CKDEV-NOTE: Usar scrollIntoView nativo para melhor performance e compatibilidade
        elementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: config.block,
          inline: 'nearest'
        })
      } else if (config.fallbackToTop) {
        // CKDEV-NOTE: Fallback para topo quando elemento não está disponível
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto'
        })
      }
    }

    if (config.delay > 0) {
      const timeoutId = setTimeout(scrollToElement, config.delay)
      return () => clearTimeout(timeoutId)
    } else {
      scrollToElement()
    }
  }, [elementRef, config])

  useEffect(() => {
    return performScroll()
  }, [performScroll])

  // CKDEV-NOTE: Retornar função para trigger manual se necessário
  return performScroll
}