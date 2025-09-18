import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserList } from '@/components/admin/UserList';
import { WebhookSettings } from '@/components/admin/WebhookSettings';
import { CampaignForm } from '@/components/admin/CampaignForm';
import { LogOut, LayoutDashboard, Home } from 'lucide-react';

const Dashboard = () => {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-solar">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary-foreground" />
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">Dashboard Admin</h1>
              <p className="text-primary-foreground/80">Gerenciamento do sistema</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              asChild
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Página Principal
              </Link>
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Lista de Usuários */}
          <div className="lg:col-span-2">
            <UserList />
          </div>

          {/* Configurações de Webhook */}
          <div>
            <WebhookSettings />
          </div>

          {/* Formulário de Campanhas */}
          <div>
            <CampaignForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;