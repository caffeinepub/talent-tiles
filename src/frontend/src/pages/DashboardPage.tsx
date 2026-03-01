import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart2,
  LayoutGrid,
  LogOut,
  MapPin,
  SearchX,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { Type, Type__1 } from "../backend";
import { CreatorTile, CreatorTileSkeleton } from "../components/CreatorTile";
import { useAuth } from "../context/AuthContext";
import type { ExtendedCreatorProfile } from "../data/sampleCreators";
import { sampleCreators } from "../data/sampleCreators";
import { useGetAllCreators } from "../hooks/useQueries";

/* ── Filter types ──────────────────────────────────────────── */
type DistanceFilter = "all" | Type;
type CategoryFilter = "all" | Type__1;

const DISTANCE_OPTIONS: { value: DistanceFilter; label: string }[] = [
  { value: Type.hyperlocal, label: "Hyperlocal (0-3 km)" },
  { value: Type.neighborhood, label: "Neighborhood (3-7 km)" },
  { value: Type.cityWide, label: "City-wide (7-20 km)" },
];

const CATEGORY_OPTIONS: {
  value: CategoryFilter;
  label: string;
  emoji: string;
}[] = [
  { value: "all", label: "All", emoji: "🎨" },
  { value: Type__1.art, label: "Art", emoji: "🎨" },
  { value: Type__1.food, label: "Food", emoji: "🍕" },
  { value: Type__1.fashion, label: "Fashion", emoji: "👗" },
  { value: Type__1.crafts, label: "Crafts", emoji: "✂️" },
  { value: Type__1.music, label: "Music", emoji: "🎵" },
  { value: Type__1.wellness, label: "Wellness", emoji: "🕯️" },
];

/* Grid-pattern logo icon */
function GridLogoIcon() {
  return (
    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-xs flex-shrink-0">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
        <rect x="11" y="2" width="5" height="5" rx="1" fill="white" />
        <rect x="2" y="11" width="5" height="5" rx="1" fill="white" />
        <rect x="11" y="11" width="5" height="5" rx="1" fill="white" />
      </svg>
    </div>
  );
}

export default function DashboardPage() {
  const { logout, username } = useAuth();

  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const { data: backendCreators, isLoading } = useGetAllCreators();

  // Merge backend creators with sample data (backend takes precedence when available)
  const allCreators: ExtendedCreatorProfile[] = useMemo(() => {
    if (backendCreators && backendCreators.length > 0) {
      // Map backend profiles to ExtendedCreatorProfile with sensible defaults
      return backendCreators.map((c, i) => {
        const sample =
          sampleCreators.find((s) => s.id === c.id) ??
          sampleCreators[i % sampleCreators.length];
        return {
          ...c,
          neighborhood: sample?.neighborhood ?? "Local Area",
          kmDistance: sample?.kmDistance ?? "nearby",
          views: sample?.views ?? 0,
          bookmarks: sample?.bookmarks ?? 0,
          photoUrl:
            sample?.photoUrl ??
            `https://picsum.photos/seed/${c.id.toString()}/600/400`,
          statusBadge: sample?.statusBadge,
          isTrending: sample?.isTrending,
        };
      });
    }
    return sampleCreators;
  }, [backendCreators]);

  // Client-side filtering
  const filteredCreators = useMemo(() => {
    return allCreators.filter((creator) => {
      const matchesDistance =
        distanceFilter === "all" || creator.distanceLabel === distanceFilter;
      const matchesCategory =
        categoryFilter === "all" || creator.category === categoryFilter;
      return matchesDistance && matchesCategory;
    });
  }, [allCreators, distanceFilter, categoryFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Nav Bar ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center gap-3">
            <GridLogoIcon />
            <div className="flex flex-col">
              <span className="font-display font-bold text-base leading-tight tracking-tight text-foreground">
                Talent Tiles
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                Discover local creators
              </span>
            </div>
          </div>

          {/* Right nav icons */}
          <div className="flex items-center gap-1">
            {/* Grid view (active) */}
            <button
              type="button"
              aria-label="Grid view"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/15 transition-colors"
            >
              <LayoutGrid className="w-4.5 h-4.5" />
            </button>

            {/* Analytics */}
            <button
              type="button"
              aria-label="Analytics"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <BarChart2 className="w-4.5 h-4.5" />
            </button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Profile menu"
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <User className="w-4.5 h-4.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate border-b border-border mb-1">
                  {username ?? "User"}
                </div>
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* ── Filters ──────────────────────────────────────────── */}
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Distance filter */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-secondary flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {DISTANCE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() =>
                    setDistanceFilter(
                      distanceFilter === opt.value ? "all" : opt.value,
                    )
                  }
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    distanceFilter === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-md bg-secondary flex-shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setCategoryFilter(opt.value)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 flex items-center gap-1.5 ${
                    categoryFilter === opt.value
                      ? "bg-primary text-primary-foreground border-primary shadow-xs"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Showing count */}
        {!isLoading && filteredCreators.length > 0 && (
          <motion.p
            className="text-sm text-muted-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            Showing {filteredCreators.length} creator
            {filteredCreators.length !== 1 ? "s" : ""} in your area
          </motion.p>
        )}

        {/* ── Grid ─────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((k) => (
              <CreatorTileSkeleton key={k} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filteredCreators.length === 0 ? (
              <motion.div
                key="empty"
                className="flex flex-col items-center justify-center py-24 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
                  <SearchX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  No creators found
                </h3>
                <p className="text-muted-foreground max-w-xs text-sm">
                  Try adjusting your distance or category filters to find more
                  creators in your area.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setDistanceFilter("all");
                    setCategoryFilter("all");
                  }}
                >
                  Clear all filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredCreators.map((creator, i) => (
                  <CreatorTile
                    key={creator.id.toString()}
                    creator={creator}
                    index={i}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-border bg-card/50 py-6 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
