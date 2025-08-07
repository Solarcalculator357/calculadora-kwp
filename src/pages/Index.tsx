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
