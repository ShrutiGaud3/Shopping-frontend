import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

export const AnnouncementBar: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { settings } = useSettings();

  const activeAnnouncements = (settings?.announcements || []).filter(
    (a) => a.isActive !== false && a.text?.trim().length > 0
  );

  // Auto-rotate announcement text if multiple exist
  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  if (!visible || activeAnnouncements.length === 0) return null;

  const currentItem = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? activeAnnouncements.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-b border-amber-200/60 text-slate-800 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 transition-all relative select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-center relative">
        
        {/* Left Arrow (if multi-item) */}
        <div className="w-6 flex justify-start">
          {activeAnnouncements.length > 1 && (
            <button
              onClick={handlePrev}
              className="text-slate-400 hover:text-slate-800 transition p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Previous Announcement"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Center Text with Optional Link */}
        <div className="flex-1 px-2 flex items-center justify-center gap-2 overflow-hidden">
          <span className="font-medium tracking-wide truncate max-w-full inline-flex items-center">
            {currentItem.text}
            {currentItem.link && (
              <Link
                to={currentItem.link}
                className="font-bold text-amber-900 underline hover:text-black ml-1.5 inline-flex items-center gap-0.5 shrink-0"
              >
                Shop Now &gt;
              </Link>
            )}
          </span>
        </div>

        {/* Right Arrow & Close Button */}
        <div className="w-12 flex items-center justify-end gap-1">
          {activeAnnouncements.length > 1 && (
            <button
              onClick={handleNext}
              className="text-slate-400 hover:text-slate-800 transition p-0.5 rounded-full hover:bg-black/5 cursor-pointer"
              aria-label="Next Announcement"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setVisible(false)}
            className="text-slate-400 hover:text-slate-900 transition-colors p-1 rounded-full hover:bg-black/5 cursor-pointer"
            aria-label="Close Announcement"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
