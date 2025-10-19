import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader2, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { eliminarAudio } from '../../api/audio';
import './AudioPlayer.css';

const AudioPlayer = ({ cuentoId, isAdmin = false, onAudioDeleted }) => {
  const { 
    status, 
    audioUrl, 
    duration, 
    isLoading, 
    error, 
    hasAudio,
    generateAudio, 
    refreshStatus 
  } = useAudio(cuentoId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const audioRef = useRef(null);

  // Controles de audio
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDeleteAudio = async () => {
    if (!isAdmin || !hasAudio) return;
    
    setIsDeleting(true);
    try {
      await eliminarAudio(cuentoId);
      refreshStatus();
      if (onAudioDeleted) {
        onAudioDeleted();
      }
    } catch (error) {
      console.error('Error al eliminar audio:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Efectos
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', () => setIsPlaying(false));
      audio.addEventListener('loadedmetadata', () => {
        setCurrentTime(0);
      });
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', () => setIsPlaying(false));
        audio.removeEventListener('loadedmetadata', () => {
          setCurrentTime(0);
        });
      };
    }
  }, [audioUrl]);

  // Renderizado según estado
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="audio-player-loading">
            <Loader2 className="audio-icon animate-spin" />
            <span>Verificando audio...</span>
          </div>
        );

      case 'generating':
        return (
          <div className="audio-player-generating">
            <Loader2 className="audio-icon animate-spin" />
            <span>Generando audio...</span>
            <div className="audio-progress-bar">
              <div className="audio-progress-fill"></div>
            </div>
          </div>
        );

      case 'not_generated':
        return (
          <div className="audio-player-no-audio">
            <AlertCircle className="audio-icon" />
            <span>Aún no tiene audio este cuento</span>
            {isAdmin && (
              <button
                onClick={generateAudio}
                disabled={isLoading}
                className="audio-btn audio-btn-primary"
              >
                {isLoading ? 'Generando...' : 'Generar Audio'}
              </button>
            )}
          </div>
        );

      case 'error':
        return (
          <div className="audio-player-error">
            <AlertCircle className="audio-icon" />
            <span>Error: {error}</span>
            <div className="audio-error-actions">
              <button
                onClick={refreshStatus}
                className="audio-btn audio-btn-secondary"
              >
                <RefreshCw className="audio-icon-small" />
                Reintentar
              </button>
              {isAdmin && (
                <button
                  onClick={generateAudio}
                  className="audio-btn audio-btn-primary"
                >
                  Generar Audio
                </button>
              )}
            </div>
          </div>
        );

      case 'ready':
        // Si no tiene audio real, mostrar mensaje
        if (!hasAudio || !audioUrl) {
          return (
            <div className="audio-player-no-audio">
              <AlertCircle className="audio-icon" />
              <span>Aún no tiene audio este cuento</span>
              {isAdmin && (
                <button
                  onClick={generateAudio}
                  disabled={isLoading}
                  className="audio-btn audio-btn-primary"
                >
                  {isLoading ? 'Generando...' : 'Generar Audio'}
                </button>
              )}
            </div>
          );
        }

        return (
          <div className="audio-player-ready">
            {/* Controles principales */}
            <div className="audio-controls">
              <button
                onClick={togglePlay}
                className="audio-play-btn"
                disabled={!audioUrl}
              >
                {isPlaying ? <Pause className="audio-icon" /> : <Play className="audio-icon" />}
              </button>
              
              <div className="audio-progress-container">
                <div className="audio-time">{formatTime(currentTime)}</div>
                <div 
                  className="audio-progress-bar"
                  onClick={handleSeek}
                >
                  <div
                    className="audio-progress-fill"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="audio-time">{formatTime(duration)}</div>
              </div>
              
              <div className="audio-volume-container">
                <Volume2 className="audio-icon-small" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="audio-volume-slider"
                />
              </div>

              {isAdmin && (
                <div className="audio-admin-actions">
                  <button
                    onClick={refreshStatus}
                    className="audio-btn audio-btn-icon"
                    title="Actualizar"
                  >
                    <RefreshCw className="audio-icon-small" />
                  </button>
                  <button
                    onClick={handleDeleteAudio}
                    disabled={isDeleting}
                    className="audio-btn audio-btn-icon audio-btn-danger"
                    title="Eliminar audio"
                  >
                    <Trash2 className="audio-icon-small" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Audio element */}
            <audio
              ref={audioRef}
              src={audioUrl}
              preload="metadata"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="audio-player-container">
      <h3 className="audio-player-title">Audio del Cuento</h3>
      {renderContent()}
    </div>
  );
};

export default AudioPlayer;
