import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send, TrendingUp, ShieldCheck, Calculator, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "AI Assistant — Terra" }] }),
  component: AI,
});

const SUGGESTIONS = [
  "What's a fair price for 2 acres in Devanahalli?",
  "Show me best investment plots under ₹50 L",
  "Is agricultural land near Nagpur a good buy?",
  "Compare Sarjapur vs Whitefield for land",
];

export function AI() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm Terra AI. Ask me about pricing, locations, documents, or investment potential — I'll analyze 50,000+ recent transactions to help you decide." },
  ]);
  const [input, setInput] = useState("");

  const send = (t: string) => {
    if (!t.trim()) return;
    setMessages((m) => [...m, { role: "user", text: t }, { role: "ai", text: mockReply(t) }]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs mb-3">
          <Sparkles className="size-3.5 text-primary"/> Terra AI · Powered by Lovable AI
        </div>
        <h1 className="font-display text-5xl">Your land intelligence engine</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Valuation, fraud detection, market trends, and buyer recommendations — in one conversation.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Chat */}
        <div className="glass rounded-3xl p-4 md:p-6 shadow-lift flex flex-col h-[560px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary rounded-bl-md"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-xs rounded-full border border-border px-3 py-1.5 hover:bg-secondary transition">{s}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 h-12 rounded-full border border-border bg-background px-2 pl-4 focus-within:ring-2 focus-within:ring-primary/40">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about pricing, documents, locations…" className="flex-1 bg-transparent outline-none text-sm"/>
              <button className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center hover:opacity-90"><Send className="size-4"/></button>
            </form>
          </div>
        </div>

        {/* Feature rail */}
        <div className="space-y-3">
          {[
            { icon:<Calculator className="size-5"/>, t:"AI valuation", d:"Fair price + 12-month forecast." },
            { icon:<ShieldCheck className="size-5"/>, t:"Fraud detection", d:"Docs, ownership & duplicates checked." },
            { icon:<TrendingUp className="size-5"/>, t:"Market trends", d:"Micro-market analysis by pincode." },
            { icon:<MapPin className="size-5"/>, t:"Buyer match", d:"Get plots that fit your goals." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border p-4 hover:border-primary transition cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-xl bg-primary/10 text-primary grid place-items-center shrink-0">{f.icon}</div>
                <div>
                  <div className="font-medium">{f.t}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{f.d}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function mockReply(q: string) {
  const l = q.toLowerCase();
  if (l.includes("devanahalli") || l.includes("price")) return "For 2 acres in Devanahalli, fair market range is ₹28–36 L based on 47 recent comparable deals. Corner plots and those near the STRR corridor trade at a 12–15% premium. I'd recommend verifying the 7/12 extract and encumbrance certificate before negotiating.";
  if (l.includes("investment") || l.includes("under")) return "Top picks under ₹50 L right now: (1) Sarjapur investment plot — AI score 94, 22% expected appreciation; (2) Devanahalli farmland — clear title, canal water; (3) Sultanpur Road, Lucknow — new expressway 3 km away. Want me to open any of these?";
  if (l.includes("nagpur")) return "Nagpur agricultural land has posted 9% annualized returns over 3 years, driven by MIHAN expansion and Samruddhi Mahamarg. Best sub-markets: Hingna, Kalmeshwar, and Kamptee. Avoid encroachment-prone patches south of NH-44.";
  return "Great question. Based on current market signals, I'd analyze location premium, road connectivity, upcoming infra, and title clarity. Want me to run a full report on a specific plot or area?";
}
