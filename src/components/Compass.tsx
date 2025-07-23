import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navigation } from 'lucide-react';

const Compass = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
      return;
    }

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

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
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

        <div className="text-center">
          {isSupported ? (
            heading !== null ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(heading)}°
                </p>
                <p className="text-muted-foreground">
                  Direção atual
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Carregando...
              </p>
            )
          ) : (
            <div className="space-y-2">
              <p className="text-destructive font-medium">
                Bússola não suportada
              </p>
              <p className="text-sm text-muted-foreground">
                Este dispositivo não suporta orientação
              </p>
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