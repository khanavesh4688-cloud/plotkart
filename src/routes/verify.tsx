import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ShieldCheck, Upload, Camera, Image as ImageIcon, FileText, ExternalLink,
  CheckCircle2, Loader2, ChevronDown, X, Sparkles, Lock, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Government Property Verification — PlotKart" },
      { name: "description", content: "Verify your land by uploading an official government land record. PlotKart uses OCR + AI matching to certify ownership, survey number, village, and area." },
    ],
  }),
  component: VerifyPage,
});

const STATES: { name: string; portal: string; label: string }[] = [
  { name: "Uttar Pradesh", portal: "https://upbhulekh.gov.in/", label: "Bhulekh UP" },
  { name: "Bihar", portal: "https://lrc.bih.nic.in/", label: "Bihar Bhumi" },
  { name: "Rajasthan", portal: "https://apnakhata.rajasthan.gov.in/", label: "Apna Khata" },
  { name: "Maharashtra", portal: "https://bhulekh.mahabhumi.gov.in/", label: "MahaBhulekh" },
  { name: "Gujarat", portal: "https://anyror.gujarat.gov.in/", label: "AnyRoR Gujarat" },
  { name: "Karnataka", portal: "https://landrecords.karnataka.gov.in/", label: "Bhoomi Karnataka" },
  { name: "Madhya Pradesh", portal: "https://mpbhulekh.gov.in/", label: "MP Bhulekh" },
  { name: "Telangana", portal: "https://dharani.telangana.gov.in/", label: "Dharani" },
  { name: "Andhra Pradesh", portal: "https://meebhoomi.ap.gov.in/", label: "MeeBhoomi" },
  { name: "Haryana", portal: "https://jamabandi.nic.in/", label: "Jamabandi Haryana" },
  { name: "Punjab", portal: "https://jamabandi.punjab.gov.in/", label: "PLRS Punjab" },
  { name: "Odisha", portal: "https://bhulekh.ori.nic.in/", label: "Bhulekh Odisha" },
  { name: "Tamil Nadu", portal: "https://eservices.tn.gov.in/eservicesnew/index.html", label: "TN e-Services" },
  { name: "Kerala", portal: "https://erekha.kerala.gov.in/", label: "e-Rekha Kerala" },
  { name: "Chhattisgarh", portal: "https://bhuiyan.cg.nic.in/", label: "Bhuiyan CG" },
  { name: "Jharkhand", portal: "https://jharbhoomi.jharkhand.gov.in/", label: "Jharbhoomi" },
  { name: "Uttarakhand", portal: "http://bhulekh.uk.gov.in/", label: "Bhulekh Uttarakhand" },
  { name: "Assam", portal: "https://revenueassam.nic.in/", label: "Dharitree Assam" },
  { name: "West Bengal", portal: "https://banglarbhumi.gov.in/", label: "Banglar Bhumi" },
  { name: "Goa", portal: "https://egov.goa.nic.in/dslr/", label: "DSLR Goa" },
  { name: "Jammu & Kashmir", portal: "https://landrecords.jk.gov.in/", label: "Aapki Zameen" },
];

const OCR_STEPS = [
  "Reading document…",
  "Extracting text…",
  "Matching survey number…",
  "Matching owner name…",
  "Matching village…",
  "Comparing land area…",
];

type Phase = "form" | "processing" | "result";

function VerifyPage() {
  const [state, setState] = useState("");
  const [file, setFile] = useState<{ name: string; size: number; preview?: string } | null>(null);
  const [phase, setPhase] = useState<Phase>("form");
  const [ocrIdx, setOcrIdx] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const portal = useMemo(() => STATES.find((s) => s.name === state), [state]);
  const canProcess = state && file;

  useEffect(() => {
    if (phase !== "processing") return;
    setOcrIdx(0);
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      if (i >= OCR_STEPS.length) {
        clearInterval(t);
        setTimeout(() => setPhase("result"), 500);
      } else {
        setOcrIdx(i);
      }
    }, 750);
    return () => clearInterval(t);
  }, [phase]);

  function handleFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    const preview = f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined;
    setFile({ name: f.name, size: f.size, preview });
  }

  function reset() {
    setFile(null);
    setState("");
    setPhase("form");
    setOcrIdx(0);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto size-16 rounded-2xl bg-[#22C55E]/10 grid place-items-center mb-4">
          <ShieldCheck className="size-8 text-[#22C55E]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl leading-tight">Government Property Verification</h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
          Upload your official government land record to verify your property.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="size-3" /> End-to-end encrypted uploads
        </div>
      </div>

      {phase === "form" && (
        <div className="mt-8 space-y-4">
          {/* Step 1: State */}
          <StepCard n={1} title="Select your State" done={!!state}>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-12 rounded-2xl border border-border bg-background pl-4 pr-10 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#22C55E]/40"
              >
                <option value="">Choose a State…</option>
                {STATES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <ChevronDown className="size-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </StepCard>

          {/* Step 2: Portal */}
          <StepCard n={2} title="Open Official Government Portal" done={!!state} disabled={!state}>
            {portal ? (
              <a
                href={portal.portal}
                target="_blank"
                rel="noreferrer noopener"
                className="w-full inline-flex items-center justify-center gap-2 h-14 rounded-2xl bg-[#22C55E] text-white font-semibold hover:bg-[#16A34A] transition shadow-[0_10px_30px_-10px_rgba(34,197,94,0.55)]"
              >
                <ExternalLink className="size-5" />
                Open {portal.label}
              </a>
            ) : (
              <div className="h-14 rounded-2xl bg-secondary/60 grid place-items-center text-xs text-muted-foreground">
                Select a state to see the portal link
              </div>
            )}
            <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
              Log in to the portal, find your Khasra / Survey record, and take a screenshot or download the PDF.
            </p>
          </StepCard>

          {/* Step 3: Upload */}
          <StepCard n={3} title="Upload Government Record" done={!!file} disabled={!state}>
            {!file ? (
              <>
                <label
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                  className="block cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-[#22C55E] transition p-6 text-center bg-secondary/30"
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <div className="mx-auto size-12 rounded-2xl bg-[#22C55E]/10 text-[#22C55E] grid place-items-center mb-3">
                    <Upload className="size-6" />
                  </div>
                  <div className="font-semibold text-sm">Drop file or tap to browse</div>
                  <div className="text-[11px] text-muted-foreground mt-1">Screenshot · PDF · JPG · PNG · up to 10 MB</div>
                </label>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button
                    onClick={() => cameraRef.current?.click()}
                    className="h-12 rounded-2xl border border-border hover:bg-secondary inline-flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Camera className="size-4" /> Camera
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="h-12 rounded-2xl border border-border hover:bg-secondary inline-flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <ImageIcon className="size-4" /> Gallery
                  </button>
                  <input
                    ref={cameraRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-border p-3 flex items-center gap-3 bg-secondary/40">
                {file.preview ? (
                  <img src={file.preview} alt="" className="size-14 rounded-xl object-cover" />
                ) : (
                  <div className="size-14 rounded-xl bg-[#22C55E]/10 text-[#22C55E] grid place-items-center">
                    <FileText className="size-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-[11px] text-muted-foreground">{(file.size / 1024).toFixed(0)} KB · Ready to verify</div>
                </div>
                <button onClick={() => setFile(null)} className="size-9 rounded-full hover:bg-background grid place-items-center" aria-label="Remove">
                  <X className="size-4" />
                </button>
              </div>
            )}
          </StepCard>

          {/* Submit */}
          <button
            disabled={!canProcess}
            onClick={() => setPhase("processing")}
            className="w-full h-14 rounded-2xl bg-[#22C55E] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#16A34A] transition shadow-[0_10px_30px_-10px_rgba(34,197,94,0.55)] inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="size-5" /> Start Verification
          </button>
          <p className="text-[11px] text-center text-muted-foreground">
            Files are uploaded securely. Manual review available if AI confidence is low.
          </p>
        </div>
      )}

      {phase === "processing" && (
        <div className="mt-10 rounded-3xl border border-border p-6 sm:p-8 bg-card shadow-[0_10px_40px_-20px_rgba(0,0,0,0.15)]">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-2xl bg-[#22C55E]/10 grid place-items-center">
              <Loader2 className="size-5 text-[#22C55E] animate-spin" />
            </div>
            <div>
              <div className="font-semibold">Verifying your document</div>
              <div className="text-xs text-muted-foreground">OCR + AI matching in progress</div>
            </div>
          </div>

          <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-[#22C55E] transition-all duration-500"
              style={{ width: `${((ocrIdx + 1) / OCR_STEPS.length) * 100}%` }}
            />
          </div>

          <ul className="mt-6 space-y-3">
            {OCR_STEPS.map((s, i) => {
              const done = i < ocrIdx;
              const active = i === ocrIdx;
              return (
                <li key={s} className={`flex items-center gap-3 text-sm transition ${done ? "text-foreground" : active ? "text-foreground" : "text-muted-foreground/60"}`}>
                  <span className={`size-6 rounded-full grid place-items-center shrink-0 ${done ? "bg-[#22C55E] text-white" : active ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-secondary"}`}>
                    {done ? <CheckCircle2 className="size-4" /> : active ? <Loader2 className="size-3.5 animate-spin" /> : <span className="text-[10px]">{i + 1}</span>}
                  </span>
                  <span>{s}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {phase === "result" && (
        <div className="mt-8 space-y-4">
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-white shadow-[0_20px_50px_-20px_rgba(34,197,94,0.6)]">
            <div className="flex items-center gap-3">
              <div className="size-14 rounded-2xl bg-white/20 grid place-items-center">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest opacity-80">Verification score</div>
                <div className="font-display text-4xl leading-none mt-1">98% Verified</div>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              <ShieldCheck className="size-4" /> Verified Property
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-5 sm:p-6 space-y-3 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)]">
            {[
              "Owner Name Matched",
              "Survey / Khasra Number Matched",
              "Village Matched",
              "District Matched",
              "Land Area Matched",
            ].map((label) => (
              <div key={label} className="flex items-center gap-3">
                <span className="size-7 rounded-full bg-[#22C55E]/15 text-[#22C55E] grid place-items-center">
                  <CheckCircle2 className="size-4" />
                </span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={reset} className="h-12 rounded-2xl border border-border hover:bg-secondary text-sm font-medium">
              Verify another
            </button>
            <Link
              to="/post"
              className="h-12 rounded-2xl bg-[#22C55E] text-white font-semibold inline-flex items-center justify-center gap-2 hover:bg-[#16A34A] transition"
            >
              Continue <ArrowRight className="size-4" />
            </Link>
          </div>

          <p className="text-[11px] text-center text-muted-foreground">
            Not what you expected? <button className="underline">Request manual review</button>
          </p>
        </div>
      )}
    </div>
  );
}

function StepCard({
  n, title, children, done, disabled,
}: { n: number; title: string; children: React.ReactNode; done?: boolean; disabled?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.15)] transition ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`size-8 rounded-full grid place-items-center text-xs font-bold ${done ? "bg-[#22C55E] text-white" : "bg-[#22C55E]/10 text-[#22C55E]"}`}>
          {done ? <CheckCircle2 className="size-4" /> : n}
        </div>
        <div className="font-semibold text-sm sm:text-base">{title}</div>
      </div>
      {children}
    </div>
  );
}
