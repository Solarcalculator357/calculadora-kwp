import SolarCalculator from '@/components/SolarCalculator';
import ModernCompass from '@/components/ModernCompass';
import solarHero from '@/assets/solar-hero.jpg';

const Index = () => {
  return (
    
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
