import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Eye, MapPin, Phone, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { Type__1 } from "../backend";
import type { ExtendedCreatorProfile } from "../data/sampleCreators";

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

interface CreatorTileProps {
  creator: ExtendedCreatorProfile;
  index: number;
}

export function CreatorTile({ creator, index }: CreatorTileProps) {
  const categoryLabel = getCategoryLabel(creator.category);

  return (
    <motion.article
      className="group bg-card rounded-2xl overflow-hidden shadow-tile cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{
        y: -4,
        boxShadow:
          "0 16px 40px 0 rgba(0,0,0,0.16), 0 4px 12px 0 rgba(0,0,0,0.10)",
      }}
    >
      {/* ── Photo section ─────────────────────────────────── */}
      <div className="relative h-80 overflow-hidden rounded-t-2xl bg-muted">
        {/* Cover image */}
        <img
          src={creator.photoUrl}
          alt={`${creator.name}'s work`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Rich dark gradient — transparent top → strong dark bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.42) 60%, rgba(0,0,0,0.82) 100%)",
          }}
        />

        {/* ── Top-right: status pill badges ────────────────── */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          {creator.statusBadge && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-gray-800 text-xs font-semibold shadow-md leading-5 tracking-wide">
              {creator.statusBadge}
            </span>
          )}
          {creator.isTrending && (
            <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-gray-800 text-xs font-semibold shadow-md leading-5 tracking-wide">
              ✦ Trending
            </span>
          )}
        </div>

        {/* ── Bottom overlay content ───────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3.5 flex flex-col gap-1.5">
          {/* Category badge — above title, per reference */}
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-white/70 text-white text-[11px] font-semibold bg-white/10 backdrop-blur-sm tracking-wide uppercase">
              {categoryLabel}
            </span>
          </div>

          {/* Title — bold, large, 2-line max */}
          <h3 className="font-display font-bold text-white text-lg leading-snug line-clamp-2 drop-shadow-md">
            {creator.title ?? creator.name}
          </h3>

          {/* Bottom row: distance + action buttons */}
          <div className="flex items-center justify-between gap-2 mt-1">
            {/* Distance pill — white bg, dark text */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-gray-900 text-xs font-semibold shadow flex-shrink-0">
              <MapPin className="w-3 h-3 flex-shrink-0 text-gray-500" />
              {creator.kmDistance} away
            </span>

            {/* Action buttons — white bg, rounded-full, compact */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Contact creator"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-900 text-xs font-semibold shadow hover:bg-gray-50 active:scale-95 transition-all duration-150 flex-shrink-0"
              >
                <Phone className="w-3 h-3 flex-shrink-0" />
                Contact
              </button>
              <button
                type="button"
                aria-label="Share"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-900 text-xs font-semibold shadow hover:bg-gray-50 active:scale-95 transition-all duration-150 flex-shrink-0"
              >
                <Share2 className="w-3 h-3 flex-shrink-0" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info section ──────────────────────────────────── */}
      <div className="px-4 pt-3.5 pb-3 bg-card">
        {/* Row: avatar + name + location */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-10 h-10 rounded-full flex-shrink-0 ring-2 ring-white shadow-sm">
            <AvatarImage
              src={creator.avatarUrl || undefined}
              alt={creator.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-sm">
              {getInitials(creator.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-foreground text-[15px] leading-tight truncate">
              {creator.name}
            </p>
            <p className="flex items-center gap-0.5 text-xs text-muted-foreground truncate mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{creator.neighborhood}</span>
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-2.5">
          <span className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground">
              {formatCount(creator.views)}
            </span>
            <span>views</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5" />
            <span className="font-semibold text-foreground">
              {formatCount(creator.bookmarks)}
            </span>
            <span>saves</span>
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export function CreatorTileSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-tile">
      {/* Photo skeleton */}
      <div className="h-64 bg-muted animate-pulse" />

      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
          <div className="flex-1">
            <div className="h-4 bg-muted rounded-lg w-3/4 animate-pulse mb-1.5" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 pt-2.5 border-t border-border">
          <div className="h-3 bg-muted rounded w-16 animate-pulse" />
          <div className="h-3 bg-muted rounded w-10 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
