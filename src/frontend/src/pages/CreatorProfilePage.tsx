import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Eye,
  MapPin,
  MessageCircle,
  Share2,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Type__1 } from "../backend";
import type { ExtendedCreatorProfile } from "../data/sampleCreators";

/* ── Helpers ─────────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function getCategoryLabel(category: Type__1): string {
  switch (category) {
    case Type__1.art:
      return "Art";
    case Type__1.music:
      return "Music";
    case Type__1.food:
      return "Food";
    case Type__1.fashion:
      return "Fashion";
    case Type__1.crafts:
      return "Crafts";
    case Type__1.wellness:
      return "Wellness";
    default:
      return "Other";
  }
}

function getCategoryEmoji(category: Type__1): string {
  switch (category) {
    case Type__1.art:
      return "🎨";
    case Type__1.music:
      return "🎵";
    case Type__1.food:
      return "🍕";
    case Type__1.fashion:
      return "👗";
    case Type__1.crafts:
      return "✂️";
    case Type__1.wellness:
      return "🕯️";
    default:
      return "✦";
  }
}

interface CreatorProfilePageProps {
  creator: ExtendedCreatorProfile;
  onBack: () => void;
}

export default function CreatorProfilePage({
  creator,
  onBack,
}: CreatorProfilePageProps) {
  const [saved, setSaved] = useState(false);
  const categoryLabel = getCategoryLabel(creator.category);
  const categoryEmoji = getCategoryEmoji(creator.category);

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    if (navigator.share) {
      navigator
        .share({ title: creator.name, text: creator.bio })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="min-h-screen bg-background flex flex-col"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* ── Hero Image ─────────────────────────────────────── */}
        <div
          className="relative w-full"
          style={{ height: "45vh", minHeight: 260, maxHeight: 440 }}
        >
          <img
            src={creator.photoUrl}
            alt={`${creator.name}'s work`}
            className="w-full h-full object-cover"
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.15) 70%, rgba(0,0,0,0.6) 100%)",
            }}
          />

          {/* Back button */}
          <motion.button
            type="button"
            aria-label="Go back"
            onClick={onBack}
            className="absolute top-4 left-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/20 hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>

          {/* Status badges top-right */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-1.5">
            {creator.statusBadge && (
              <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-gray-800 text-xs font-semibold shadow-md leading-5 tracking-wide">
                {creator.statusBadge}
              </span>
            )}
            {creator.isTrending && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 text-gray-800 text-xs font-semibold shadow-md leading-5 tracking-wide">
                <TrendingUp className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>

          {/* Category pill bottom of hero */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-white/60 text-white text-[11px] font-semibold bg-white/10 backdrop-blur-sm tracking-wide uppercase">
              {categoryEmoji} {categoryLabel}
            </span>
          </div>
        </div>

        {/* ── Scrollable Body ──────────────────────────────────── */}
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 pb-32">
          {/* ── Creator identity row ──────────────────────────── */}
          <motion.div
            className="flex items-center gap-3 pt-5 pb-4 border-b border-border"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            <Avatar className="w-12 h-12 rounded-full ring-2 ring-primary/25 shadow flex-shrink-0">
              <AvatarImage
                src={creator.avatarUrl || undefined}
                alt={creator.name}
                className="object-cover rounded-full"
              />
              <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-sm">
                {getInitials(creator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-foreground text-lg leading-tight truncate">
                {creator.name}
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground truncate">
                <MapPin className="w-3 h-3 flex-shrink-0 text-primary/60" />
                <span className="truncate">{creator.neighborhood}</span>
                <span className="mx-1 text-border">·</span>
                <span className="text-primary font-semibold">
                  {creator.kmDistance} away
                </span>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border-0 flex-shrink-0"
            >
              {categoryEmoji} {categoryLabel}
            </Badge>
          </motion.div>

          {/* ── Title + Stats ─────────────────────────────────── */}
          <motion.div
            className="py-5 border-b border-border"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h1 className="font-display font-bold text-foreground text-2xl leading-tight mb-3">
              {creator.title ?? creator.name}
            </h1>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Eye className="w-4 h-4" />
                <span className="font-bold text-foreground">
                  {formatCount(creator.views)}
                </span>
                <span>views</span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <Bookmark className="w-4 h-4" />
                <span className="font-bold text-foreground">
                  {formatCount(creator.bookmarks)}
                </span>
                <span>saves</span>
              </div>
            </div>
          </motion.div>

          {/* ── Description ──────────────────────────────────── */}
          <motion.div
            className="py-5 border-b border-border"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
              Description
            </h2>
            <p className="text-[15px] text-foreground leading-relaxed">
              {creator.bio}
            </p>
          </motion.div>

          {/* ── Tags ─────────────────────────────────────────── */}
          {creator.tags && creator.tags.length > 0 && (
            <motion.div
              className="py-5 border-b border-border"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2.5">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {creator.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-medium border border-border hover:border-primary/40 hover:text-primary transition-colors cursor-default"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Interested? section ───────────────────────────── */}
          <motion.div
            className="py-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
          >
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Interested?
            </h2>
            <div className="flex items-center gap-3">
              {/* Saved toggle button */}
              <motion.button
                type="button"
                onClick={() => setSaved((s) => !s)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                  saved
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25"
                }`}
              >
                {saved ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {saved ? "Saved" : "Save"}
              </motion.button>

              {/* Share button */}
              <motion.button
                type="button"
                onClick={handleShare}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:border-primary/40 hover:text-primary bg-card transition-all duration-200 shadow-sm"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Sticky Bottom CTA ────────────────────────────────── */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-primary px-4 py-3.5">
          <button
            type="button"
            className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2.5 text-primary-foreground font-semibold text-[15px] focus-visible:outline-none"
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            Request Collaboration or Custom Order
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
