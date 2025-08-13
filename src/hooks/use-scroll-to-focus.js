import { useEffect } from 'react';

export const usePageScroll = (ref, trigger) => {
  useEffect(() => {
    if (trigger && ref) {
      let attempts = 0;
      const maxAttempts = 50; // CKDEV-NOTE: Máximo 5 segundos (50 * 100ms)
      
      const checkAndScroll = () => {
        attempts++;
        
        if (ref.current) {
          const element = ref.current;
          const rect = element.getBoundingClientRect();
          
          // CKDEV-NOTE: Usar getBoundingClientRect para posição mais precisa
          const elementTopFromViewport = rect.top;
          const elementHeight = rect.height;
          const windowHeight = window.innerHeight;
          const currentScrollY = window.scrollY;
          
          // CKDEV-NOTE: Calcular posição para centralizar o elemento na viewport
          const elementCenterY = elementTopFromViewport + currentScrollY + (elementHeight / 2);
          const viewportCenterY = windowHeight / 2;
          const scrollPosition = elementCenterY - viewportCenterY;
          
          // CKDEV-NOTE: Aplicar scroll suave para centralizar o elemento
          window.scrollTo({
            top: Math.max(0, scrollPosition),
            behavior: 'smooth'
          });
          return;
        }
        
        if (attempts < maxAttempts) {
          setTimeout(checkAndScroll, 100);
        }
      };
      
      // CKDEV-NOTE: Aguardar animações do Framer Motion e renderização completa
      const timer = setTimeout(checkAndScroll, 300);
      
      return () => clearTimeout(timer);
    }
  }, [ref, trigger]);
};