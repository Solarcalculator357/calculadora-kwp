import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Send, X } from 'lucide-react';

export const CampaignForm = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    mensagem: ''
  });
  const [anexo, setAnexo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const handleCancel = () => {
    setFormData({
      titulo: '',
      descricao: '',
      mensagem: ''
    });
    setAnexo(null);
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