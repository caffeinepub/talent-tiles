import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bookmark,
  CheckCircle,
  Eye,
  MapPin,
  Phone,
  Share2,
  Star,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type React from "react";
import { Type__1 } from "../backend";
import type { ExtendedCreatorProfile, StatusTag } from "../data/sampleCreators";

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

interface TagConfig {
  bg: string;
  text: string;
  icon?: React.ReactNode;
}

function getTagConfig(tag: StatusTag): TagConfig {
  switch (tag) {
    case "Process":
      return {
        bg: "bg-blue-600",
        text: "text-white",
      };
    case "Trusted":
      return {
        bg: "bg-blue-600",
        text: "text-white",
        icon: <CheckCircle className="w-3 h-3 flex-shrink-0" />,
      };
    case "Upcoming Drop":
      return {
        bg: "bg-orange-500",
        text: "text-white",
      };
    case "Popular":
      return {
        bg: "bg-orange-500",
        text: "text-white",
        icon: <Star className="w-3 h-3 flex-shrink-0 fill-white" />,
      };
    case "Final Product":
      return {
        bg: "bg-green-500",
        text: "text-white",
      };
    case "Work in Progress":
      return {
        bg: "bg-violet-600",
        text: "text-white",
        icon: <Zap className="w-3 h-3 flex-shrink-0 fill-white" />,
      };
    case "Event":
      return {
        bg: "bg-rose-600",
        text: "text-white",
      };
    default:
      return {
        bg: "bg-white/90",
        text: "text-gray-800",
      };
  }
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
  onView: (id: bigint) => void;
}

export function CreatorTile({ creator, index, onView }: CreatorTileProps) {
  const categoryLabel = getCategoryLabel(creator.category);

  return (
    <motion.article
      tabIndex={0}
      aria-label={`View ${creator.name}'s profile`}
      className="group bg-card rounded-2xl overflow-hidden shadow-tile cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      onClick={() => onView(creator.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView(creator.id);
        }
      }}
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
        {creator.statusTags && creator.statusTags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
            {creator.statusTags.map((tag) => {
              const config = getTagConfig(tag);
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${config.bg} ${config.text} text-[11px] font-semibold shadow-md leading-5 tracking-wide whitespace-nowrap`}
                >
                  {config.icon}
                  {tag}
                </span>
              );
            })}
          </div>
        )}

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
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-gray-900 text-xs font-semibold shadow hover:bg-gray-50 active:scale-95 transition-all duration-150 flex-shrink-0"
              >
                <Phone className="w-3 h-3 flex-shrink-0" />
                Contact
              </button>
              <button
                type="button"
                aria-label="Share"
                onClick={(e) => e.stopPropagation()}
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
      <div className="px-4 pt-4 pb-3.5 bg-card">
        {/* Row: avatar + name/location + stats */}
        <div className="flex items-center gap-3.5">
          {/* Circular avatar with ring */}
          <div className="flex-shrink-0">
            <Avatar className="w-12 h-12 rounded-full ring-2 ring-primary/20 shadow-md">
              <AvatarImage
                src={creator.avatarUrl || undefined}
                alt={creator.name}
                className="object-cover rounded-full"
              />
              <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-sm">
                {getInitials(creator.name)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name + location */}
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-foreground text-[15px] leading-tight truncate">
              {creator.name}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground truncate mt-0.5">
              <MapPin className="w-3 h-3 flex-shrink-0 text-primary/60" />
              <span className="truncate">{creator.neighborhood}</span>
            </p>
          </div>

          {/* Stats — right-aligned */}
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="font-semibold text-foreground">
                {formatCount(creator.views)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3" />
              <span className="font-semibold text-foreground">
                {formatCount(creator.bookmarks)}
              </span>
            </span>
          </div>
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
