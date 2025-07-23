import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navigation, Smartphone, Globe, MapPin } from 'lucide-react';
import Globe3D from './Globe';

type PermissionState = 'not-requested' | 'requesting' | 'granted' | 'denied';

const ModernCompass = () => {
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

  const getCardinalDirection = (heading: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  const getCardinalDirectionFull = (heading: number): string => {
    const directions = [
      'Norte', 'Nordeste', 'Leste', 'Sudeste', 
      'Sul', 'Sudoeste', 'Oeste', 'Noroeste'
    ];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 border-0 text-white">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Globe className="h-8 w-8" />
            <CardTitle className="text-3xl font-bold">Bússola Global</CardTitle>
            <Navigation className="h-8 w-8" />
          </div>
          <p className="text-white/90 text-lg">
            Navegação digital com globo terrestre interativo
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Globe Section */}
        <Card className="bg-gradient-to-b from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Globe className="h-5 w-5" />
              Globo Terrestre
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Globe3D heading={heading} />
            
            {heading !== null && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Orientação Atual</span>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    {getCardinalDirection(heading)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {Math.round(heading)}°
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Graus
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">
                      {getCardinalDirectionFull(heading)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Direção
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compass Controls */}
        <Card className="bg-gradient-to-b from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Navigation className="h-5 w-5" />
              Controles da Bússola
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isSupported ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-red-600 font-medium">
                    Dispositivo Não Suportado
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Seu dispositivo não possui sensor de orientação
                  </p>
                </div>
              </div>
            ) : permissionState === 'not-requested' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Navigation className="h-8 w-8 text-blue-500" />
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="font-medium text-slate-800">
                      Ativar Bússola Digital
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Permita o acesso ao sensor de orientação para usar a bússola
                    </p>
                  </div>
                  <Button 
                    onClick={requestCompassPermission}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    size="lg"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Ativar Bússola
                  </Button>
                </div>
              </div>
            ) : permissionState === 'requesting' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground">
                  Aguardando permissão...
                </p>
              </div>
            ) : permissionState === 'denied' ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="h-8 w-8 text-red-500" />
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-red-600 font-medium">
                      Permissão Negada
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Acesso ao sensor foi negado. Verifique as configurações do navegador.
                    </p>
                  </div>
                  <Button 
                    onClick={requestCompassPermission}
                    variant="outline"
                    size="sm"
                  >
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status */}
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Navigation className="h-8 w-8 text-green-500" />
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Bússola Ativa
                  </Badge>
                </div>

                {/* Cardinal directions reference */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-lg font-bold text-red-600">N</div>
                    <div className="text-xs text-muted-foreground">0°</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">E</div>
                    <div className="text-xs text-muted-foreground">90°</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-lg font-bold text-green-600">S</div>
                    <div className="text-xs text-muted-foreground">180°</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-lg font-bold text-yellow-600">W</div>
                    <div className="text-xs text-muted-foreground">270°</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h4 className="font-semibold text-slate-800">Como Usar</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p>Mantenha o dispositivo na horizontal para melhor precisão</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">2</span>
                </div>
                <p>O globo mostra sua orientação atual com uma seta vermelha</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-600">3</span>
                </div>
                <p>Use o mouse para rotacionar e fazer zoom no globo 3D</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernCompass;