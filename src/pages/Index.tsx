
import SolarCalculator from '@/components/SolarCalculator';
import ModernCompass from '@/components/ModernCompass';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
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
          <div className="flex justify-between items-center mb-8">
            <div className="text-center text-primary-foreground flex-1">
              <h1 className="text-4xl font-bold mb-2">Calculadora Solar</h1>
              <p className="text-xl opacity-90">Descubra o potencial solar da sua região</p>
            </div>
            <div className="flex gap-2">
              <Button 
                asChild
                variant="outline"
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/auth">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
            </div>
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
