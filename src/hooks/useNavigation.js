import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook personalizado para manejar la navegación de manera más robusta
 * y evitar problemas con el historial del navegador
 */
export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navegación segura que preserva el historial
  const navigateTo = useCallback((path, options = {}) => {
    const { replace = false, state = null } = options;
    navigate(path, { replace, state });
  }, [navigate]);

  // Navegación hacia atrás con validación
  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Si no hay historial, ir al dashboard
      navigate('/admin');
    }
  }, [navigate]);

  // Navegación hacia adelante
  const goForward = useCallback(() => {
    navigate(1);
  }, [navigate]);

  // Verificar si se puede navegar hacia atrás
  const canGoBack = useCallback(() => {
    return window.history.length > 1;
  }, []);

  // Navegación con estado preservado
  const navigateWithState = useCallback((path, state) => {
    navigate(path, { state, replace: false });
  }, [navigate]);

  return {
    navigateTo,
    goBack,
    goForward,
    canGoBack,
    navigateWithState,
    currentPath: location.pathname,
    currentState: location.state
  };
}
