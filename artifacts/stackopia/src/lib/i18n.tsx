import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, string>;

const translations: Record<Lang, Dict> = {
  en: {
    skipLink: "Skip to content", navProduct: "Product", navLearn: "Learn", navSecurity: "Security", navFaq: "FAQ", navCta: "Join waitlist",
    heroEyebrow: "Financial empowerment, built for the region", heroTitle1: "Your money,", heroTitle2: "finally making sense.",
    heroSub: "Stackopia turns budgeting, saving, and financial literacy into one clear habit — built for how young people across the Arab world actually spend, save, and dream.",
    heroCtaPrimary: "Join the waitlist", heroCtaSecondary: "See how it works",
    heroMeta1: "currencies supported", heroMeta2Num: "0%", heroMeta2: "interest, ever", heroMeta3Num: "EN / AR", heroMeta3: "fully bilingual",
    journeyEyebrow: "The habit loop", journeyTitle: "Four steps, one habit that sticks.", journeySub: "Every part of Stackopia maps to a real stage of building financial confidence — in order, on purpose.",
    j1tag: "Learn", j1title: "Understand the basics", j1desc: "Short, plain-language lessons on budgeting, saving, and credit — written for real life, not textbooks.",
    j2tag: "Track", j2title: "See where it actually goes", j2desc: "Read-only bank connections auto-sort spending into clear categories — no manual entry, no guesswork.",
    j3tag: "Stack", j3title: "Set a goal and stack toward it", j3desc: "Umrah, a laptop, an emergency fund — pick a goal and watch every deposit visibly build the stack.",
    j4tag: "Grow", j4title: "Build momentum, interest-free", j4desc: "Round-up boosts and streaks keep the habit going — no interest, no debt, just consistency.",
    dashEyebrow: "Your spending, clarified", dashTitle: "A budget that reads itself.",
    dashF1t: "Auto-categorized spending", dashF1d: " Every transaction sorted the moment it lands — rent, transport, food, subscriptions.",
    dashF2t: "Multi-currency by default", dashF2d: " JOD, SAR, AED, EGP — switch instantly, no conversion guesswork.",
    dashF3t: "Read-only, always", dashF3d: " Stackopia can see your spending patterns — it can never move your money.",
    dashCardLabel: "This month", cat1: "Rent", cat2: "Food", cat3: "Transport", cat4: "Saved",
    calcEyebrow: "Try it yourself", calcTitle: "Build your stack, right now.", calcSub: "No account needed — just see what consistency actually adds up to.",
    calcMonthlyLabel: "Monthly amount", calcGoalLabel: "Goal amount", calcCurrencyLabel: "Currency",
    calcBoostLabel: "Round-up boost", calcBoostDesc: "Spare change from purchases, added on top — not interest.",
    calcMonthsUnit: "months", calcResultCap: "to reach your goal", calcPerMonth: "month",
    stacksEyebrow: "Goal-based saving", stacksTitle: "Every goal gets its own stack.", stacksSub: "Name it, fund it, watch it build — visually, in real time.",
    goal1title: "Umrah trip", goal2title: "New laptop", goal3title: "Emergency fund",
    goalOf: "of 1,000 JOD", goalOf2: "of 1,500 JOD", goalOf3: "of 2,000 JOD",
    secEyebrow: "Trust, by design", secTitle: "We can see your spending. We can never touch it.", secSub: "Stackopia is built as a read-only companion to your existing bank accounts — never a place that holds your money.",
    sec1t: "Read-only, non-custodial", sec1d: "Bank connections are view-only. Stackopia is never able to move, withdraw, or hold your funds.",
    sec2t: "Encrypted end to end", sec2d: "Data is encrypted in transit and at rest. Account credentials are never stored on Stackopia's servers.",
    sec3t: "Your data isn't for sale", sec3d: "No selling data to advertisers, ever. Full account and data deletion, any time, in one tap.",
    sec4t: "Interest-free by design", sec4d: "No interest-bearing products. Saving tools are built around consistency, not lending.",
    secBannerStrong: "Heads up:", secBanner: "Stackopia is currently in pre-launch. Bank integrations, licensing, and regulatory review are in progress ahead of public launch.",
    learnEyebrow: "Financial literacy hub", learnTitle: "Money lessons that actually apply here.", learnSub: "Five-minute reads, written for the region's cost of living, banking habits, and financial products.",
    learn1tag: "Budgeting", learn1title: "The 50/30/20 rule, adjusted for real rent prices", learn1desc: "Why the classic split needs reworking when rent alone can eat 40% of a starting salary.", learn1time: "4 min read",
    learn2tag: "Saving", learn2title: "Round-ups: the smallest habit that compounds", learn2desc: "How spare-change saving adds up faster than people expect — with real numbers.", learn2time: "3 min read",
    learn3tag: "Credit", learn3title: "Building credit history without going into debt", learn3desc: "What actually builds a credit profile in the region — and what just creates risk.", learn3time: "5 min read",
    faqEyebrow: "Questions", faqTitle: "Before you join.",
    faq1q: "Is my money actually safe?", faq1a: "Stackopia only ever gets read-only visibility into your spending. It cannot move, hold, or withdraw funds — connections are revocable at any time from your bank.",
    faq2q: "Is it interest-free / Shariah-conscious?", faq2a: "Yes. Stackopia has no interest-bearing products. Growth comes from consistency and optional round-up boosts, never lending or interest.",
    faq3q: "Which banks will be supported?", faq3a: "We're prioritizing the most widely used retail banks in Jordan, Saudi Arabia, the UAE, and Egypt at launch, with more added based on waitlist demand.",
    faq4q: "Does Stackopia cost anything?", faq4a: "Core budgeting, tracking, and learning tools are free. Optional premium features are planned post-launch — pricing will be shared before anyone is charged.",
    faq5q: "When does it launch?", faq5a: "We're in pre-launch, finishing bank integrations and compliance review. Waitlist members hear first, in order.",
    ctaEyebrow: "Pre-launch", ctaTitle: "Be first to stack.", ctaSub: "Join the waitlist for early access, launch-day pricing, and a say in which banks we connect first.",
    ctaEmailLabel: "Email address", ctaEmailPlaceholder: "you@example.com", ctaSubmit: "Join the waitlist", ctaNote: "No spam. One email when we launch in your city. Unsubscribe any time.",
    footerTag: "Financial empowerment, built for the region.", footerCol1: "Product", footerCol2: "Company", footerCol3: "Legal",
    footerCalc: "Calculator", footerPrivacy: "Privacy policy", footerTerms: "Terms of use",
    footerCopy: "\u00A9 2026 Stackopia. Pre-launch concept — not yet a licensed financial service.", footerMade: "Built with intent, for the region.",
    formOk: "You're on the list — check your inbox to confirm.", formErr: "Enter a valid email address to continue.", formSending: "Adding you...",
    switchLangAria: "Switch to Arabic", switchThemeAria: "Toggle dark or light theme", openMenuAria: "Open menu",
    navHome: "Home", navSpend: "Spend Rater", navSavings: "Savings", navInvest: "Invest", navPrices: "Price Hunter", navTribe: "Tribe",
    toggleThemeAria: "Toggle theme",
  },
  ar: {
    skipLink: "تخطَّ إلى المحتوى", navProduct: "المنتج", navLearn: "تعلّم", navSecurity: "الأمان", navFaq: "الأسئلة الشائعة", navCta: "انضم لقائمة الانتظار",
    heroEyebrow: "تمكين مالي، مصمم لمنطقتنا", heroTitle1: "فلوسك،", heroTitle2: "أخيرًا صارت مفهومة.",
    heroSub: "ستاكوبيا يجمع لك الميزانية والادخار والثقافة المالية في عادة واحدة وواضحة — مبني على الطريقة اللي فيها شباب المنطقة فعلاً يصرفون ويوفرون ويحلمون.",
    heroCtaPrimary: "انضم لقائمة الانتظار", heroCtaSecondary: "شوف كيف يشتغل",
    heroMeta1: "عملات مدعومة", heroMeta2Num: "٠٪", heroMeta2: "فوائد، أبدًا", heroMeta3Num: "EN / AR", heroMeta3: "ثنائي اللغة بالكامل",
    journeyEyebrow: "حلقة العادة", journeyTitle: "أربع خطوات، عادة وحدة بتثبت.", journeySub: "كل جزء من ستاكوبيا يمثل مرحلة حقيقية من بناء الثقة المالية — بالترتيب، وبقصد.",
    j1tag: "تعلّم", j1title: "افهم الأساسيات", j1desc: "دروس قصيرة وواضحة عن الميزانية والادخار والائتمان — مكتوبة للواقع، مش للكتب الدراسية.",
    j2tag: "تتبّع", j2title: "شوف وين فعلاً بتروح فلوسك", j2desc: "ربط القراءة فقط مع البنك يصنّف مصروفك تلقائيًا لفئات واضحة — بدون إدخال يدوي ولا تخمين.",
    j3tag: "كوّم", j3title: "حدد هدف وابدأ تكوّم له", j3desc: "عمرة، لابتوب، صندوق طوارئ — اختر هدفك وشوف كل إيداع يبني الكومة أمامك.",
    j4tag: "انمُ", j4title: "ابنِ الزخم، بدون فوائد", j4desc: "تعزيزات الفكة والسلاسل المتتالية تخلي العادة مستمرة — بدون فوائد، بدون ديون، بس استمرارية.",
    dashEyebrow: "مصروفك، واضح", dashTitle: "ميزانية تشرح نفسها بنفسها.",
    dashF1t: "تصنيف تلقائي للمصروف", dashF1d: " كل عملية تتصنّف لحظة ما تحصل — إيجار، مواصلات، أكل، اشتراكات.",
    dashF2t: "متعدد العملات افتراضيًا", dashF2d: " دينار أردني، ريال سعودي، درهم إماراتي، جنيه مصري — بدّل فورًا، بدون تحويل معقّد.",
    dashF3t: "قراءة فقط، دائمًا", dashF3d: " ستاكوبيا يشوف نمط مصروفك — بس ما بيقدر يحرك فلوسك أبدًا.",
    dashCardLabel: "هالشهر", cat1: "إيجار", cat2: "أكل", cat3: "مواصلات", cat4: "مدّخر",
    calcEyebrow: "جرّب بنفسك", calcTitle: "ابنِ كومتك، هلق.", calcSub: "بدون حساب — بس شوف شو فعلاً بتوصله الاستمرارية.",
    calcMonthlyLabel: "المبلغ الشهري", calcGoalLabel: "مبلغ الهدف", calcCurrencyLabel: "العملة",
    calcBoostLabel: "تعزيز الفكة", calcBoostDesc: "فكة مشترياتك، تنضاف فوق المبلغ — مو فوائد.",
    calcMonthsUnit: "شهر", calcResultCap: "للوصول لهدفك", calcPerMonth: "شهريًا",
    stacksEyebrow: "ادخار بالأهداف", stacksTitle: "كل هدف إله كومته الخاصة.", stacksSub: "سمّيه، مِوّله، وشوفه يكبر — بشكل مرئي، لحظة بلحظة.",
    goal1title: "رحلة عمرة", goal2title: "لابتوب جديد", goal3title: "صندوق طوارئ",
    goalOf: "من أصل 1,000 د.أ", goalOf2: "من أصل 1,500 د.أ", goalOf3: "من أصل 2,000 د.أ",
    secEyebrow: "ثقة، من التصميم", secTitle: "نقدر نشوف مصروفك. ما نقدر نلمسه أبدًا.", secSub: "ستاكوبيا مصمم كرفيق قراءة فقط لحساباتك البنكية الحالية — مش مكان يحتفظ بفلوسك.",
    sec1t: "قراءة فقط، بدون حجز أموال", sec1d: "الربط مع البنك للعرض فقط. ستاكوبيا ما بيقدر يحرك أو يسحب أو يحتفظ بأموالك.",
    sec2t: "تشفير من طرف لطرف", sec2d: "بياناتك مشفّرة أثناء النقل والتخزين. بيانات دخولك البنكية ما تنخزن أبدًا على خوادم ستاكوبيا.",
    sec3t: "بياناتك مش للبيع", sec3d: "ما نبيع بياناتك للمعلنين أبدًا. حذف الحساب والبيانات بالكامل، بأي وقت، بضغطة وحدة.",
    sec4t: "بدون فوائد من الأساس", sec4d: "ما في منتجات فيها فوائد. أدوات الادخار مبنية على الاستمرارية، مش الإقراض.",
    secBannerStrong: "تنويه:", secBanner: "ستاكوبيا حاليًا بمرحلة ما قبل الإطلاق. ربط البنوك، والترخيص، والمراجعة التنظيمية لسا شغالين عليها قبل الإطلاق الرسمي.",
    learnEyebrow: "مركز الثقافة المالية", learnTitle: "دروس مالية تنطبق فعليًا هون.", learnSub: "قراءة خمس دقائق، مكتوبة على أساس تكلفة المعيشة والعادات البنكية بالمنطقة.",
    learn1tag: "ميزانية", learn1title: "قاعدة 50/30/20، معدّلة على أسعار الإيجار الحقيقية", learn1desc: "ليش القسمة الكلاسيكية محتاجة تعديل لما الإيجار وحده ياكل 40% من راتب أول وظيفة.", learn1time: "قراءة 4 دقائق",
    learn2tag: "ادخار", learn2title: "تعزيز الفكة: أصغر عادة بترجع بفايدة كبيرة", learn2desc: "كيف ادخار الفكة يتراكم أسرع مما يتوقع الناس — بأرقام حقيقية.", learn2time: "قراءة 3 دقائق",
    learn3tag: "ائتمان", learn3title: "بناء سجل ائتماني بدون ما تدخل بديون", learn3desc: "شو فعلاً يبني السجل الائتماني بالمنطقة — وشو بس بيزيد المخاطرة.", learn3time: "قراءة 5 دقائق",
    faqEyebrow: "أسئلة", faqTitle: "قبل ما تنضم.",
    faq1q: "فلوسي فعلاً بأمان؟", faq1a: "ستاكوبيا بس بياخد صلاحية قراءة لمصروفك. ما بيقدر يحرك أو يحتفظ أو يسحب فلوس — وتقدر تلغي الربط مع البنك بأي وقت.",
    faq2q: "هو بدون فوائد / متوافق مع الضوابط الشرعية؟", faq2a: "إيه. ستاكوبيا ما فيه أي منتجات فيها فوائد. النمو من الاستمرارية وتعزيز الفكة الاختياري، مش من الإقراض أو الفوائد.",
    faq3q: "شو البنوك المدعومة؟", faq3a: "عم نعطي أولوية لأكثر البنوك استخدامًا بالأردن والسعودية والإمارات ومصر وقت الإطلاق، وبنزيد بنوك حسب طلب قائمة الانتظار.",
    faq4q: "ستاكوبيا فيه تكلفة؟", faq4a: "أدوات الميزانية والتتبع والتعلم الأساسية مجانية. في ميزات مدفوعة اختيارية متخطط إلها بعد الإطلاق — وراح نعلن عن أسعارها قبل أي خصم.",
    faq5q: "إيمتى الإطلاق؟", faq5a: "عم نشتغل على مرحلة ما قبل الإطلاق، وربط البنوك، ومراجعة الامتثال. أعضاء قائمة الانتظار بيعرفوا أول واحد، بالترتيب.",
    ctaEyebrow: "ما قبل الإطلاق", ctaTitle: "كون أول واحد يكوّم.", ctaSub: "انضم لقائمة الانتظار عشان وصول مبكر، وأسعار يوم الإطلاق، ورأي بأي بنوك نربط أول.",
    ctaEmailLabel: "البريد الإلكتروني", ctaEmailPlaceholder: "you@example.com", ctaSubmit: "انضم لقائمة الانتظار", ctaNote: "بدون رسائل مزعجة. إيميل وحد وقت الإطلاق بمدينتك. تقدر تلغي الاشتراك أي وقت.",
    footerTag: "تمكين مالي، مصمم لمنطقتنا.", footerCol1: "المنتج", footerCol2: "الشركة", footerCol3: "قانوني",
    footerCalc: "الحاسبة", footerPrivacy: "سياسة الخصوصية", footerTerms: "شروط الاستخدام",
    footerCopy: "\u00A9 2026 ستاكوبيا. مفهوم ما قبل الإطلاق — لسا مش خدمة مالية مرخصة.", footerMade: "مبني بقصد، لأجل المنطقة.",
    formOk: "صرت بالقائمة — تأكد من بريدك الإلكتروني.", formErr: "دخّل بريد إلكتروني صحيح للمتابعة.", formSending: "عم نضيفك...",
    switchLangAria: "التبديل للعربية", switchThemeAria: "بدّل بين الوضع الليلي والنهاري", openMenuAria: "افتح القائمة",
    navHome: "الرئيسية", navSpend: "مقيّم المصروف", navSavings: "الادخار", navInvest: "الاستثمار", navPrices: "صائدة الأسعار", navTribe: "مجموعتك",
    toggleThemeAria: "بدّل الوضع",
  },
};

const LANG_KEY = "stackopia-lang";

type I18nContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LANG_KEY);
  if (stored === "en" || stored === "ar") return stored;
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const value = useMemo<I18nContextValue>(() => {
    const setLang = (next: Lang) => {
      setLangState(next);
      try {
        window.localStorage.setItem(LANG_KEY, next);
      } catch {
        /* private mode */
      }
    };
    return {
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      toggleLang: () => setLang(lang === "en" ? "ar" : "en"),
      t: (key: string) => translations[lang][key] ?? translations.en[key] ?? key,
    };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
