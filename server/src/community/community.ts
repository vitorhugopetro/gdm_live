import { v4 as uuidv4 } from 'uuid';
import type {
  PrayerRequest,
  Testimony,
  ListenerMessage,
  BroadcastBanner,
  AnalyticsStats,
} from '../types';
import { library } from '../library/library';

class CommunityManager {
  private prayers: PrayerRequest[] = [
    {
      id: uuidv4(),
      name: 'Maria de Fátima',
      city: 'Belo Horizonte/MG',
      request: 'Peço oração pela restauração da saúde do meu esposo e pela paz em nossa família.',
      prayerCount: 14,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Carlos Eduardo',
      city: 'Curitiba/PR',
      request: 'Orando por uma porta de emprego aberta e sabedoria nas decisões profissionais.',
      prayerCount: 9,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Pastora Ana Paula',
      city: 'Resende/RJ',
      request: 'Intercessão pelos jovens da nossa congregação e pelo avivamento espiritual.',
      prayerCount: 27,
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
  ];

  private testimonies: Testimony[] = [
    {
      id: uuidv4(),
      name: 'Luciana Martins',
      city: 'São Paulo/SP',
      title: 'Cura e consolo nas madrugadas',
      testimony: 'Estava passando por um momento de grande ansiedade durante a madrugada. Ao sintonizar a GDM Live Radio, o louvor que tocou trouxe uma paz indescritível ao meu coração. Deus falou comigo grandemente!',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Marcos Vinícius',
      city: 'Goiânia/GO',
      title: 'Restauração familiar através do louvor',
      testimony: 'Colocamos a rádio para tocar em nossa casa todos os dias pela manhã. O ambiente se transformou e a presença do Espírito Santo tem sido real em nosso lar!',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  private messages: ListenerMessage[] = [
    {
      id: uuidv4(),
      name: 'Gabriel Santos',
      city: 'Campinas/SP',
      message: 'A paz do Senhor a todos os ouvintes da GDM Live! Louvores abençoados!',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Juliana e Família',
      city: 'Salvador/BA',
      message: 'Ligados na melhor rádio gospel do Brasil! Parabéns pelo repertório maravilhoso!',
      createdAt: new Date(Date.now() - 900000).toISOString(),
    },
  ];

  private banner: BroadcastBanner = {
    message: '🙏 Bem-vindo à GDM Live Radio — 24 horas de louvores autorais tocando no seu coração! Peça seu louvor na biblioteca.',
    active: true,
    updatedAt: new Date().toISOString(),
  };

  private playCounts: Map<string, number> = new Map();
  private peakListeners = 0;
  private totalPlays = 0;

  // ─── Prayers ───────────────────────────────────────────────────────────────

  getPrayers(limit = 50): PrayerRequest[] {
    return [...this.prayers]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  addPrayer(name: string, request: string, city?: string): PrayerRequest {
    const entry: PrayerRequest = {
      id: uuidv4(),
      name: name.trim() || 'Ouvinte Anônimo',
      city: city?.trim() || undefined,
      request: request.trim(),
      prayerCount: 1,
      createdAt: new Date().toISOString(),
    };
    this.prayers.unshift(entry);
    if (this.prayers.length > 200) this.prayers.pop();
    return entry;
  }

  prayFor(id: string): boolean {
    const p = this.prayers.find((item) => item.id === id);
    if (p) {
      p.prayerCount++;
      return true;
    }
    return false;
  }

  // ─── Testimonies ───────────────────────────────────────────────────────────

  getTestimonies(limit = 30): Testimony[] {
    return [...this.testimonies]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  addTestimony(name: string, title: string, testimony: string, city?: string): Testimony {
    const entry: Testimony = {
      id: uuidv4(),
      name: name.trim() || 'Ouvinte',
      city: city?.trim() || undefined,
      title: title.trim() || 'Testemunho de Fé',
      testimony: testimony.trim(),
      createdAt: new Date().toISOString(),
    };
    this.testimonies.unshift(entry);
    if (this.testimonies.length > 100) this.testimonies.pop();
    return entry;
  }

  // ─── Messages ──────────────────────────────────────────────────────────────

  getMessages(limit = 40): ListenerMessage[] {
    return [...this.messages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  addMessage(name: string, message: string, city?: string): ListenerMessage {
    const entry: ListenerMessage = {
      id: uuidv4(),
      name: name.trim() || 'Ouvinte',
      city: city?.trim() || undefined,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    this.messages.unshift(entry);
    if (this.messages.length > 150) this.messages.pop();
    return entry;
  }

  // ─── Banner ────────────────────────────────────────────────────────────────

  getBanner(): BroadcastBanner {
    return { ...this.banner };
  }

  setBanner(message: string, active: boolean): BroadcastBanner {
    this.banner = {
      message: message.trim(),
      active,
      updatedAt: new Date().toISOString(),
    };
    return this.getBanner();
  }

  // ─── Analytics ─────────────────────────────────────────────────────────────

  recordPlay(trackId: string): void {
    this.totalPlays++;
    const current = this.playCounts.get(trackId) || 0;
    this.playCounts.set(trackId, current + 1);
  }

  updateListenerCount(count: number): void {
    if (count > this.peakListeners) {
      this.peakListeners = count;
    }
  }

  getAnalytics(): AnalyticsStats {
    const allTracks = library.getAll();
    const sortedPlays = Array.from(this.playCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const mostPlayed = sortedPlays.map(([trackId, playCount]) => {
      const track = allTracks.find((t) => t.id === trackId);
      return {
        trackId,
        title: track ? track.title : 'Louvor GDM',
        artist: track ? track.artist : 'GDM Music',
        playCount,
      };
    });

    let totalPrayers = 0;
    for (const p of this.prayers) {
      totalPrayers += p.prayerCount;
    }

    return {
      totalListeners: 0,
      peakListeners: this.peakListeners,
      totalPlays: this.totalPlays,
      totalRequests: 0,
      totalPrayers,
      mostPlayed,
    };
  }
}

export const community = new CommunityManager();

