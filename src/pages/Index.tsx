import SolarCalculator from '@/components/SolarCalculator';
import ModernCompass from '@/components/ModernCompass';
import solarHero from '@/assets/solar-hero.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden bg-gradient-solar">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={solarHero} 
            alt="Solar panels" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center text-primary-foreground mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Calculadora Solar
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Calcule facilmente a produção mensal estimada do seu sistema de energia solar
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 space-y-12">
        <SolarCalculator />
        <div className="flex justify-center">
          <ModernCompass />
        </div>
      </div>
    </div>
  );
};

export default Index;
