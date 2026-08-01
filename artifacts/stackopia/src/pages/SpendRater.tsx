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
import { useRateSpend } from "@workspace/api-client-react";
import type { SpendRateResult } from "@workspace/api-client-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@workspace/stackopia-ds/lib/utils";
import { PageHeader } from "../components/PageHeader";

const schema = z.object({
  item: z.string().min(1, "Tell me what you bought"),
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
  context: z.string().optional(),
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

function ScoreMeter({ score }: { score: number }) {
  const pct = ((score - 1) / 9) * 100;
  const color =
    score >= 7 ? "text-primary" : score >= 4 ? "text-yellow-500" : "text-destructive";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("text-6xl font-bold", color)} data-testid="text-spend-score">
        {score}
        <span className="text-2xl text-muted-foreground">/10</span>
      </div>
      <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function verdictIcon(verdict: string) {
  const lower = verdict.toLowerCase();
  if (lower.includes("great") || lower.includes("smart") || lower.includes("good")) return TrendingUp;
  if (lower.includes("waste") || lower.includes("bad") || lower.includes("poor")) return TrendingDown;
  return Minus;
}

function ResultPanel({ result }: { result: SpendRateResult }) {
  const Icon = verdictIcon(result.verdict);
  const score = result.score;
  const badgeVariant = score >= 7 ? "default" : score >= 4 ? "secondary" : "destructive";

  return (
    <div className="space-y-4 mt-6">
      <Card data-testid="card-spend-result">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant={badgeVariant} className="flex items-center gap-1 px-3 py-1" data-testid="badge-spend-verdict">
              <Icon className="w-3.5 h-3.5" />
              {result.verdict}
            </Badge>
          </div>
          <ScoreMeter score={score} />
        </CardHeader>
        <CardContent>
          <Card className="border border-border bg-muted/30">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">AI Insight</p>
              <p className="text-sm text-foreground leading-relaxed" data-testid="text-spend-insight">{result.insight}</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SpendRater() {
  const [result, setResult] = useState<SpendRateResult | null>(null);
  const rateSpend = useRateSpend();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { item: "", amount: 0, context: "" },
  });

  function onSubmit(values: FormValues) {
    setResult(null);
    rateSpend.mutate(
      { data: { item: values.item, amount: values.amount, context: values.context || undefined } },
      {
        onSuccess: (data) => {
          setResult(data);
          toast({ title: "Rated!", description: `Score: ${data.score}/10 — ${data.verdict}` });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not rate your spend. Try again.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        eyebrow="AI spend scoring"
        title="Spend Rater"
        description="Drop your purchase details. Get brutally honest AI feedback."
      />

      <Card data-testid="card-spend-form">
        <CardHeader>
          <CardTitle>Rate a Purchase</CardTitle>
          <CardDescription>AI scores your spend 1–10 with a verdict and insight.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What did you buy?</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. new iPhone, dinner at Leila's..." {...field} data-testid="input-spend-item" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (JD)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} data-testid="input-spend-amount" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="context"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Context (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. birthday gift, needed for work..." {...field} data-testid="input-spend-context" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={rateSpend.isPending}
                data-testid="button-spend-submit"
              >
                {rateSpend.isPending ? (
                  <span className="flex items-center gap-2">Analyzing <AiDots /></span>
                ) : (
                  "Rate This Spend"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && <ResultPanel result={result} />}
    </div>
  );
}
