import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Navigation, Smartphone } from 'lucide-react';

type PermissionState = 'not-requested' | 'requesting' | 'granted' | 'denied';

const Compass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionState, setPermissionState] = useState<PermissionState>('not-requested');

  const requestCompassPermission = async () => {
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    setPermissionState('requesting');

    try {
      // Para iOS 13+ que requer permissão explícita
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionState('granted');
          startCompass();
        } else {
          setPermissionState('denied');
        }
      } else {
        // Para outros dispositivos que não precisam de permissão explícita
        setPermissionState('granted');
        startCompass();
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão da bússola:', error);
      setPermissionState('denied');
    }
  };

  const startCompass = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let compassHeading = event.alpha;
      
      // Para Safari iOS
      if (typeof (event as any).webkitCompassHeading !== "undefined") {
        compassHeading = (event as any).webkitCompassHeading;
      }

      if (compassHeading !== null) {
        setHeading(compassHeading);
      } else {
        setIsSupported(false);
      }
    };

    // Tentar ambos os eventos
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    // Cleanup function para remover os listeners
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  };

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

    // Verificar se precisa de permissão (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // Precisa solicitar permissão explicitamente
      setPermissionState('not-requested');
    } else {
      // Pode usar diretamente
      setPermissionState('granted');
      const cleanup = startCompass();
      return cleanup;
    }
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Navigation className="h-6 w-6" />
          Bússola
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <div className="relative w-48 h-48">
          {/* Compass Rose */}
          <div 
            className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-500 ease-out"
            style={{
              backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/4/42/Compass_Rose_English_North.svg")',
              transform: heading !== null ? `rotate(${-heading}deg)` : 'rotate(0deg)'
            }}
          />
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="text-center space-y-4">
          {!isSupported ? (
            <div className="space-y-2">
              <p className="text-destructive font-medium">
                Bússola não suportada
              </p>
              <p className="text-sm text-muted-foreground">
                Este dispositivo não suporta orientação
              </p>
            </div>
          ) : permissionState === 'not-requested' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-muted-foreground font-medium">
                  Permissão necessária
                </p>
                <p className="text-sm text-muted-foreground">
                  Clique para permitir acesso à bússola
                </p>
              </div>
              <Button 
                onClick={requestCompassPermission}
                className="bg-gradient-energy hover:opacity-90 transition-opacity"
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Permitir Acesso à Bússola
              </Button>
            </div>
          ) : permissionState === 'requesting' ? (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Solicitando permissão...
              </p>
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : permissionState === 'denied' ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-destructive font-medium">
                  Permissão negada
                </p>
                <p className="text-sm text-muted-foreground">
                  Acesso à bússola foi negado. Tente novamente ou verifique as configurações do navegador.
                </p>
              </div>
              <Button 
                onClick={requestCompassPermission}
                variant="outline"
                size="sm"
              >
                Tentar novamente
              </Button>
            </div>
          ) : permissionState === 'granted' && heading !== null ? (
            <div className="space-y-2">
              <p className="text-2xl font-bold text-primary">
                {Math.round(heading)}°
              </p>
              <p className="text-muted-foreground">
                Direção atual
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Carregando...
              </p>
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded">
          <p className="font-medium mb-1">Como usar:</p>
          <p>Mantenha o dispositivo na horizontal para obter a leitura mais precisa da direção.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Compass;