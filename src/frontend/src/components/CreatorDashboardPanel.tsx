import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ArrowUp,
  Bookmark,
  Eye,
  MessageSquare,
  RefreshCw,
  Share2,
  Star,
  Trophy,
  Users,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────────────── */
interface CreatorDashboardPanelProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

/* ── Static mock data ──────────────────────────────────────── */
const STATS = {
  impactScore: 847,
  impactDelta: "+124 this week",
  views: 2847,
  saves: 421,
  collabs: 17,
  rating: 4.8,
  viewsChange: "↑ 12% from last week",
};

const TOP_TILES = [
  {
    rank: 1,
    title: "Abstract series preview",
    views: 1245,
    saves: 287,
    engagement: "23%",
  },
  {
    rank: 2,
    title: "Silver ring collection",
    views: 1043,
    saves: 187,
    engagement: "17.9%",
  },
  {
    rank: 3,
    title: "Local art market event",
    views: 934,
    saves: 201,
    engagement: "21.5%",
  },
];

const ACTIVITY = [
  {
    initials: "AM",
    name: "Alex Martinez",
    action: "saved",
    item: "Handmade ceramic bowls",
    time: "2h ago",
    color: "from-violet-500 to-purple-600",
  },
  {
    initials: "JK",
    name: "Jordan Kim",
    action: "sent a collab request for",
    item: "Walnut coffee table",
    time: "5h ago",
    color: "from-purple-500 to-indigo-600",
  },
  {
    initials: "SL",
    name: "Sam Lopez",
    action: "shared",
    item: "Studio session",
    time: "1d ago",
    color: "from-indigo-500 to-violet-600",
  },
  {
    initials: "TC",
    name: "Taylor Chen",
    action: "saved",
    item: "Abstract series preview",
    time: "1d ago",
    color: "from-violet-600 to-purple-700",
  },
  {
    initials: "MB",
    name: "Morgan Brown",
    action: "sent a message about",
    item: "Custom pottery",
    time: "2d ago",
    color: "from-purple-600 to-violet-700",
  },
];

/* ── Sub-components ────────────────────────────────────────── */
function StatRow({
  icon: Icon,
  label,
  value,
  iconColor = "text-primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground tabular-nums">
        {value}
      </span>
    </div>
  );
}

/* ── Main panel ────────────────────────────────────────────── */
export function CreatorDashboardPanel({
  username,
  isOpen,
  onClose,
}: CreatorDashboardPanelProps) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-[400px] p-0 flex flex-col"
      >
        {/* Visually hidden accessible title/description */}
        <SheetHeader className="sr-only">
          <SheetTitle>Creator Dashboard</SheetTitle>
          <SheetDescription>
            Your creator impact summary and analytics
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-5 pb-8 space-y-4">
            {/* ── Header ──────────────────────────────────────── */}
            <div className="pt-2">
              <h2 className="font-display font-bold text-xl text-foreground leading-tight">
                Creator Dashboard
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back,{" "}
                <span className="font-medium text-primary">{username}</span>!
                Here's your creator impact summary.
              </p>
            </div>

            {/* ── Visibility Rotation Banner ──────────────────── */}
            <div className="rounded-xl bg-primary/8 border border-primary/20 p-3.5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <RefreshCw className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground leading-snug">
                    Visibility Rotation Active
                  </p>
                  <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-primary bg-primary/12 border border-primary/25 rounded-full px-2 py-0.5 whitespace-nowrap">
                    Fair Discovery
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Your tiles are being fairly distributed in local discovery
                  feeds
                </p>
              </div>
            </div>

            {/* ── Local Impact Score ──────────────────────────── */}
            <div className="rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 p-4 text-white shadow-lg shadow-violet-500/25">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-400/25 text-emerald-200 border border-emerald-400/30 rounded-full px-2.5 py-1">
                  <ArrowUp className="w-3 h-3" />
                  {STATS.impactDelta}
                </span>
              </div>
              <p className="text-xs text-white/70 font-medium uppercase tracking-wide mb-0.5">
                Local Impact Score
              </p>
              <p className="text-5xl font-bold tracking-tight leading-none mb-1">
                {STATS.impactScore}
              </p>
              <p className="text-xs text-white/60 mb-4">
                Composite metric: Views + Saves + Collabs + Reviews
              </p>

              {/* 4-stat row */}
              <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/20">
                {[
                  { label: "Views", value: STATS.views.toLocaleString() },
                  { label: "Saves", value: STATS.saves },
                  { label: "Collabs", value: STATS.collabs },
                  { label: "Rating", value: STATS.rating },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-base font-bold leading-tight">
                      {s.value}
                    </p>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Weekly Profile Views ────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Weekly Profile Views
                </p>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {STATS.views.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                {STATS.viewsChange}
              </p>
            </div>

            {/* ── Local Saves ─────────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Local Saves
                </p>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {STATS.saves}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                ↑ 8% from last week
              </p>
            </div>

            {/* ── Collab Requests ─────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-500" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Collab Requests
                </p>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                {STATS.collabs}
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                ↑ 23% from last week
              </p>
            </div>

            {/* ── Local Followers ─────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Local Followers
                </p>
              </div>
              <p className="text-4xl font-bold text-foreground tabular-nums">
                234
              </p>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                ↑ 15% this month
              </p>
            </div>

            {/* ── Impact Breakdown ────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-sm font-bold text-foreground mb-1">
                Impact Breakdown{" "}
                <span className="font-normal text-muted-foreground">
                  (This Week)
                </span>
              </p>
              <div className="mt-2">
                <StatRow
                  icon={Eye}
                  label="Profile Views"
                  value={STATS.views.toLocaleString()}
                />
                <StatRow icon={Bookmark} label="Saves" value={STATS.saves} />
                <StatRow
                  icon={Users}
                  label="Collab Requests"
                  value={STATS.collabs}
                />
                <StatRow
                  icon={Star}
                  label="Avg. Rating"
                  value={`${STATS.rating}/5.0`}
                  iconColor="text-amber-500"
                />
              </div>
            </div>

            {/* ── Top Performing Tiles ────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3">
                <p className="text-sm font-bold text-foreground">
                  Top Performing Tiles
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your most engaging content this week
                </p>
              </div>
              <div className="space-y-3">
                {TOP_TILES.map((tile) => (
                  <div
                    key={tile.rank}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      #{tile.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {tile.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {tile.views.toLocaleString()} views
                        </span>
                        <span className="text-muted-foreground/50 text-xs">
                          ·
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Bookmark className="w-3 h-3" />
                          {tile.saves} saves
                        </span>
                        <span className="text-muted-foreground/50 text-xs">
                          ·
                        </span>
                        <span className="flex items-center gap-1 text-xs text-primary font-medium">
                          <Share2 className="w-3 h-3" />
                          {tile.engagement} eng.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent Activity ─────────────────────────────── */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3">
                <p className="text-sm font-bold text-foreground">
                  Recent Activity
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Latest interactions from your community
                </p>
              </div>
              <div className="space-y-3">
                {ACTIVITY.map((item) => (
                  <div key={item.initials} className="flex items-start gap-3">
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                    >
                      <span className="text-[10px] font-bold text-white">
                        {item.initials}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">
                        <span className="font-semibold">{item.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>{" "}
                        <span className="font-medium text-primary">
                          "{item.item}"
                        </span>
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MessageSquare className="w-3 h-3 text-muted-foreground/60" />
                        <span className="text-xs text-muted-foreground">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
