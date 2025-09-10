import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Webhook, Plus, Edit, Trash2 } from 'lucide-react';

interface WebhookSetting {
  id: string;
  webhook_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export const WebhookSettings = () => {
  const [webhooks, setWebhooks] = useState<WebhookSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    webhook_url: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const fetchWebhooks = async () => {
    try {
      const { data, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching webhooks:', error);
        toast({
          title: "Erro",
          description: "Falha ao carregar configurações de webhook",
          variant: "destructive",
        });
        return;
      }

      setWebhooks(data || []);
    } catch (error) {
      console.error('Error fetching webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.webhook_url.trim()) {
      toast({
        title: "Erro",
        description: "URL do webhook é obrigatória",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Atualizar webhook existente
        const { error } = await supabase
          .from('webhook_settings')
          .update({
            webhook_url: formData.webhook_url,
            description: formData.description
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Webhook atualizado com sucesso",
        });
      } else {
        // Criar novo webhook
        const { data: userData } = await supabase.auth.getUser();
        
        const { error } = await supabase
          .from('webhook_settings')
          .insert({
            user_id: userData?.user?.id,
            webhook_url: formData.webhook_url,
            description: formData.description
          });

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Webhook criado com sucesso",
        });
      }

      setFormData({ webhook_url: '', description: '' });
      setIsEditing(false);
      setEditingId(null);
      await fetchWebhooks();
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar webhook",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (webhook: WebhookSetting) => {
    setFormData({
      webhook_url: webhook.webhook_url,
      description: webhook.description
    });
    setEditingId(webhook.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('webhook_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Webhook removido com sucesso",
      });

      await fetchWebhooks();
    } catch (error) {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Erro",
        description: "Falha ao remover webhook",
        variant: "destructive",
      });
    }
  };

  const toggleWebhook = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('webhook_settings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Webhook ${!currentStatus ? 'ativado' : 'desativado'} com sucesso`,
      });

      await fetchWebhooks();
    } catch (error) {
      console.error('Error toggling webhook:', error);
      toast({
        title: "Erro",
        description: "Falha ao alterar status do webhook",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          Configurações de Automação (N8N)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário */}
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {editingId ? 'Editar Webhook' : 'Novo Webhook'}
            </h3>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            )}
          </div>

          {isEditing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook_url">URL do Webhook N8N</Label>
                <Input
                  id="webhook_url"
                  type="url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhook_url: e.target.value }))}
                  placeholder="https://seu-n8n.com/webhook/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do fluxo de automação"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading}>
                  Salvar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                    setFormData({ webhook_url: '', description: '' });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Lista de Webhooks */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Webhooks Configurados</h3>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : webhooks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum webhook configurado
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={webhook.is_active ? "default" : "secondary"}>
                        {webhook.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <p className="font-medium truncate">{webhook.webhook_url}</p>
                    {webhook.description && (
                      <p className="text-sm text-muted-foreground mt-1">{webhook.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Criado em: {new Date(webhook.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleWebhook(webhook.id, webhook.is_active)}
                    >
                      {webhook.is_active ? 'Desativar' : 'Ativar'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(webhook)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};