import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import {
  Plane,
  Laptop,
  LifeBuoy,
  EyeOff,
  Lock,
  Ban,
  HandCoins,
  Clock,
} from "lucide-react";
import { useJoinWaitlist } from "@workspace/api-client-react";
import { useI18n } from "../lib/i18n";

import "./landing.css";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;

const CURRENCIES = ["JOD", "SAR", "AED", "EGP", "USD"] as const;
const CURRENCY_SYMBOLS: Record<string, string> = {
  JOD: "د.أ",
  SAR: "ر.س",
  AED: "د.إ",
  EGP: "ج.م",
  USD: "$",
};

const JOURNEY = [
  { index: "01", tag: "j1tag", title: "j1title", desc: "j1desc" },
  { index: "02", tag: "j2tag", title: "j2title", desc: "j2desc" },
  { index: "03", tag: "j3tag", title: "j3title", desc: "j3desc" },
  { index: "04", tag: "j4tag", title: "j4title", desc: "j4desc" },
];

const FAQ_ITEMS = [
  { q: "faq1q", a: "faq1a" },
  { q: "faq2q", a: "faq2a" },
  { q: "faq3q", a: "faq3a" },
  { q: "faq4q", a: "faq4a" },
  { q: "faq5q", a: "faq5a" },
];

const LEARN = [
  { tag: "learn1tag", title: "learn1title", desc: "learn1desc", time: "learn1time" },
  { tag: "learn2tag", title: "learn2title", desc: "learn2desc", time: "learn2time" },
  { tag: "learn3tag", title: "learn3title", desc: "learn3desc", time: "learn3time" },
];

const GOALS = [
  { title: "goal1title", icon: Plane, pct: "62%", bars: [40, 55, 62, 48, 35], done: "620", of: "goalOf" },
  { title: "goal2title", icon: Laptop, pct: "31%", bars: [22, 28, 31, 18, 12], done: "465", of: "goalOf2" },
  { title: "goal3title", icon: LifeBuoy, pct: "88%", bars: [70, 80, 88, 65, 55], done: "1,760", of: "goalOf3" },
];

const SECURITY = [
  { title: "sec1t", desc: "sec1d", icon: EyeOff },
  { title: "sec2t", desc: "sec2d", icon: Lock },
  { title: "sec3t", desc: "sec3d", icon: Ban },
  { title: "sec4t", desc: "sec4d", icon: HandCoins },
];

function clampPositive(n: string, fallback: number) {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return fallback;
  return v;
}

function useReveal() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll(".landing .reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useProgressRail() {
  useEffect(() => {
    const rail = document.querySelector<HTMLDivElement>(".landing .progress-fill");
    if (!rail) return;
    const onScroll = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      const pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      rail.style.width = `${pct}%`;
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => document.removeEventListener("scroll", onScroll);
  }, []);
}

function growStacks() {
  window.setTimeout(() => {
    document.querySelectorAll(".landing .stack-scene .stack-bar").forEach((bar, i) => {
      window.setTimeout(() => bar.classList.add("is-grown"), i * 120);
    });
  }, 300);
  document.querySelectorAll(".landing .goal-stack .stack-bar").forEach((bar, i) => {
    window.setTimeout(() => bar.classList.add("is-grown"), 500 + i * 80);
  });
}

function useStackGrow() {
  useEffect(() => {
    growStacks();
  }, []);
}

function HeroScene() {
  const bars = [
    { h: "35%", label: "Learn" },
    { h: "52%", label: "Track" },
    { h: "74%", label: "Stack" },
    { h: "60%", label: "Save" },
    { h: "92%", label: "Grow" },
  ];
  return (
    <div className="stack-scene reveal" aria-hidden="true">
      {bars.map((b) => (
        <div key={b.label} className="stack-bar" style={{ height: b.h }}>
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

function Calculator() {
  const { t, lang } = useI18n();
  const [monthly, setMonthly] = useState("50");
  const [goal, setGoal] = useState("1000");
  const [currency, setCurrency] = useState<string>("JOD");
  const [boost, setBoost] = useState(false);

  const { months, boostedMonthly } = useMemo(() => {
    const m = clampPositive(monthly, 1);
    const g = clampPositive(goal, 1);
    const boosted = boost ? m * 1.12 : m;
    const mon = Math.max(1, Math.ceil(g / boosted));
    return { months: mon, boostedMonthly: boosted };
  }, [monthly, goal, boost]);

  const summary = useMemo(() => {
    const sym = CURRENCY_SYMBOLS[currency] || "";
    const fmt = new Intl.NumberFormat(lang === "ar" ? "ar" : "en", { maximumFractionDigits: 0 });
    return `${fmt.format(Math.round(boostedMonthly))} ${sym} / ${t("calcPerMonth")}`;
  }, [boostedMonthly, currency, lang, t]);

  return (
    <div className="card calc-card reveal">
      <div className="calc-grid">
        <div>
          <div className="field">
            <label htmlFor="calcMonthly">{t("calcMonthlyLabel")}</label>
            <input
              type="number"
              id="calcMonthly"
              min={1}
              step={1}
              value={monthly}
              inputMode="numeric"
              onChange={(e) => setMonthly(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="calcGoal">{t("calcGoalLabel")}</label>
            <input
              type="number"
              id="calcGoal"
              min={1}
              step={1}
              value={goal}
              inputMode="numeric"
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div className="field">
            <label>{t("calcCurrencyLabel")}</label>
            <div className="chip-row" role="group" aria-label="Currency">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  className="chip"
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => setCurrency(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="toggle-row">
            <p>
              <span>{t("calcBoostLabel")}</span>
              <span>{t("calcBoostDesc")}</span>
            </p>
            <label className="switch">
              <input type="checkbox" checked={boost} onChange={(e) => setBoost(e.target.checked)} />
              <span className="switch-track" aria-hidden="true"></span>
              <span className="switch-thumb" aria-hidden="true"></span>
            </label>
          </div>
        </div>
        <div className="calc-result">
          <div className="big">
            <span>{months}</span> <span>{t("calcMonthsUnit")}</span>
          </div>
          <div className="cap">{t("calcResultCap")}</div>
          <div className="calc-stack" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => {
              const pct = Math.min(100, ((i + 1) / 8) * 100);
              return <div key={i} className="stack-bar" style={{ height: `${pct}%` }}></div>;
            })}
          </div>
          <div className="cap" style={{ marginTop: "1rem" }}>{summary}</div>
        </div>
      </div>
    </div>
  );
}

function Faq() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="faq-list reveal">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div className="faq-item" data-open={isOpen} key={item.q}>
            <button
              className="faq-q"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <span>{t(item.q)}</span>
              <span className="plus" aria-hidden="true">+</span>
            </button>
            <div className="faq-a" style={isOpen ? { maxHeight: "240px" } : undefined}>
              <div className="faq-a-inner">{t(item.a)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WaitlistForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [statusClass, setStatusClass] = useState("");
  const mutation = useJoinWaitlist();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setStatusClass("");

    if (website.trim() !== "") {
      setStatus(t("formOk"));
      setStatusClass("ok");
      setEmail("");
      setWebsite("");
      return;
    }

    const rawEmail = email.trim().slice(0, 254);
    if (!EMAIL_RE.test(rawEmail)) {
      setError(t("formErr"));
      return;
    }

    setStatus(t("formSending"));
    mutation.mutate(
      { data: { email: rawEmail, website: website.trim() || undefined } },
      {
        onSuccess: () => {
          setStatus(t("formOk"));
          setStatusClass("ok");
          setEmail("");
          setWebsite("");
        },
        onError: () => {
          setStatus(t("formErr"));
          setStatusClass("err");
        },
      }
    );
  };

  return (
    <form className="waitlist-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="waitlistEmail" className="sr-only">
            {t("ctaEmailLabel")}
          </label>
          <input
            type="email"
            id="waitlistEmail"
            name="email"
            placeholder={t("ctaEmailPlaceholder")}
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            aria-invalid={error ? "true" : "false"}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
          />
          <div className="field-error" role="alert">{error}</div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={mutation.isPending}
          data-testid="button-waitlist-submit"
        >
          {t("ctaSubmit")}
        </button>
      </div>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="companyWebsite">Company website</label>
        <input
          type="text"
          id="companyWebsite"
          name="companyWebsite"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className={`form-status ${statusClass}`} aria-live="polite">{status}</div>
      <p className="form-note">{t("ctaNote")}</p>
    </form>
  );
}

function LandingFooter() {
  const { t } = useI18n();
  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <a href="#top" className="brand">
            <span className="brand-mark" aria-hidden="true"><span></span><span></span><span></span></span>
            Stackopia
          </a>
          <p style={{ marginTop: "1rem", color: "var(--text-dim)", fontSize: ".85rem", maxWidth: "32ch" }}>
            {t("footerTag")}
          </p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h4>{t("footerCol1")}</h4>
            <ul>
              <li><a href="#product">{t("navProduct")}</a></li>
              <li><a href="#calculator">{t("footerCalc")}</a></li>
              <li><a href="#security">{t("navSecurity")}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t("footerCol2")}</h4>
            <ul>
              <li><a href="#learn">{t("navLearn")}</a></li>
              <li><a href="#faq">{t("navFaq")}</a></li>
              <li><a href="#waitlist">{t("navCta")}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t("footerCol3")}</h4>
            <ul>
              <li><a href="#" onClick={(e) => e.preventDefault()}>{t("footerPrivacy")}</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>{t("footerTerms")}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>{t("footerCopy")}</span>
        <span>{t("footerMade")}</span>
      </div>
    </footer>
  );
}

export default function Home() {
  const { t } = useI18n();
  useReveal();
  useProgressRail();
  useStackGrow();

  return (
    <div className="landing">
      <a href="#main" className="skip-link">
        {t("skipLink")}
      </a>
      <div className="progress-rail" aria-hidden="true">
        <div className="progress-fill"></div>
      </div>

      <div id="main">
        {/* HERO */}
        <section className="hero" id="top">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">{t("heroEyebrow")}</span>
              <h1 className="hero-title">
                <span>{t("heroTitle1")}</span>
                <br />
                <span className="accent">{t("heroTitle2")}</span>
              </h1>
              <p className="hero-sub">{t("heroSub")}</p>
              <div className="hero-ctas">
                <a href="#waitlist" className="btn btn-primary" data-testid="button-hero-waitlist">
                  {t("heroCtaPrimary")}
                </a>
                <a href="#product" className="btn btn-ghost">
                  {t("heroCtaSecondary")}
                </a>
              </div>
              <div className="hero-meta">
                <div>
                  <strong>4</strong>
                  <span>{t("heroMeta1")}</span>
                </div>
                <div>
                  <strong>{t("heroMeta2Num")}</strong>
                  <span>{t("heroMeta2")}</span>
                </div>
                <div>
                  <strong>{t("heroMeta3Num")}</strong>
                  <span>{t("heroMeta3")}</span>
                </div>
              </div>
            </div>
            <HeroScene />
          </div>
        </section>

        {/* JOURNEY */}
        <section id="journey">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{t("journeyEyebrow")}</span>
              <h2 className="section-title">{t("journeyTitle")}</h2>
              <p className="section-sub">{t("journeySub")}</p>
            </div>
            <div className="journey-grid reveal-stagger">
              {JOURNEY.map((item, i) => (
                <div key={item.index} className="journey-card reveal" style={{ "--i": i } as CSSProperties}>
                  <span className="journey-index">
                    {item.index} · <span>{t(item.tag)}</span>
                  </span>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.desc)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DASHBOARD PREVIEW */}
        <section id="product" style={{ background: "var(--bg-soft)" }}>
          <div className="wrap split">
            <div className="reveal">
              <span className="eyebrow">{t("dashEyebrow")}</span>
              <h2 className="section-title">{t("dashTitle")}</h2>
              <div className="feature-list">
                <div className="feature-item">
                  <span className="feature-dot" aria-hidden="true">&#10003;</span>
                  <p>
                    <strong>{t("dashF1t")}</strong>
                    <span>{t("dashF1d")}</span>
                  </p>
                </div>
                <div className="feature-item">
                  <span className="feature-dot" aria-hidden="true">&#10003;</span>
                  <p>
                    <strong>{t("dashF2t")}</strong>
                    <span>{t("dashF2d")}</span>
                  </p>
                </div>
                <div className="feature-item">
                  <span className="feature-dot" aria-hidden="true">&#10003;</span>
                  <p>
                    <strong>{t("dashF3t")}</strong>
                    <span>{t("dashF3d")}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="split-visual reveal">
              <div className="card dash-card">
                <div className="dash-head">
                  <div>
                    <div style={{ fontSize: ".8rem", color: "var(--text-dim)" }}>{t("dashCardLabel")}</div>
                    <div className="dash-total">1,240</div>
                  </div>
                  <span className="currency-chip">JOD</span>
                </div>
                {[
                  { label: t("cat1"), value: 78, num: "420" },
                  { label: t("cat2"), value: 45, num: "265" },
                  { label: t("cat3"), value: 30, num: "130" },
                  { label: t("cat4"), value: 60, num: "300" },
                ].map((row) => (
                  <div className="bar-row" key={row.label}>
                    <span className="bar-label">{row.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${row.value}%` }}></div>
                    </div>
                    <span className="bar-value">{row.num}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{t("calcEyebrow")}</span>
              <h2 className="section-title">{t("calcTitle")}</h2>
              <p className="section-sub">{t("calcSub")}</p>
            </div>
            <Calculator />
          </div>
        </section>

        {/* GOALS / STACKS */}
        <section id="stacks" style={{ background: "var(--bg-soft)" }}>
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{t("stacksEyebrow")}</span>
              <h2 className="section-title">{t("stacksTitle")}</h2>
              <p className="section-sub">{t("stacksSub")}</p>
            </div>
            <div className="goals-grid reveal-stagger">
              {GOALS.map((goal, i) => (
                <div key={goal.title} className="card goal-card reveal" style={{ "--i": i } as CSSProperties}>
                  <div className="goal-head">
                    <span className="goal-icon" aria-hidden="true">
                      <goal.icon className="w-5 h-5" style={{ color: "var(--gold-bright)" }} />
                    </span>
                    <span className="goal-pct">{goal.pct}</span>
                  </div>
                  <h3>{t(goal.title)}</h3>
                  <div className="goal-stack" aria-hidden="true">
                    {goal.bars.map((h, bi) => (
                      <div key={bi} className="stack-bar" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                  <div className="goal-nums">
                    <span><strong>{goal.done}</strong> JOD</span>
                    <span>{t(goal.of)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="security">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{t("secEyebrow")}</span>
              <h2 className="section-title">{t("secTitle")}</h2>
              <p className="section-sub">{t("secSub")}</p>
            </div>
            <div className="security-grid reveal-stagger">
              {SECURITY.map((s, i) => (
                <div key={s.title} className="card sec-card reveal" style={{ "--i": i } as CSSProperties}>
                  <span className="ic" aria-hidden="true">
                    <s.icon className="w-5 h-5" />
                  </span>
                  <h3>{t(s.title)}</h3>
                  <p>{t(s.desc)}</p>
                </div>
              ))}
            </div>
            <div className="sec-banner reveal">
              <span className="ic" aria-hidden="true" style={{ margin: 0 }}>
                <Ban className="w-5 h-5" />
              </span>
              <p>
                <strong>{t("secBannerStrong")}</strong> {t("secBanner")}
              </p>
            </div>
          </div>
        </section>

        {/* LEARN */}
        <section id="learn" style={{ background: "var(--bg-soft)" }}>
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{t("learnEyebrow")}</span>
              <h2 className="section-title">{t("learnTitle")}</h2>
              <p className="section-sub">{t("learnSub")}</p>
            </div>
            <div className="learn-grid reveal-stagger">
              {LEARN.map((item, i) => (
                <a key={item.title} href="#" className="card learn-card reveal" style={{ "--i": i } as CSSProperties} onClick={(e) => e.preventDefault()}>
                  <span className="learn-tag">{t(item.tag)}</span>
                  <h3>{t(item.title)}</h3>
                  <p>{t(item.desc)}</p>
                  <span className="learn-meta">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t(item.time)}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">{t("faqEyebrow")}</span>
              <h2 className="section-title">{t("faqTitle")}</h2>
            </div>
            <Faq />
          </div>
        </section>

        {/* CTA / WAITLIST */}
        <section className="cta-section" id="waitlist">
          <div className="wrap">
            <div className="cta-card reveal">
              <span className="eyebrow">{t("ctaEyebrow")}</span>
              <h2 style={{ marginTop: ".75rem" }}>{t("ctaTitle")}</h2>
              <p className="lead">{t("ctaSub")}</p>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </div>

      <LandingFooter />
    </div>
  );
}
