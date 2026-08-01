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
import { useHuntPrices } from "@workspace/api-client-react";
import type { PriceHuntResult, PriceStore } from "@workspace/api-client-react";
import { Search, Store, Globe, ArrowUpDown } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const schema = z.object({
  query: z.string().min(2, "Enter a product to search"),
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

function StoreRow({ store, isCheapest }: { store: PriceStore; isCheapest: boolean }) {
  const isOnline = store.type.toLowerCase().includes("online") || store.type.toLowerCase().includes("amazon") || store.type.toLowerCase().includes("noon");
  return (
    <div
      className="flex items-start justify-between py-3 border-b border-border last:border-0"
      data-testid={`row-store-${store.name.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <div className="p-1.5 rounded-md bg-muted shrink-0 mt-0.5">
          {isOnline ? <Globe className="w-3.5 h-3.5 text-muted-foreground" /> : <Store className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{store.name}</p>
          <p className="text-xs text-muted-foreground">{store.type}</p>
          {store.note && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{store.note}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        {isCheapest && (
          <Badge variant="default" className="text-xs">Best</Badge>
        )}
        <span className="text-sm font-bold text-foreground" data-testid={`text-price-${store.name}`}>
          {store.price} JD
        </span>
      </div>
    </div>
  );
}

function ResultPanel({ result }: { result: PriceHuntResult }) {
  const sorted = [...result.stores].sort((a, b) => a.price - b.price);
  const cheapestPrice = sorted[0]?.price;

  return (
    <div className="space-y-4 mt-6">
      <Card data-testid="card-price-result">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base" data-testid="text-price-title">{result.title}</CardTitle>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpDown className="w-3.5 h-3.5" />
              {result.stores.length} stores
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
            {sorted.map((store) => (
              <StoreRow
                key={store.name}
                store={store}
                isCheapest={store.price === cheapestPrice}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-price-tip">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">AI Tip</p>
          <p className="text-sm text-foreground leading-relaxed" data-testid="text-price-tip">{result.tip}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PriceHunter() {
  const [result, setResult] = useState<PriceHuntResult | null>(null);
  const huntPrices = useHuntPrices();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { query: "" },
  });

  function onSubmit(values: FormValues) {
    setResult(null);
    huntPrices.mutate(
      { data: { query: values.query } },
      {
        onSuccess: (data) => {
          setResult(data);
          toast({ title: "Prices found!", description: `${data.stores.length} stores compared.` });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not hunt prices. Try again.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <div className="min-h-[100dvh] max-w-2xl mx-auto px-4 py-8">
      <PageHeader
        eyebrow="Price comparison"
        title="Price Hunter"
        description="Compare prices across Amman stores and online. Find the real deal."
      />

      <Card data-testid="card-price-form">
        <CardHeader>
          <CardTitle>Search for a Product</CardTitle>
          <CardDescription>AI scans local and online stores across Jordan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. iPhone 15, Nike Air Force 1, Sony WH-1000XM5..."
                        {...field}
                        data-testid="input-price-query"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={huntPrices.isPending}
                data-testid="button-price-search"
              >
                {huntPrices.isPending ? (
                  <span className="flex items-center gap-2">Hunting prices <AiDots /></span>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Hunt Prices
                  </>
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
