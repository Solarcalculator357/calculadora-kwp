import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Sun, Zap, TrendingUp, Ruler, ArrowLeftRight } from 'lucide-react';

interface CalculationResult {
  monthlyKwh: number;
  dailyKwh: number;
  yearlyKwh: number;
  efficiency: number;
  hsp: number;
}

interface ReverseCalculationResult {
  requiredKwp: number;
  dailyKwh: number;
  yearlyKwh: number;
  efficiency: number;
  hsp: number;
}

interface DimensionResult {
  totalModules: number;
  requiredArea: number;
  installationType: string;
  moduleArea: number;
  modulePower: number;
}

const SolarCalculator = () => {
  const [kwp, setKwp] = useState<string>('');
  const [hsp, setHsp] = useState<number[]>([5.5]); // Horas de Sol Pleno
  const [efficiency, setEfficiency] = useState<number[]>([85]); // Eficiência do sistema
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // Estados para conversão reversa (kWh/mês → kWp)
  const [monthlyKwh, setMonthlyKwh] = useState<string>('');
  const [reverseHsp, setReverseHsp] = useState<number[]>([5.5]);
  const [reverseEfficiency, setReverseEfficiency] = useState<number[]>([85]);
  const [reverseResult, setReverseResult] = useState<ReverseCalculationResult | null>(null);
  
  // Estados para cálculo de área
  const [installationType, setInstallationType] = useState<string>('');
  const [moduleHeight, setModuleHeight] = useState<string>('');
  const [moduleWidth, setModuleWidth] = useState<string>('');
  const [modulePower, setModulePower] = useState<string>('');
  const [dimensionResult, setDimensionResult] = useState<DimensionResult | null>(null);

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

  const calculateReverse = () => {
    const monthlyKwhValue = parseFloat(monthlyKwh);
    if (isNaN(monthlyKwhValue) || monthlyKwhValue <= 0) return;

    const hspValue = reverseHsp[0];
    const efficiencyValue = reverseEfficiency[0] / 100;
    
    // Fórmula reversa: kWp = kWh/mês ÷ (HSP × 30 × eficiência)
    const requiredKwp = monthlyKwhValue / (hspValue * 30 * efficiencyValue);
    const dailyKwh = monthlyKwhValue / 30;
    const yearlyKwh = monthlyKwhValue * 12;

    setReverseResult({
      requiredKwp,
      dailyKwh,
      yearlyKwh,
      efficiency: reverseEfficiency[0],
      hsp: hspValue
    });
  };

  const resetCalculator = () => {
    setKwp('');
    setResult(null);
    setHsp([5.5]);
    setEfficiency([85]);
  };

  const resetReverseCalculator = () => {
    setMonthlyKwh('');
    setReverseResult(null);
    setReverseHsp([5.5]);
    setReverseEfficiency([85]);
  };

  const calculateDimension = () => {
    // Usar a potência do cálculo reverso se disponível, senão usar a potência normal
    const kwpValue = reverseResult ? reverseResult.requiredKwp : parseFloat(kwp);
    const moduleHeightValue = parseFloat(moduleHeight);
    const moduleWidthValue = parseFloat(moduleWidth);
    const modulePowerValue = parseFloat(modulePower);
    
    if (isNaN(kwpValue) || isNaN(moduleHeightValue) || isNaN(moduleWidthValue) || isNaN(modulePowerValue) || 
        kwpValue <= 0 || moduleHeightValue <= 0 || moduleWidthValue <= 0 || modulePowerValue <= 0 || !installationType) return;

    // Calcular área do módulo
    const moduleArea = moduleHeightValue * moduleWidthValue;
    
    // Converter kWp para Watts
    const totalPowerWatts = kwpValue * 1000;
    
    // Calcular número de módulos necessários
    const totalModules = Math.ceil(totalPowerWatts / modulePowerValue);
    
    // Calcular área necessária total
    const requiredArea = totalModules * moduleArea;

    setDimensionResult({
      totalModules,
      requiredArea,
      installationType,
      moduleArea,
      modulePower: modulePowerValue
    });
  };

  const resetDimension = () => {
    setInstallationType('');
    setModuleHeight('');
    setModuleWidth('');
    setModulePower('');
    setDimensionResult(null);
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
            Converta a medida de capacidade para estimar a produção de energia solar
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              kWp → kWh/mês
            </CardTitle>
            <CardDescription>
              Calcule a produção mensal a partir da potência instalada
            </CardDescription>
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
                min={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10%</span>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              kWh/mês → kWp
            </CardTitle>
            <CardDescription>
              Calcule a potência necessária a partir do consumo mensal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="monthly-kwh">Consumo Mensal (kWh/mês)</Label>
              <Input
                id="monthly-kwh"
                type="number"
                placeholder="Ex: 350"
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-3">
              <Label>Horas de Sol Pleno (HSP): {reverseHsp[0]} h/dia</Label>
              <Slider
                value={reverseHsp}
                onValueChange={setReverseHsp}
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
              <Label>Eficiência do Sistema: {reverseEfficiency[0]}%</Label>
              <Slider
                value={reverseEfficiency}
                onValueChange={setReverseEfficiency}
                max={95}
                min={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10%</span>
                <span>95%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={calculateReverse} 
                className="flex-1 bg-gradient-energy hover:opacity-90 transition-opacity"
                disabled={!monthlyKwh}
              >
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Calcular
              </Button>
              <Button variant="outline" onClick={resetReverseCalculator}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {result && (
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <TrendingUp className="h-5 w-5" />
                Produção de Energia
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

        {reverseResult && (
          <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <ArrowLeftRight className="h-5 w-5" />
                Potência Necessária
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-primary">
                  {reverseResult.requiredKwp.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">kWp necessários</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-accent">
                    {reverseResult.dailyKwh.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">kWh/dia</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-secondary">
                    {reverseResult.yearlyKwh.toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">kWh/ano</div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-foreground">Parâmetros Utilizados:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">HSP: {reverseResult.hsp}h</Badge>
                  <Badge variant="outline">Eficiência: {reverseResult.efficiency}%</Badge>
                </div>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-white/50 rounded">
                <strong>Fórmula:</strong> kWp = kWh/mês ÷ (HSP × 30 × Eficiência)
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bloco de Cálculo de Área */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              Cálculo de Área
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Indicador da potência que será usada */}
            {(reverseResult || result) && (
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-sm text-muted-foreground">Potência para dimensionamento:</div>
                <div className="text-lg font-bold text-primary">
                  {reverseResult ? reverseResult.requiredKwp.toFixed(2) : parseFloat(kwp || '0').toFixed(2)} kWp
                </div>
                <div className="text-xs text-muted-foreground">
                  {reverseResult ? 'Obtida do cálculo kWh/mês → kWp' : 'Obtida do cálculo kWp → kWh/mês'}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="installation-type">Tipo de Instalação</Label>
              <Select value={installationType} onValueChange={setInstallationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceramico">Cerâmico</SelectItem>
                  <SelectItem value="metalico">Metálico</SelectItem>
                  <SelectItem value="carport">Carport</SelectItem>
                  <SelectItem value="solo">Solo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="module-height">Altura do Módulo (m)</Label>
                <Input
                  id="module-height"
                  type="number"
                  placeholder="Ex: 2.0"
                  value={moduleHeight}
                  onChange={(e) => setModuleHeight(e.target.value)}
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-width">Largura do Módulo (m)</Label>
                <Input
                  id="module-width"
                  type="number"
                  placeholder="Ex: 1.2"
                  value={moduleWidth}
                  onChange={(e) => setModuleWidth(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>

            {moduleHeight && moduleWidth && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Área do módulo:</div>
                <div className="text-lg font-semibold text-primary">
                  {(parseFloat(moduleHeight) * parseFloat(moduleWidth)).toFixed(2)} m²
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="module-power">Potência do Módulo (W)</Label>
              <Input
                id="module-power"
                type="number"
                placeholder="Ex: 550"
                value={modulePower}
                onChange={(e) => setModulePower(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={calculateDimension} 
                className="flex-1 bg-gradient-energy hover:opacity-90 transition-opacity"
                disabled={!(reverseResult || kwp) || !installationType || !moduleHeight || !moduleWidth || !modulePower}
              >
                <Ruler className="h-4 w-4 mr-2" />
                Dimensionamento
              </Button>
              <Button variant="outline" onClick={resetDimension}>
                Limpar
              </Button>
            </div>
          </CardContent>
        </Card>

        {dimensionResult && (
          <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <Ruler className="h-5 w-5" />
                Dimensionamento do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-accent">
                    {dimensionResult.totalModules}
                  </div>
                  <div className="text-sm text-muted-foreground">Módulos</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-primary">
                    {dimensionResult.requiredArea.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">m² necessários</div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-foreground">Especificações:</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {dimensionResult.installationType.charAt(0).toUpperCase() + dimensionResult.installationType.slice(1)}
                  </Badge>
                  <Badge variant="outline">{dimensionResult.modulePower}W por módulo</Badge>
                  <Badge variant="outline">{dimensionResult.moduleArea}m² por módulo</Badge>
                </div>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-white/50 rounded">
                <strong>Cálculo:</strong> {parseFloat(kwp) * 1000}W ÷ {dimensionResult.modulePower}W = {dimensionResult.totalModules} módulos × {dimensionResult.moduleArea.toFixed(2)}m² = {dimensionResult.requiredArea.toFixed(1)}m²
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
