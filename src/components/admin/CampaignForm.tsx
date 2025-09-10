import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Send, X, Users, Mail } from 'lucide-react';

interface User {
  user_id: string;
  full_name: string | null;
  phone: string | null;
}

export const CampaignForm = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    mensagem: ''
  });
  const [anexo, setAnexo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [sendType, setSendType] = useState<'all' | 'specific'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, phone');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar tamanho do arquivo (limite de 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Limite de 10MB.",
          variant: "destructive",
        });
        return;
      }
      setAnexo(file);
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = () => {
    setSelectedUsers(users.map(user => user.user_id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleCancel = () => {
    setFormData({
      titulo: '',
      descricao: '',
      mensagem: ''
    });
    setAnexo(null);
    setSendType('all');
    setSelectedUsers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || !formData.mensagem.trim()) {
      toast({
        title: "Erro",
        description: "Título e mensagem são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (sendType === 'specific' && selectedUsers.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um usuário para enviar a campanha",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let anexoBytes = null;

      // Converter arquivo para bytes se existir
      if (anexo) {
        const buffer = await anexo.arrayBuffer();
        anexoBytes = new Uint8Array(buffer);
      }

      const { error } = await supabase
        .from('campanhas')
        .insert({
          titulo: formData.titulo,
          descricao: formData.descricao,
          mensagem: formData.mensagem,
          anexo: anexoBytes
        });

      if (error) {
        console.error('Error creating campaign:', error);
        toast({
          title: "Erro",
          description: "Falha ao criar campanha",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso!",
      });

      handleCancel();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erro",
        description: "Falha ao criar campanha",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Megaphone className="h-5 w-5" />
          Campanhas e Promoções
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Título da campanha"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descrição da campanha (opcional)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
              placeholder="Mensagem que será enviada aos clientes"
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="anexo">Anexo</Label>
            <Input
              id="anexo"
              type="file"
              onChange={handleFileChange}
              accept="image/*,application/pdf,.doc,.docx"
            />
            {anexo && (
              <p className="text-sm text-muted-foreground">
                Arquivo selecionado: {anexo.name} ({(anexo.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          {/* Seleção de Destinatários */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Destinatários</Label>
            <RadioGroup value={sendType} onValueChange={(value: 'all' | 'specific') => setSendType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Enviar para todos os usuários
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific" className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" />
                  Selecionar usuários específicos
                </Label>
              </div>
            </RadioGroup>

            {sendType === 'specific' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                    disabled={loadingUsers}
                  >
                    Selecionar Todos
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                    disabled={loadingUsers}
                  >
                    Desmarcar Todos
                  </Button>
                </div>

                {loadingUsers ? (
                  <p className="text-sm text-muted-foreground">Carregando usuários...</p>
                ) : (
                  <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                    {users.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum usuário encontrado</p>
                    ) : (
                      users.map((user) => (
                        <div key={user.user_id} className="flex items-center space-x-2">
                          <Checkbox
                            id={user.user_id}
                            checked={selectedUsers.includes(user.user_id)}
                            onCheckedChange={(checked) => handleUserSelection(user.user_id, checked as boolean)}
                          />
                          <Label 
                            htmlFor={user.user_id} 
                            className="flex-1 cursor-pointer text-sm"
                          >
                            {user.full_name || 'Nome não informado'} 
                            {user.phone && (
                              <span className="text-muted-foreground ml-2">({user.phone})</span>
                            )}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedUsers.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedUsers.length} usuário(s) selecionado(s)
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Enviando...' : 'Enviar Campanha'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};