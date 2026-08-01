import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/stackopia-ds/components/ui/card";
import { Button } from "@workspace/stackopia-ds/components/ui/button";
import { Input } from "@workspace/stackopia-ds/components/ui/input";
import { Badge } from "@workspace/stackopia-ds/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/stackopia-ds/components/ui/form";
import { toast } from "@workspace/stackopia-ds/hooks/use-toast";
import { useGetInvestPlan } from "@workspace/api-client-react";
import type { InvestPlanResult } from "@workspace/api-client-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@workspace/stackopia-ds/lib/utils";

const riskOptions = [
  { value: "safe", label: "Safe", description: "Low risk, steady returns" },
  { value: "balanced", label: "Balanced", description: "Mix of safety and growth" },
  { value: "growth", label: "Growth", description: "Higher risk, higher reward" },
  { value: "halal", label: "Halal", description: "Sharia-compliant investments" },
] as const;

type Risk = typeof riskOptions[number]["value"];

const schema = z.object({
  amount: z.coerce.number().min(1, "Enter amount to invest"),
  risk: z.enum(["safe", "balanced", "growth", "halal"]),
});

type FormValues = z.infer<typeof schema>;

function AiDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function ResultPanel({ result, amount }: { result: InvestPlanResult; amount: number }) {
  return (
    <div className="space-y-4 mt-6">
      {/* Summary */}
      <Card data-testid="card-invest-summary">
        <CardHeader>
          <CardTitle className="text-base">Your Investment Plan</CardTitle>
          <Badge variant="secondary" className="w-fit">{amount} JD to allocate</Badge>
        </CardHeader>
        <CardContent>
          <Card className="border border-border bg-muted/30">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
              <p className="text-sm text-foreground leading-relaxed" data-testid="text-invest-summary">{result.summary}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Pie Chart */}
      <Card data-testid="card-invest-chart">
        <CardHeader>
          <CardTitle className="text-base">Allocation Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={result.allocations}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="percent"
                  nameKey="label"
                >
                  {result.allocations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}% (${((value / 100) * amount).toFixed(0)} JD)`, ""]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                  labelStyle={{ color: "hsl(var(--card-foreground))" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Allocation list */}
          <div className="space-y-2 mt-4">
            {result.allocations.map((alloc) => (
              <div key={alloc.label} className="flex items-center justify-between" data-testid={`row-allocation-${alloc.label}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: alloc.color }} />
                  <span className="text-sm text-foreground">{alloc.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{alloc.percent}%</span>
                  <span className="text-xs text-muted-foreground">{((alloc.percent / 100) * amount).toFixed(0)} JD</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advice */}
      <Card data-testid="card-invest-advice">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">AI Advice</p>
          <p className="text-sm text-foreground leading-relaxed" data-testid="text-invest-advice">{result.advice}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function InvestCoach() {
  const [result, setResult] = useState<InvestPlanResult | null>(null);
  const [lastAmount, setLastAmount] = useState(0);
  const getInvestPlan = useGetInvestPlan();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 0, risk: "balanced" },
  });

  const selectedRisk = form.watch("risk");

  function onSubmit(values: FormValues) {
    setResult(null);
    setLastAmount(values.amount);
    getInvestPlan.mutate(
      { data: { amount: values.amount, risk: values.risk } },
      {
        onSuccess: (data) => {
          setResult(data);
          toast({ title: "Plan ready!", description: `${data.allocations.length} allocations generated.` });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not generate plan. Try again.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Invest Coach</h1>
        <p className="text-muted-foreground text-sm">Set your risk level, get a personalised AI investment breakdown.</p>
      </div>

      <Card data-testid="card-invest-form">
        <CardHeader>
          <CardTitle>Build Your Plan</CardTitle>
          <CardDescription>Enter what you want to invest and pick your risk appetite.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Invest (JD)</FormLabel>
                    <FormControl>
                      <Input type="number" step="1" min="1" placeholder="1000" {...field} data-testid="input-invest-amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="risk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Appetite</FormLabel>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {riskOptions.map(({ value, label, description }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => field.onChange(value)}
                          data-testid={`button-risk-${value}`}
                          className={cn(
                            "rounded-xl border p-3 text-left transition-colors cursor-pointer",
                            selectedRisk === value
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <p className={cn("text-sm font-semibold", selectedRisk === value ? "text-primary" : "text-foreground")}>{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={getInvestPlan.isPending}
                data-testid="button-invest-submit"
              >
                {getInvestPlan.isPending ? (
                  <span className="flex items-center gap-2">Building plan <AiDots /></span>
                ) : (
                  "Generate Investment Plan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && <ResultPanel result={result} amount={lastAmount} />}
    </div>
  );
}
