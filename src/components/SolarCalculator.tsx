import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Calculator, Sun, Zap, TrendingUp } from 'lucide-react';

interface CalculationResult {
  monthlyKwh: number;
  dailyKwh: number;
  yearlyKwh: number;
  efficiency: number;
  hsp: number;
}

const SolarCalculator = () => {
  const [kwp, setKwp] = useState<string>('');
  const [hsp, setHsp] = useState<number[]>([5.5]); // Horas de Sol Pleno
  const [efficiency, setEfficiency] = useState<number[]>([85]); // Eficiência do sistema
  const [result, setResult] = useState<CalculationResult | null>(null);

  const calculateConversion = () => {
    const kwpValue = parseFloat(kwp);
    if (isNaN(kwpValue) || kwpValue <= 0) return;

    const hspValue = hsp[0];
    const efficiencyValue = efficiency[0] / 100;
    
    // Fórmula: kWh/mês = kWp × HSP × 30 × eficiência
    const dailyKwh = kwpValue * hspValue * efficiencyValue;
    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    setResult({
      monthlyKwh,
      dailyKwh,
      yearlyKwh,
      efficiency: efficiency[0],
      hsp: hspValue
    });
  };

  const resetCalculator = () => {
    setKwp('');
    setResult(null);
    setHsp([5.5]);
    setEfficiency([85]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-solar border-0 text-primary-foreground">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sun className="h-8 w-8" />
            <CardTitle className="text-3xl font-bold">Calculadora Solar</CardTitle>
          </div>
          <CardDescription className="text-primary-foreground/90 text-lg">
            Converta kWp em kWh/mês para estimar a produção de energia solar
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Parâmetros do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="kwp">Potência Instalada (kWp)</Label>
              <Input
                id="kwp"
                type="number"
                placeholder="Ex: 5.5"
                value={kwp}
                onChange={(e) => setKwp(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label>Horas de Sol Pleno (HSP): {hsp[0]} h/dia</Label>
              <Slider
                value={hsp}
                onValueChange={setHsp}
                max={8}
                min={3}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>3h</span>
                <span>8h</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Eficiência do Sistema: {efficiency[0]}%</Label>
              <Slider
                value={efficiency}
                onValueChange={setEfficiency}
                max={95}
                min={70}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>70%</span>
                <span>95%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={calculateConversion} 
                className="flex-1 bg-gradient-energy hover:opacity-90 transition-opacity"
                disabled={!kwp}
              >
                <Zap className="h-4 w-4 mr-2" />
                Calcular
              </Button>
              <Button variant="outline" onClick={resetCalculator}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <TrendingUp className="h-5 w-5" />
                Resultados da Conversão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-accent">
                    {result.dailyKwh.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">kWh/dia</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary">
                    {result.monthlyKwh.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">kWh/mês</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-secondary">
                  {result.yearlyKwh.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">kWh/ano</div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-foreground">Parâmetros Utilizados:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">HSP: {result.hsp}h</Badge>
                  <Badge variant="outline">Eficiência: {result.efficiency}%</Badge>
                </div>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-white/50 rounded">
                <strong>Fórmula:</strong> kWh = kWp × HSP × Dias × Eficiência
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">kWp (Quilowatt-pico)</h4>
              <p className="text-muted-foreground">
                Potência máxima que o sistema pode gerar em condições ideais de irradiação (1000 W/m²).
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">HSP (Hora de Sol Pleno)</h4>
              <p className="text-muted-foreground">
                Número de horas por dia com irradiação solar de 1000 W/m². Varia por região.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Eficiência do Sistema</h4>
              <p className="text-muted-foreground">
                Considera perdas em cabos, inversor, temperatura e outros fatores do sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SolarCalculator;