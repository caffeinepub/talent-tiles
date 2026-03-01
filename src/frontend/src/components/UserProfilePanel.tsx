import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Bookmark,
  CheckCircle,
  Eye,
  LogOut,
  MapPin,
  Phone,
  Plus,
  Share2,
  Star,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useState } from "react";
import { Type__1 } from "../backend";
import { Type } from "../backend";
import type { ExtendedCreatorProfile, StatusTag } from "../data/sampleCreators";
import { sampleCreators } from "../data/sampleCreators";

/* ── Helpers ───────────────────────────────────────────────── */
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
      return "Creator";
  }
}

interface TagConfig {
  bg: string;
  text: string;
  icon?: React.ReactNode;
}

function getTagConfig(tag: StatusTag): TagConfig {
  switch (tag) {
    case "Process":
      return { bg: "bg-blue-600", text: "text-white" };
    case "Trusted":
      return {
        bg: "bg-blue-600",
        text: "text-white",
        icon: <CheckCircle className="w-3 h-3 flex-shrink-0" />,
      };
    case "Upcoming Drop":
      return { bg: "bg-orange-500", text: "text-white" };
    case "Popular":
      return {
        bg: "bg-orange-500",
        text: "text-white",
        icon: <Star className="w-3 h-3 flex-shrink-0 fill-white" />,
      };
    case "Final Product":
      return { bg: "bg-green-500", text: "text-white" };
    case "Work in Progress":
      return {
        bg: "bg-violet-600",
        text: "text-white",
        icon: <Zap className="w-3 h-3 flex-shrink-0 fill-white" />,
      };
    case "Event":
      return { bg: "bg-rose-600", text: "text-white" };
    default:
      return { bg: "bg-white/90", text: "text-gray-800" };
  }
}

/* ── Mini Creator Card ─────────────────────────────────────── */
function MiniCreatorCard({
  creator,
  onView,
}: {
  creator: ExtendedCreatorProfile;
  onView?: (id: bigint) => void;
}) {
  const categoryLabel = getCategoryLabel(creator.category);

  return (
    <button
      type="button"
      aria-label={`View ${creator.name}'s profile`}
      className="group w-full text-left bg-card rounded-xl overflow-hidden shadow-sm border border-border cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
      onClick={() => onView?.(creator.id)}
    >
      {/* Cover image */}
      <div className="relative h-36 overflow-hidden bg-muted">
        <img
          src={creator.photoUrl}
          alt={`${creator.name}'s work`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* Status tags */}
        {creator.statusTags && creator.statusTags.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-10">
            {creator.statusTags.slice(0, 2).map((tag) => {
              const config = getTagConfig(tag);
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${config.bg} ${config.text} text-[10px] font-semibold shadow-sm leading-4 tracking-wide whitespace-nowrap`}
                >
                  {config.icon}
                  {tag}
                </span>
              );
            })}
          </div>
        )}

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5 flex flex-col gap-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-white/60 text-white text-[10px] font-semibold bg-white/10 backdrop-blur-sm uppercase tracking-wide w-fit">
            {categoryLabel}
          </span>
          <h3 className="font-display font-bold text-white text-sm leading-snug line-clamp-2 drop-shadow">
            {creator.title ?? creator.name}
          </h3>

          {/* Distance + action row */}
          <div className="flex items-center justify-between gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-gray-900 text-[10px] font-semibold shadow flex-shrink-0">
              <MapPin className="w-2.5 h-2.5 text-gray-500" />
              {creator.kmDistance}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Contact"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-gray-900 text-[10px] font-semibold shadow hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Phone className="w-2.5 h-2.5" />
                Contact
              </button>
              <button
                type="button"
                aria-label="Share"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-gray-900 text-[10px] font-semibold shadow hover:bg-gray-50 active:scale-95 transition-all"
              >
                <Share2 className="w-2.5 h-2.5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div className="px-3 pt-3 pb-2.5 bg-card">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-8 h-8 rounded-full ring-2 ring-primary/20 shadow-sm flex-shrink-0">
            <AvatarImage
              src={creator.avatarUrl || undefined}
              alt={creator.name}
              className="object-cover rounded-full"
            />
            <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-xs">
              {getInitials(creator.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-display font-bold text-foreground text-[13px] leading-tight truncate">
              {creator.name}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-muted-foreground truncate mt-0.5">
              <MapPin className="w-2.5 h-2.5 flex-shrink-0 text-primary/60" />
              <span className="truncate">{creator.neighborhood}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-2.5 h-2.5" />
              <span className="font-semibold text-foreground">
                {formatCount(creator.views)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-2.5 h-2.5" />
              <span className="font-semibold text-foreground">
                {formatCount(creator.bookmarks)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── New Post Form State ─────────────────────────────────────── */
interface NewPostForm {
  title: string;
  description: string;
  category: string;
  statusTag: string;
  distance: string;
}

const CATEGORY_OPTIONS = [
  { value: "art", label: "🎨 Art" },
  { value: "food", label: "🍕 Food" },
  { value: "fashion", label: "👗 Fashion" },
  { value: "crafts", label: "✂️ Crafts" },
  { value: "music", label: "🎵 Music" },
  { value: "wellness", label: "🕯️ Wellness" },
];

const STATUS_TAG_OPTIONS: StatusTag[] = [
  "Work in Progress",
  "Upcoming Drop",
  "Process",
  "Final Product",
  "Trusted",
  "Popular",
  "Event",
];

function categoryStringToType(cat: string): Type__1 {
  switch (cat) {
    case "art":
      return Type__1.art;
    case "food":
      return Type__1.food;
    case "fashion":
      return Type__1.fashion;
    case "crafts":
      return Type__1.crafts;
    case "music":
      return Type__1.music;
    case "wellness":
      return Type__1.wellness;
    default:
      return Type__1.art;
  }
}

/* ── New Post Modal ─────────────────────────────────────────── */
function NewPostModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: NewPostForm) => void;
}) {
  const [form, setForm] = useState<NewPostForm>({
    title: "",
    description: "",
    category: "",
    statusTag: "",
    distance: "",
  });
  const [errors, setErrors] = useState<Partial<NewPostForm>>({});

  function validate(): boolean {
    const newErrors: Partial<NewPostForm> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.statusTag) newErrors.statusTag = "Status tag is required";
    if (!form.distance.trim()) newErrors.distance = "Distance is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
      setForm({
        title: "",
        description: "",
        category: "",
        statusTag: "",
        distance: "",
      });
      setErrors({});
    }
  }

  function handleClose() {
    setForm({
      title: "",
      description: "",
      category: "",
      statusTag: "",
      distance: "",
    });
    setErrors({});
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl border border-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-white font-display font-bold text-xl">
              Add New Tile
            </DialogTitle>
            <p className="text-white/75 text-sm mt-1">
              Share your creative work with the local community
            </p>
          </DialogHeader>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-5 space-y-4 bg-background"
        >
          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="post-title"
              className="text-sm font-semibold text-foreground"
            >
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="post-title"
              placeholder="e.g. Studio session – abstract series"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className={`rounded-xl ${errors.title ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="post-description"
              className="text-sm font-semibold text-foreground"
            >
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="post-description"
              placeholder="Tell the community about your work, inspiration, or what you're offering..."
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className={`rounded-xl resize-none min-h-[90px] ${errors.description ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/* Category + Status Tag row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, category: val }))
                }
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.category ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category}</p>
              )}
            </div>

            {/* Status tag */}
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-foreground">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.statusTag}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, statusTag: val }))
                }
              >
                <SelectTrigger
                  className={`rounded-xl ${errors.statusTag ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_TAG_OPTIONS.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.statusTag && (
                <p className="text-xs text-destructive">{errors.statusTag}</p>
              )}
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-1.5">
            <Label
              htmlFor="post-distance"
              className="text-sm font-semibold text-foreground"
            >
              Distance <span className="text-destructive">*</span>
            </Label>
            <Input
              id="post-distance"
              placeholder="e.g. 2.1 km away"
              value={form.distance}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, distance: e.target.value }))
              }
              className={`rounded-xl ${errors.distance ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errors.distance && (
              <p className="text-xs text-destructive">{errors.distance}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-xl border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-semibold shadow-md"
            >
              Post Tile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ── Props ─────────────────────────────────────────────────── */
interface UserProfilePanelProps {
  username: string | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onViewCreator?: (id: bigint) => void;
}

/* ── Stat pill ─────────────────────────────────────────────── */
function StatItem({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-lg font-bold text-white leading-tight">
        {value}
      </span>
      <span className="text-[11px] text-white/70 font-medium mt-0.5">
        {label}
      </span>
    </div>
  );
}

/* ── Main component ────────────────────────────────────────── */
export function UserProfilePanel({
  username,
  isOpen,
  onClose,
  onLogout,
  onViewCreator,
}: UserProfilePanelProps) {
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [userTiles, setUserTiles] = useState<ExtendedCreatorProfile[]>(
    sampleCreators.slice(0, 4),
  );
  const [postCount, setPostCount] = useState(4);

  // Use first creator's avatar as placeholder
  const placeholderAvatar = sampleCreators[0].avatarUrl;

  // Saved: last 3 creators
  const savedTiles = sampleCreators.slice(-3);

  // Category derived from first tile
  const categoryLabel = getCategoryLabel(sampleCreators[0].category);

  function handleNewPost(form: NewPostForm) {
    const newId = BigInt(Date.now());
    const categoryType = categoryStringToType(form.category);
    const newTile: ExtendedCreatorProfile = {
      id: newId,
      name: username ?? "Local Creator",
      category: categoryType,
      distanceLabel: Type.hyperlocal,
      bio: form.description,
      avatarUrl: sampleCreators[0].avatarUrl,
      neighborhood: "Your Neighborhood",
      kmDistance: form.distance,
      views: 0,
      bookmarks: 0,
      photoUrl:
        sampleCreators[Math.floor(Math.random() * sampleCreators.length)]
          .photoUrl,
      title: form.title,
      tags: [`#${form.category}`, "#local", "#handmade"],
      statusTags: [form.statusTag as StatusTag],
    };

    setUserTiles((prev) => [newTile, ...prev]);
    setPostCount((prev) => prev + 1);
    setIsNewPostOpen(false);
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[400px] p-0 flex flex-col [&>button]:hidden"
        >
          {/* Visually hidden accessible title/description */}
          <SheetHeader className="sr-only">
            <SheetTitle>User Profile</SheetTitle>
            <SheetDescription>
              Your profile, tiles, and saved creators
            </SheetDescription>
          </SheetHeader>

          {/* Wrapper with relative positioning for FAB */}
          <div className="relative flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 overflow-y-auto">
              {/* ── Purple gradient header ──────────────────────── */}
              <div className="relative bg-gradient-to-b from-violet-600 to-purple-700 px-5 pt-5 pb-6 text-white">
                {/* Top action row */}
                <div className="flex items-center justify-between mb-5">
                  {/* Close button */}
                  <button
                    type="button"
                    aria-label="Close profile"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-all"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>

                  {/* Edit Profile */}
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-full border border-white/60 text-white text-xs font-semibold hover:bg-white/10 active:scale-95 transition-all"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Avatar */}
                <div className="flex flex-col items-center text-center gap-2">
                  <Avatar className="w-20 h-20 rounded-full ring-4 ring-white/40 shadow-lg">
                    <AvatarImage
                      src={placeholderAvatar || undefined}
                      alt={username ?? "User"}
                      className="object-cover rounded-full"
                    />
                    <AvatarFallback className="rounded-full bg-violet-400 text-white font-bold text-2xl">
                      {username ? getInitials(username) : "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name */}
                  <h2 className="font-display font-bold text-xl text-white leading-tight mt-1">
                    {username ?? "Local Creator"}
                  </h2>

                  {/* Location */}
                  <p className="flex items-center gap-1.5 text-sm text-white/80">
                    <MapPin className="w-3.5 h-3.5 text-white/70 flex-shrink-0" />
                    Downtown Arts District
                  </p>

                  {/* Category badge */}
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold tracking-wide">
                    {categoryLabel} Creator
                  </span>

                  {/* Bio */}
                  <p className="text-sm text-white/75 leading-relaxed max-w-[280px] mt-0.5">
                    Local creator passionate about bringing handmade, authentic
                    work to the community. Connecting art and people one tile at
                    a time.
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center gap-0 mt-4 w-full bg-white/10 rounded-2xl px-4 py-3 border border-white/20">
                    <div className="flex-1">
                      <StatItem value={postCount} label="Posts" />
                    </div>
                    <div className="w-px h-8 bg-white/25 flex-shrink-0" />
                    <div className="flex-1">
                      <StatItem value="2.8k" label="Total Views" />
                    </div>
                    <div className="w-px h-8 bg-white/25 flex-shrink-0" />
                    <div className="flex-1">
                      <StatItem value="421" label="Total Saves" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Tabs section ────────────────────────────────── */}
              <div className="bg-background px-4 pt-4 pb-24">
                <Tabs defaultValue="tiles">
                  <TabsList className="w-full bg-secondary/60 rounded-full p-1 h-10 mb-4">
                    <TabsTrigger
                      value="tiles"
                      className="flex-1 rounded-full text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
                    >
                      My Tiles ({userTiles.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="saved"
                      className="flex-1 rounded-full text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
                    >
                      Saved ({savedTiles.length})
                    </TabsTrigger>
                  </TabsList>

                  {/* My Tiles */}
                  <TabsContent value="tiles" className="mt-0">
                    <div className="grid grid-cols-1 gap-3">
                      <AnimatePresence initial={false}>
                        {userTiles.map((creator) => (
                          <motion.div
                            key={creator.id.toString()}
                            initial={{ opacity: 0, y: -16, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                          >
                            <MiniCreatorCard
                              creator={creator}
                              onView={onViewCreator}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  {/* Saved */}
                  <TabsContent value="saved" className="mt-0">
                    <div className="grid grid-cols-1 gap-3">
                      {savedTiles.map((creator) => (
                        <MiniCreatorCard
                          key={creator.id.toString()}
                          creator={creator}
                          onView={onViewCreator}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Sign Out button */}
                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive/8 active:scale-[0.98] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </ScrollArea>

            {/* ── Floating Action Button (FAB) ─────────────────── */}
            <motion.button
              type="button"
              aria-label="Add new post"
              onClick={() => setIsNewPostOpen(true)}
              className="absolute bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gray-900 text-white shadow-xl flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              whileHover={{
                scale: 1.1,
                boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
              }}
              whileTap={{ scale: 0.93 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
                delay: 0.15,
              }}
            >
              <Plus className="w-6 h-6" strokeWidth={2.5} />
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>

      {/* New Post Modal — rendered outside Sheet to avoid z-index issues */}
      <NewPostModal
        isOpen={isNewPostOpen}
        onClose={() => setIsNewPostOpen(false)}
        onSubmit={handleNewPost}
      />
    </>
  );
}
