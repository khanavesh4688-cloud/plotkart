import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/data";
import { Upload, MapPin, Sparkles, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/post")({
  head: () => ({ meta: [{ title: "Post a listing — Terra" }] }),
  component: Post,
});

function Post() {
  const [step, setStep] = useState(1);
  const steps = ["Basics", "Location", "Media & docs", "Review"];
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl">Post your land</h1>
        <p className="text-muted-foreground text-sm mt-1">Verified in 24 hours. Free for the first listing.</p>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`size-8 rounded-full grid place-items-center text-xs font-semibold ${i+1 <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              {i+1 < step ? <Check className="size-4"/> : i+1}
            </div>
            <div className="text-xs font-medium hidden sm:block">{s}</div>
            {i < steps.length-1 && <div className={`flex-1 h-px ${i+1 < step ? "bg-primary" : "bg-border"}`}/>}
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 shadow-soft space-y-5">
        {step === 1 && (
          <>
            <Field label="Listing title" placeholder="e.g. 5-acre canal-fed farmland near Devanahalli"/>
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Category</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.key} className="rounded-2xl border border-border px-3 py-3 text-left hover:border-primary transition">
                    <div className="text-xl">{c.icon}</div>
                    <div className="text-sm font-medium mt-1">{c.label}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Area" placeholder="5" suffix="acres"/>
              <Field label="Asking price" placeholder="42" suffix="₹ lakhs"/>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="State" placeholder="Karnataka"/>
              <Field label="District" placeholder="Bengaluru Rural"/>
              <Field label="City / Taluk" placeholder="Devanahalli"/>
              <Field label="Village" placeholder="Bettakote"/>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-6 text-center">
              <MapPin className="size-6 mx-auto text-primary"/>
              <div className="mt-2 font-medium">Pin your plot on the map</div>
              <div className="text-xs text-muted-foreground mt-1">Draw boundaries or drop a pin — buyers love accurate location.</div>
              <button className="mt-3 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Open map</button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <Upload className="size-6 mx-auto text-primary"/>
              <div className="mt-2 font-medium">Upload photos, drone video, and 360° tour</div>
              <div className="text-xs text-muted-foreground mt-1">JPG, PNG, MP4 · Up to 40 files</div>
              <button className="mt-3 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm">Choose files</button>
            </div>
            <div className="rounded-2xl border border-dashed border-border p-6 text-center">
              <div className="font-medium">Upload ownership documents</div>
              <div className="text-xs text-muted-foreground mt-1">7/12 extract, sale deed, mutation copy — encrypted at rest.</div>
              <button className="mt-3 rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary">Upload documents</button>
            </div>
          </>
        )}
        {step === 4 && (
          <div className="text-center py-6">
            <div className="mx-auto size-14 rounded-2xl bg-verified/15 text-verified grid place-items-center"><Check className="size-6"/></div>
            <h3 className="font-display text-2xl mt-3">Ready to publish</h3>
            <p className="text-sm text-muted-foreground mt-2">Our team will verify your listing within 24 hours and notify buyers matching your criteria.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm">
              <Sparkles className="size-4"/> AI will auto-generate a polished description in 6 languages
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <button disabled={step===1} onClick={() => setStep(step-1)} className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-40 hover:bg-secondary">Back</button>
          <button onClick={() => setStep(Math.min(4, step+1))} className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90 shadow-glow">
            {step === 4 ? "Publish listing" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, suffix, ...props }: { label: string; suffix?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 h-11 px-4 rounded-full border border-border bg-background focus-within:ring-2 focus-within:ring-primary/40">
        <input {...props} className="flex-1 bg-transparent outline-none text-sm"/>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}
