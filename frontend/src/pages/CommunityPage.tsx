import { DailyVerseCard } from '@/components/Spiritual/DailyVerseCard';
import { PrayerWallSection } from '@/components/Community/PrayerWallSection';
import { TestimoniesSection } from '@/components/Community/TestimoniesSection';
import { LiveChatSection } from '@/components/Community/LiveChatSection';

export default function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gdm-purple/20 text-gdm-purple-light border border-gdm-purple/30">
          Comunhão & Intercessão
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gdm-text-primary">
          Comunidade GDM Live
        </h1>
        <p className="text-gdm-text-secondary text-sm md:text-base max-w-2xl mx-auto">
          Um espaço sagrado para orarmos uns pelos outros, celebrarmos testemunhos de milagres e nos saudarmos em Cristo Jesus.
        </p>
      </div>

      {/* Daily Verse */}
      <DailyVerseCard />

      {/* Grid: Live Chat + Prayer Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Live listener messages feed */}
        <div className="lg:col-span-1">
          <LiveChatSection />
        </div>

        {/* Right column: Prayer Wall */}
        <div className="lg:col-span-2">
          <PrayerWallSection />
        </div>
      </div>

      {/* Full width: Testimonies */}
      <TestimoniesSection />
    </div>
  );
}

