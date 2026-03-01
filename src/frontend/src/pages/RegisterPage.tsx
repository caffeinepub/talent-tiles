import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type RegisterPageProps = {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
};

export default function RegisterPage({
  onRegisterSuccess,
  onNavigateToLogin,
}: RegisterPageProps) {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  function clearError() {
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register(username, password);
      if (result.success) {
        setShowSuccess(true);
        // Brief success feedback then redirect to login
        setTimeout(() => {
          onRegisterSuccess();
        }, 1500);
      } else {
        setError(result.error ?? "Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* ── Left panel — branding ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/assets/generated/login-hero-bg.dim_1200x900.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/50 to-primary/20" />

        {/* Decorative tiles */}
        <div className="absolute top-12 right-12 w-32 h-32 rounded-2xl bg-primary/30 backdrop-blur-sm border border-white/20 rotate-12" />
        <div className="absolute top-32 right-32 w-16 h-16 rounded-xl bg-accent/40 backdrop-blur-sm border border-white/20 -rotate-6" />
        <div className="absolute bottom-24 left-16 w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 rotate-3" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Talent Tiles
            </span>
          </div>

          {/* Tagline block */}
          <div>
            <motion.h1
              className="font-display font-bold text-5xl xl:text-6xl leading-tight mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Join the local
              <br />
              <span className="text-white/85">creator movement.</span>
            </motion.h1>
            <motion.p
              className="text-white/70 text-lg leading-relaxed max-w-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            >
              Connect with artists, makers, chefs, and healers right in your
              neighborhood. Your next obsession lives around the corner.
            </motion.p>

            {/* Feature list */}
            <motion.div
              className="mt-10 space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {[
                "Discover creators within walking distance",
                "Filter by category and distance",
                "Save your favourite local talents",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{feat}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Right panel — register form ───────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 py-12 bg-background texture-bg">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground">
            Talent Tiles
          </span>
        </div>

        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-8">
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              Create an account
            </h2>
            <p className="text-muted-foreground">
              Start discovering local creators today.
            </p>
          </div>

          {/* Registration form */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-tile">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center py-6 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    Account created!
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Redirecting to sign in…
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Username */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-username"
                      className="text-sm font-medium text-foreground"
                    >
                      Username
                    </Label>
                    <Input
                      id="reg-username"
                      type="text"
                      autoComplete="username"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        clearError();
                      }}
                      className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30 focus-visible:border-primary/60"
                      disabled={isSubmitting}
                      aria-describedby={error ? "reg-error" : undefined}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Password
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearError();
                      }}
                      className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30 focus-visible:border-primary/60"
                      disabled={isSubmitting}
                      aria-describedby={error ? "reg-error" : undefined}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="reg-confirm-password"
                      className="text-sm font-medium text-foreground"
                    >
                      Confirm Password
                    </Label>
                    <Input
                      id="reg-confirm-password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        clearError();
                      }}
                      className="h-11 rounded-xl border-border bg-background focus-visible:ring-primary/30 focus-visible:border-primary/60"
                      disabled={isSubmitting}
                      aria-describedby={error ? "reg-error" : undefined}
                    />
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.div
                      id="reg-error"
                      role="alert"
                      className="flex items-start gap-2 text-destructive text-sm bg-destructive/8 border border-destructive/20 rounded-lg px-3 py-2.5"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 font-semibold text-base rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-tile hover:shadow-tile-hover"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account…
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Sign in link */}
            {!showSuccess && (
              <div className="mt-6 pt-5 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="font-semibold text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Category preview pills */}
          <motion.div
            className="mt-8 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {["Art", "Music", "Food", "Fashion", "Crafts", "Wellness"].map(
              (cat, i) => (
                <motion.span
                  key={cat}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
                >
                  {cat}
                </motion.span>
              ),
            )}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <p className="mt-auto pt-12 text-xs text-muted-foreground text-center">
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
    </div>
  );
}
