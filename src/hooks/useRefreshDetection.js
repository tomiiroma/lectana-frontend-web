import { useEffect, useRef } from 'react';

/**
 * Hook para detectar refresh (F5) y manejar el estado de navegación
 * Ayuda a restaurar el estado después de un refresh
 */
export function useRefreshDetection() {
  const isRefreshRef = useRef(false);
  const navigationStateRef = useRef(null);

  useEffect(() => {
    // Detectar si es un refresh
    const isRefresh = performance.navigation.type === 1 || 
                     performance.getEntriesByType('navigation')[0]?.type === 'reload';
    
    isRefreshRef.current = isRefresh;

    if (isRefresh) {
      console.log('🔄 Refresh detectado, restaurando estado...');
      
      // Restaurar estado de navegación si existe
      const savedState = sessionStorage.getItem('navigationState');
      if (savedState) {
        try {
          navigationStateRef.current = JSON.parse(savedState);
          console.log('✅ Estado de navegación restaurado');
        } catch (error) {
          console.error('❌ Error restaurando estado:', error);
        }
      }
    }

    // Guardar estado actual en sessionStorage
    const saveState = () => {
      const currentState = {
        pathname: window.location.pathname,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      
      sessionStorage.setItem('navigationState', JSON.stringify(currentState));
    };

    // Guardar estado al navegar
    const handleBeforeUnload = () => {
      saveState();
    };

    // Guardar estado periódicamente
    const interval = setInterval(saveState, 30000); // Cada 30 segundos

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    isRefresh: isRefreshRef.current,
    navigationState: navigationStateRef.current,
    isRefreshRef
  };
}
