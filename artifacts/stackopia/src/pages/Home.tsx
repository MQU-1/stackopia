import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/stackopia-ds/components/ui/card";
import { Badge } from "@workspace/stackopia-ds/components/ui/badge";
import { Button } from "@workspace/stackopia-ds/components/ui/button";
import { Skeleton } from "@workspace/stackopia-ds/components/ui/skeleton";
import { useGetDashboard } from "@workspace/api-client-react";
import { TrendingUp, PiggyBank, LineChart, Search, Users, Zap, ArrowRight } from "lucide-react";

function StatCard({ label, value, loading }: { label: string; value: string | number; loading: boolean }) {
  return (
    <Card data-testid={`card-stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-4">
        {loading ? (
          <Skeleton className="h-8 w-24 mb-1" />
        ) : (
          <p className="text-2xl font-bold text-primary">{value}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

const features = [
  {
    href: "/spend",
    icon: TrendingUp,
    title: "Spend Rater",
    description: "Get an AI score on any purchase before you swipe. Brutal honesty, zero judgment.",
    badge: "AI",
  },
  {
    href: "/savings",
    icon: PiggyBank,
    title: "Savings Circles",
    description: "Create goal-based circles, track contributions, and hit your targets.",
    badge: "Track",
  },
  {
    href: "/invest",
    icon: LineChart,
    title: "Invest Coach",
    description: "Pick your risk level and get a personalised allocation breakdown.",
    badge: "AI",
  },
  {
    href: "/prices",
    icon: Search,
    title: "Price Hunter",
    description: "Compare prices across Amman shops and online instantly.",
    badge: "AI",
  },
  {
    href: "/tribe",
    icon: Users,
    title: "Find Your Tribe",
    description: "Connect with like-minded savers and hustlers across Jordan.",
    badge: "Community",
  },
];

export default function Home() {
  const { data: dashboard, isLoading } = useGetDashboard();

  return (
    <div className="min-h-[100dvh]">
      {/* Hero */}
      <section className="relative px-4 py-16 md:py-24 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="default" className="px-3 py-1 text-xs font-semibold tracking-wider uppercase">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Finance
          </Badge>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4 leading-tight">
          Stop being broke.
          <br />
          <span className="text-primary">Start stacking.</span>
        </h1>
        <Card className="max-w-2xl mx-auto mb-8">
          <CardContent className="p-4">
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Stackopia is your brutally honest AI money companion built for Jordanians.
              Rate purchases, build savings circles, get investment plans, and find your financial tribe — all in JD.
            </p>
          </CardContent>
        </Card>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/spend">
            <Button size="lg" data-testid="button-hero-rate-spend">
              Rate a Spend
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/savings">
            <Button variant="outline" size="lg" data-testid="button-hero-savings">
              Start Saving
            </Button>
          </Link>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="px-4 pb-10 max-w-7xl mx-auto">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Live Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Saved (JD)" value={`${dashboard?.totalSaved ?? 0} JD`} loading={isLoading} />
          <StatCard label="Savings Circles" value={dashboard?.circleCount ?? 0} loading={isLoading} />
          <StatCard label="Tribe Members" value={dashboard?.tribeCount ?? 0} loading={isLoading} />
          <StatCard label="AI Queries Today" value={dashboard?.aiQueriesToday ?? 0} loading={isLoading} />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-4 pb-16 max-w-7xl mx-auto">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          What Stackopia Does
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ href, icon: Icon, title, description, badge }) => (
            <Card
              key={href}
              className="group hover:border-primary/50 transition-colors cursor-pointer"
              data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{badge}</Badge>
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <Link href={href}>
                  <Button variant="outline" size="sm" className="w-full group-hover:border-primary/50">
                    Open
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
