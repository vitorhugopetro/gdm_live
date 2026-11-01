import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Users, MapPin } from 'lucide-react';
import { api } from '@/services/api';
import type { ListenerMessage } from '@/types';

export function LiveChatSection() {
  const [messages, setMessages] = useState<ListenerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sender, setSender] = useState('');
  const [city, setCity] = useState('');
  const [messageText, setMessageText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get<{ success: boolean; data: ListenerMessage[] }>('/api/messages');
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Erro ao buscar recados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 15000); // 15s polling
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !messageText.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post<{ success: boolean; data: ListenerMessage }>('/api/messages', {
        sender: sender.trim(),
        city: city.trim() || 'Brasil',
        message: messageText.trim(),
      });
      if (res.data.success) {
        setMessages((prev) => [res.data.data, ...prev]);
        setMessageText('');
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (err) {
      console.error('Erro ao enviar recado:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gdm-card/90 border border-gdm-border p-6 shadow-gdm-lg flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gdm-border/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-gdm-emerald/20 text-gdm-emerald border border-gdm-emerald/30">
            <MessageSquare className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-bold text-gdm-text-primary text-base">Mural de Recados & Ouvintes</h3>
            <p className="text-xs text-gdm-text-muted">Envie sua saudação e paz do Senhor para a rádio</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gdm-emerald/10 border border-gdm-emerald/20 text-gdm-emerald text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-gdm-emerald animate-pulse" />
          <Users className="w-3.5 h-3.5" />
          <span>Ao Vivo</span>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-gdm-bg/60 animate-pulse border border-gdm-border/50" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-xs text-gdm-text-muted py-12">
            Nenhum recado ainda. Mande o primeiro recado!
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="p-3.5 rounded-xl bg-gdm-bg/60 border border-gdm-border/70 hover:border-gdm-purple/30 transition-all text-sm space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gdm-purple-light">{msg.name || msg.sender || 'Ouvinte'}</span>
                <span className="text-gdm-text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gdm-emerald" />
                  {msg.city}
                </span>
              </div>
              <p className="text-gdm-text-primary text-xs leading-relaxed">{msg.message}</p>
              <p className="text-[10px] text-gdm-text-muted text-right">
                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="pt-3 border-t border-gdm-border/60 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            required
            placeholder="Seu Nome *"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-gdm-bg border border-gdm-border text-gdm-text-primary focus:outline-none focus:border-gdm-purple"
          />
          <input
            type="text"
            placeholder="Sua Cidade / UF"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg bg-gdm-bg border border-gdm-border text-gdm-text-primary focus:outline-none focus:border-gdm-purple"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Escreva sua saudação..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-lg bg-gdm-bg border border-gdm-border text-gdm-text-primary focus:outline-none focus:border-gdm-purple"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-gdm-purple hover:bg-gdm-purple-light text-white text-xs font-semibold flex items-center gap-1.5 shadow-gdm transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </form>
    </div>
  );
}

