import { useState, useEffect, useCallback } from 'react';
import { verificarEstadoAudio, obtenerAudioInfo, generarAudio, generarAudioEL } from '../api/audio';

export const useAudio = (cuentoId) => {
  const [audioState, setAudioState] = useState({
    status: 'loading', // loading | ready | generating | error | not_generated
    audioUrl: null,
    duration: 0,
    isLoading: false,
    error: null,
    hasAudio: false
  });
   const fetchAudioUrl = useCallback(async () => {
    if (!cuentoId) return;
    
    try {
      const data = await obtenerAudioInfo(cuentoId);
      
      setAudioState(prev => ({
        ...prev,
        audioUrl: data.audio_url,
        status: 'ready',
        duration: data.duration || prev.duration
      }));
    } catch (error) {
      console.error(`Error obteniendo URL de audio para cuento ${cuentoId}:`, error);
      setAudioState(prev => ({
        ...prev,
        status: 'error',
        error: 'Error al obtener audio'
      }));
    }
  }, [cuentoId]);


  const generateAudioELCallback = useCallback(async (pdfUrl) => {
  if (!cuentoId) return;

  setAudioState(prev => ({ 
    ...prev, 
    isLoading: true, 
    status: 'generating', 
    error: null 
  }));

  try {
    await generarAudioEL(cuentoId, pdfUrl);

    // Polling para verificar cuando esté listo
    const interval = setInterval(async () => {
      try {
        const data = await verificarEstadoAudio(cuentoId);

        if (data.status === 'ready') {
          clearInterval(interval);
          setAudioState(prev => ({
            ...prev,
            isLoading: false,
            status: 'ready',
            hasAudio: true
          }));
          await fetchAudioUrl();
        } else if (data.status === 'error') {
          clearInterval(interval);
          setAudioState(prev => ({
            ...prev,
            status: 'error',
            error: 'Error al generar audio con ElevenLabs',
            isLoading: false
          }));
        }
      } catch (error) {
        clearInterval(interval);
        setAudioState(prev => ({
          ...prev,
          status: 'error',
          error: 'Error durante la generación con ElevenLabs',
          isLoading: false
        }));
      }
    }, 2000);

  } catch (error) {
    setAudioState(prev => ({
      ...prev,
      status: 'error',
      error: 'Error al generar audio con ElevenLabs',
      isLoading: false
    }));
  }
}, [cuentoId, fetchAudioUrl]);

  const checkStatus = useCallback(async () => {
    if (!cuentoId) return;
    
    try {
      const data = await verificarEstadoAudio(cuentoId);
      
      // Priorizar has_audio sobre status
      const finalStatus = data.has_audio ? (data.status || 'ready') : 'not_generated';
      
      setAudioState(prev => ({
        ...prev,
        status: finalStatus,
        duration: data.duration || 0,
        hasAudio: data.has_audio || false,
        isLoading: false,
        error: null
      }));
      
      // Si tiene audio, obtener la URL
      if (data.has_audio && data.status === 'ready') {
        await fetchAudioUrl();
      }
    } catch (error) {
      console.error(`Error verificando audio para cuento ${cuentoId}:`, error);
      setAudioState(prev => ({
        ...prev,
        status: 'error',
        error: 'Error al verificar estado del audio',
        isLoading: false
      }));
    }
  }, [cuentoId]);

 
  const generateAudio = useCallback(async () => {
    if (!cuentoId) return;
    
    setAudioState(prev => ({ 
      ...prev, 
      isLoading: true, 
      status: 'generating',
      error: null 
    }));
    
    try {
      await generarAudio(cuentoId);
      
      // Polling para verificar cuando esté listo
      const interval = setInterval(async () => {
        try {
          const data = await verificarEstadoAudio(cuentoId);
          
          if (data.status === 'ready') {
            clearInterval(interval);
            setAudioState(prev => ({ 
              ...prev, 
              isLoading: false,
              status: 'ready',
              hasAudio: true
            }));
            await fetchAudioUrl();
          } else if (data.status === 'error') {
            clearInterval(interval);
            setAudioState(prev => ({
              ...prev,
              status: 'error',
              error: 'Error al generar audio',
              isLoading: false
            }));
          }
        } catch (error) {
          clearInterval(interval);
          setAudioState(prev => ({
            ...prev,
            status: 'error',
            error: 'Error durante la generación',
            isLoading: false
          }));
        }
      }, 2000); // Verificar cada 2 segundos
      
    } catch (error) {
      setAudioState(prev => ({
        ...prev,
        status: 'error',
        error: 'Error al generar audio',
        isLoading: false
      }));
    }
  }, [cuentoId, fetchAudioUrl]);



  const refreshStatus = useCallback(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (cuentoId) {
      checkStatus();
    }
  }, [cuentoId, checkStatus]);

  

  return {
    ...audioState,
    generateAudio,
      generateAudioEL: generateAudioELCallback, // la IA de ElevenLabs
    refreshStatus
  };
};
