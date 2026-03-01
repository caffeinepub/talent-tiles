import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Eye, MapPin, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
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

interface CreatorTileProps {
  creator: ExtendedCreatorProfile;
  index: number;
}

export function CreatorTile({ creator, index }: CreatorTileProps) {
  return (
    <motion.article
      className="group bg-card rounded-2xl overflow-hidden shadow-tile cursor-pointer transition-shadow duration-300 hover:shadow-tile-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      {/* ── Photo section ─────────────────────────────────── */}
      <div className="relative h-52 overflow-hidden rounded-t-2xl bg-muted">
        <img
          src={creator.photoUrl}
          alt={`${creator.name}'s work`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Distance badge — bottom left */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-foreground/80 backdrop-blur-sm text-white text-xs font-medium">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{creator.kmDistance} away</span>
        </div>

        {/* Status badge — top right */}
        {creator.statusBadge && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold shadow-sm">
            {creator.statusBadge}
          </div>
        )}
      </div>

      {/* ── Info section ──────────────────────────────────── */}
      <div className="p-4 bg-card">
        {/* Row 1: avatar + name + optional trending */}
        <div className="flex items-center gap-2.5 mb-1.5">
          <Avatar className="w-9 h-9 rounded-full flex-shrink-0 ring-2 ring-border">
            <AvatarImage
              src={creator.avatarUrl || undefined}
              alt={creator.name}
              className="object-cover"
            />
            <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-sm">
              {getInitials(creator.name)}
            </AvatarFallback>
          </Avatar>

          <h3 className="font-display font-bold text-foreground text-sm leading-tight flex-1 truncate">
            {creator.name}
          </h3>

          {creator.isTrending && (
            <TrendingUp className="w-4 h-4 text-orange-500 flex-shrink-0" />
          )}
        </div>

        {/* Row 2: neighborhood */}
        <p
          className="text-xs font-medium mb-2.5 truncate"
          style={{ color: "oklch(var(--primary) / 0.7)" }}
        >
          {creator.neighborhood}
        </p>

        {/* Row 3: stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {formatCount(creator.views)}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5" />
            {formatCount(creator.bookmarks)}
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
      <div className="h-52 bg-muted animate-pulse" />

      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse flex-shrink-0" />
          <div className="h-4 bg-muted rounded-lg flex-1 animate-pulse" />
        </div>
        <div className="h-3 bg-muted rounded w-1/2 mb-2.5 animate-pulse" />
        <div className="flex gap-3">
          <div className="h-3 bg-muted rounded w-12 animate-pulse" />
          <div className="h-3 bg-muted rounded w-12 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
