import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Phone, Sparkles } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — Terra" }] }),
  component: Auth,
});

function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="glass rounded-3xl p-8 shadow-lift">
        <div className="text-center mb-6">
          <div className="mx-auto size-14 rounded-2xl bg-primary grid place-items-center text-primary-foreground shadow-glow">
            <Sparkles className="size-6"/>
          </div>
          <h1 className="font-display text-3xl mt-4">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Buy, sell, and get AI-guided land insights.</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <SocialBtn label="Google" />
          <SocialBtn label="Apple" />
          <SocialBtn label="Phone" icon={<Phone className="size-4"/>} />
        </div>
        <Divider>or continue with email</Divider>

        <form className="space-y-3 mt-4" onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && <Field label="Full name" placeholder="Priya Sharma" />}
          <Field label="Email" icon={<Mail className="size-4"/>} placeholder="you@example.com" type="email" />
          <Field label="Password" icon={<Lock className="size-4"/>} placeholder="••••••••" type="password" />
          <button className="w-full h-12 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 shadow-glow">
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="text-center text-sm text-muted-foreground mt-5">
          {mode === "signin" ? "New to Terra?" : "Already have an account?"}{" "}
          <button className="text-primary font-medium" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-2">
          or <button className="underline">continue as guest</button>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <button className="h-11 rounded-full border border-border bg-background hover:bg-secondary transition text-sm inline-flex items-center justify-center gap-2 font-medium">
      {icon} {label}
    </button>
  );
}
function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border"/> {children} <div className="h-px flex-1 bg-border"/>
    </div>
  );
}
function Field({ label, icon, ...props }: { label: string; icon?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-background focus-within:ring-2 focus-within:ring-primary/40">
        {icon}
        <input {...props} className="flex-1 bg-transparent outline-none text-sm"/>
      </div>
    </label>
  );
}
