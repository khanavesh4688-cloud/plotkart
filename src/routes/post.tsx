import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/data";
import { BoundaryDrawer } from "@/components/boundary-drawer";
import { Upload, MapPin, Sparkles, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";


export const Route = createFileRoute("/post")({
  head: () => ({ meta: [{ title: "Post a listing — PlotKart" }] }),
  component: Post,
});

type FormState = {
  title: string;
  category: string;
  area: string;
  price: string;
  state: string;
  district: string;
  city: string;
  village: string;
  mediaCount: number;
  docsUploaded: boolean;
};

function Post() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const steps = ["Basics", "Location", "Media & docs", "Review"];
  const [form, setForm] = useState<FormState>({
    title: "", category: "", area: "", price: "",
    state: "", district: "", city: "", village: "",
    mediaCount: 0, docsUploaded: false,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [published, setPublished] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!form.title.trim() || form.title.trim().length < 8) e.title = "Add a descriptive title (min 8 characters)";
    if (!form.category) e.category = "Choose a category";
    if (!form.area || Number(form.area) <= 0) e.area = "Enter area in acres";
    if (!form.price || Number(form.price) <= 0) e.price = "Enter asking price in ₹ lakhs";
    if (!form.state.trim()) e.state = "Required";
    if (!form.district.trim()) e.district = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.village.trim()) e.village = "Required";
    if (form.mediaCount < 1) e.media = "Upload at least one photo";
    if (!form.docsUploaded) e.docs = "Upload ownership documents";
    return e;
  }, [form]);

  const stepFields: Record<number, (keyof FormState | "media" | "docs")[]> = {
    1: ["title", "category", "area", "price"],
    2: ["state", "district", "city", "village"],
    3: ["media", "docs"],
    4: [],
  };
  const stepValid = (n: number) => stepFields[n].every((f) => !errors[f as string]);
  const overallProgress = useMemo(() => {
    const total = 10;
    const filled = total - Object.keys(errors).length;
    return Math.max(6, Math.round((filled / total) * 100));
  }, [errors]);

  function next() {
    setTouched((t) => {
      const nt = { ...t };
      stepFields[step].forEach((f) => (nt[f as string] = true));
      return nt;
    });
    if (!stepValid(step)) return;
    if (step === 4) {
      setPublished(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
      return;
    }
    setStep(step + 1);
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const showErr = (k: string) => touched[k] && errors[k];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl">Post your land</h1>
          <p className="text-muted-foreground text-sm mt-1">Verified in 24 hours. Free for the first listing.</p>
        </div>
        <Link to="/verify" className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-border hover:bg-secondary text-sm">
          <ShieldCheck className="size-4 text-[#22C55E]" /> Government-verify first
        </Link>
      </div>

      {/* progress bar */}
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Step {step} of {steps.length} · {steps[step-1]}</span>
        <span>{overallProgress}% complete</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-6">
        <div className="h-full bg-primary transition-all duration-500" style={{ width: `${overallProgress}%` }} />
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
            <Field label="Listing title" value={form.title}
              onChange={(v) => set("title", v)} onBlur={() => setTouched((t) => ({...t, title: true}))}
              placeholder="e.g. 5-acre canal-fed farmland near Devanahalli"
              error={showErr("title") ? errors.title : undefined}
              hint={form.title ? `${form.title.length}/80 characters` : "Aim for location + acreage + highlight"} />

            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Category</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((c) => {
                  const active = form.category === c.key;
                  return (
                    <button key={c.key}
                      onClick={() => { set("category", c.key); setTouched((t) => ({...t, category: true})); }}
                      className={`rounded-2xl border px-3 py-3 text-left transition ${active ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border hover:border-primary"}`}>
                      <div className="text-xl">{c.icon}</div>
                      <div className="text-sm font-medium mt-1">{c.label}</div>
                    </button>
                  );
                })}
              </div>
              {showErr("category") && <ErrorLine msg={errors.category} />}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Area" value={form.area} onChange={(v) => set("area", v)}
                onBlur={() => setTouched((t) => ({...t, area: true}))}
                placeholder="5" suffix="acres" type="number"
                error={showErr("area") ? errors.area : undefined} />
              <Field label="Asking price" value={form.price} onChange={(v) => set("price", v)}
                onBlur={() => setTouched((t) => ({...t, price: true}))}
                placeholder="42" suffix="₹ lakhs" type="number"
                error={showErr("price") ? errors.price : undefined} />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="State" value={form.state} onChange={(v) => set("state", v)}
                onBlur={() => setTouched((t) => ({...t, state: true}))}
                placeholder="Karnataka" error={showErr("state") ? errors.state : undefined} />
              <Field label="District" value={form.district} onChange={(v) => set("district", v)}
                onBlur={() => setTouched((t) => ({...t, district: true}))}
                placeholder="Bengaluru Rural" error={showErr("district") ? errors.district : undefined} />
              <Field label="City / Taluk" value={form.city} onChange={(v) => set("city", v)}
                onBlur={() => setTouched((t) => ({...t, city: true}))}
                placeholder="Devanahalli" error={showErr("city") ? errors.city : undefined} />
              <Field label="Village" value={form.village} onChange={(v) => set("village", v)}
                onBlur={() => setTouched((t) => ({...t, village: true}))}
                placeholder="Bettakote" error={showErr("village") ? errors.village : undefined} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="size-4 text-primary" />
                <div className="font-medium text-sm">Mark your plot boundary</div>
              </div>
              <BoundaryDrawer
                path={boundary}
                onChange={setBoundary}
                onAreaChange={(a) => { if (a > 0) set("area", a.toFixed(2)); }}
              />
              {boundary.length >= 3 ? (
                <div className="text-[11px] text-verified mt-2 ml-1 inline-flex items-center gap-1">
                  <Check className="size-3" /> Boundary marked with {boundary.length} points — area auto-filled
                </div>
              ) : (
                <div className="text-[11px] text-muted-foreground mt-2 ml-1">Optional, but listings with a drawn boundary get 3× more enquiries.</div>
              )}
            </div>

          </>
        )}

        {step === 3 && (
          <>
            <button onClick={() => set("mediaCount", Math.min(form.mediaCount + 3, 40))}
              className="w-full rounded-2xl border border-dashed border-border p-8 text-center hover:border-primary transition">
              <Upload className="size-6 mx-auto text-primary"/>
              <div className="mt-2 font-medium">Upload photos, drone video, and 360° tour</div>
              <div className="text-xs text-muted-foreground mt-1">JPG, PNG, MP4 · Up to 40 files</div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm">Choose files</div>
              {form.mediaCount > 0 && (
                <div className="mt-3 text-xs text-verified inline-flex items-center gap-1"><Check className="size-3"/> {form.mediaCount} files added</div>
              )}
            </button>
            {showErr("media") && <ErrorLine msg={errors.media} />}

            <button onClick={() => set("docsUploaded", true)}
              className="w-full rounded-2xl border border-dashed border-border p-6 text-center hover:border-primary transition">
              <div className="font-medium">Upload ownership documents</div>
              <div className="text-xs text-muted-foreground mt-1">7/12 extract, sale deed, mutation copy — encrypted at rest.</div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2 text-sm hover:bg-secondary">Upload documents</div>
              {form.docsUploaded && <div className="mt-3 text-xs text-verified inline-flex items-center gap-1"><Check className="size-3"/> Documents added</div>}
            </button>
            {showErr("docs") && <ErrorLine msg={errors.docs} />}
          </>
        )}

        {step === 4 && !published && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto size-14 rounded-2xl bg-verified/15 text-verified grid place-items-center"><Check className="size-6"/></div>
              <h3 className="font-display text-2xl mt-3">Review & publish</h3>
              <p className="text-sm text-muted-foreground mt-1">Everything looks good — verify details below.</p>
            </div>
            <dl className="rounded-2xl bg-secondary/40 p-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Review k="Title" v={form.title} />
              <Review k="Category" v={form.category} />
              <Review k="Area" v={`${form.area} acres`} />
              <Review k="Price" v={`₹${form.price} L`} />
              <Review k="Location" v={`${form.village}, ${form.city}, ${form.state}`} span />
              <Review k="Media" v={`${form.mediaCount} files`} />
              <Review k="Docs" v={form.docsUploaded ? "Uploaded" : "Missing"} />
            </dl>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm">
              <Sparkles className="size-4"/> AI will auto-generate a polished description in 6 languages
            </div>
          </div>
        )}

        {published && (
          <div className="text-center py-8">
            <div className="mx-auto size-16 rounded-2xl bg-verified/15 text-verified grid place-items-center"><Check className="size-8"/></div>
            <h3 className="font-display text-2xl mt-3">Listing submitted!</h3>
            <p className="text-sm text-muted-foreground mt-1">Redirecting to your dashboard…</p>
          </div>
        )}

        {!published && (
          <div className="flex justify-between pt-2">
            <button disabled={step===1} onClick={() => setStep(step-1)}
              className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-40 hover:bg-secondary">
              Back
            </button>
            <button onClick={next}
              disabled={!stepValid(step)}
              className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:opacity-90 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
              {step === 4 ? "Publish listing" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label, suffix, value, onChange, onBlur, placeholder, type = "text", error, hint,
}: {
  label: string; suffix?: string; value: string; onChange: (v: string) => void;
  onBlur?: () => void; placeholder?: string; type?: string; error?: string; hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className={`mt-1 flex items-center gap-2 h-11 px-4 rounded-full border bg-background focus-within:ring-2 focus-within:ring-primary/40 transition ${error ? "border-red-400" : "border-border"}`}>
        <input value={value} onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
          placeholder={placeholder} type={type}
          className="flex-1 bg-transparent outline-none text-sm"/>
        {suffix && <span className="text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {error ? <ErrorLine msg={error} />
        : hint ? <div className="text-[11px] text-muted-foreground mt-1 ml-2">{hint}</div> : null}
    </label>
  );
}

function ErrorLine({ msg }: { msg: string }) {
  return (
    <div className="text-[11px] text-red-500 mt-1 ml-2 inline-flex items-center gap-1">
      <AlertCircle className="size-3" /> {msg}
    </div>
  );
}

function Review({ k, v, span }: { k: string; v: string; span?: boolean }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
      <dd className="text-sm font-medium mt-0.5">{v || "—"}</dd>
    </div>
  );
}
