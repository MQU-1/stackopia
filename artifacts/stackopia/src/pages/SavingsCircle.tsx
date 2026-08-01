import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/stackopia-ds/components/ui/card";
import { Button } from "@workspace/stackopia-ds/components/ui/button";
import { Input } from "@workspace/stackopia-ds/components/ui/input";
import { Badge } from "@workspace/stackopia-ds/components/ui/badge";
import { Progress } from "@workspace/stackopia-ds/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/stackopia-ds/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/stackopia-ds/components/ui/form";
import { Skeleton } from "@workspace/stackopia-ds/components/ui/skeleton";
import { toast } from "@workspace/stackopia-ds/hooks/use-toast";
import {
  useListSavingsCircles,
  useCreateSavingsCircle,
  useAddContribution,
  getListSavingsCirclesQueryKey,
} from "@workspace/api-client-react";
import type { SavingsCircle } from "@workspace/api-client-react";
import { Plus, PiggyBank, Target } from "lucide-react";
import { cn } from "@workspace/stackopia-ds/lib/utils";
import { PageHeader } from "../components/PageHeader";

// Schemas
const createSchema = z.object({
  name: z.string().min(1, "Name required"),
  goalName: z.string().min(1, "Goal name required"),
  goalAmount: z.coerce.number().min(1, "Goal amount must be positive"),
  deadline: z.string().min(1, "Deadline required"),
});

const contributionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive"),
});

type CreateValues = z.infer<typeof createSchema>;
type ContributionValues = z.infer<typeof contributionSchema>;

function AiDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function ContributeDialog({ circle }: { circle: SavingsCircle }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const addContribution = useAddContribution();

  const form = useForm<ContributionValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { amount: 0 },
  });

  function onSubmit(values: ContributionValues) {
    addContribution.mutate(
      { id: circle.id, data: { amount: values.amount } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSavingsCirclesQueryKey() });
          toast({ title: "Contribution added!", description: `${values.amount} JD added to ${circle.name}` });
          setOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Could not add contribution.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" data-testid={`button-contribute-${circle.id}`}>
          <Plus className="w-3.5 h-3.5 mr-1" />
          Contribute
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to {circle.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (JD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} data-testid="input-contribution-amount" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={addContribution.isPending} data-testid="button-contribution-submit">
              {addContribution.isPending ? <span className="flex items-center gap-2">Saving <AiDots /></span> : "Add Contribution"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CircleCard({ circle }: { circle: SavingsCircle }) {
  const pct = Math.min((circle.savedAmount / circle.goalAmount) * 100, 100);
  const daysLeft = Math.ceil((new Date(circle.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isComplete = circle.savedAmount >= circle.goalAmount;

  return (
    <Card data-testid={`card-circle-${circle.id}`} className={cn(isComplete && "border-primary/50")}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{circle.name}</CardTitle>
          {isComplete && <Badge variant="default">Complete</Badge>}
          {!isComplete && daysLeft <= 7 && daysLeft > 0 && <Badge variant="destructive">{daysLeft}d left</Badge>}
        </div>
        <CardDescription className="flex items-center gap-1">
          <Target className="w-3.5 h-3.5" />
          {circle.goalName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="border border-border bg-muted/30 mb-4">
          <CardContent className="p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Saved</span>
              <span className="font-semibold text-foreground">
                {circle.savedAmount} JD
                <span className="text-muted-foreground font-normal"> / {circle.goalAmount} JD</span>
              </span>
            </div>
            <Progress value={pct} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">{pct.toFixed(0)}%</p>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Deadline: {new Date(circle.deadline).toLocaleDateString("en-JO", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          {!isComplete && <ContributeDialog circle={circle} />}
        </div>
      </CardContent>
    </Card>
  );
}

function CreateCircleDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const createCircle = useCreateSavingsCircle();

  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", goalName: "", goalAmount: 0, deadline: "" },
  });

  function onSubmit(values: CreateValues) {
    createCircle.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListSavingsCirclesQueryKey() });
          toast({ title: "Circle created!", description: `${values.name} is ready to stack.` });
          setOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Could not create circle.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-circle">
          <Plus className="w-4 h-4 mr-1" />
          New Circle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Savings Circle</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circle Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Car Fund, Emergency Stash" {...field} data-testid="input-circle-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Buy a car, Trip to Istanbul" {...field} data-testid="input-circle-goal-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Amount (JD)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="1" placeholder="5000" {...field} data-testid="input-circle-goal-amount" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-circle-deadline" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={createCircle.isPending} data-testid="button-create-circle-submit">
              {createCircle.isPending ? <span className="flex items-center gap-2">Creating <AiDots /></span> : "Create Circle"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function SavingsCirclePage() {
  const { data: circles, isLoading, isError, refetch } = useListSavingsCircles();

  return (
    <div className="min-h-[100dvh] max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8 gap-4">
        <PageHeader
          eyebrow="Goal-based saving"
          title="Savings Circles"
          description="Goal-based circles that keep you accountable."
        />
        <div className="shrink-0">
          <CreateCircleDialog />
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} data-testid={`skeleton-circle-${i}`}>
              <CardHeader>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full mb-3 rounded-lg" />
                <Skeleton className="h-8 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card data-testid="card-circles-error">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Could not load your circles.</p>
            <Button variant="outline" onClick={() => refetch()} data-testid="button-circles-retry">Retry</Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && circles?.length === 0 && (
        <Card data-testid="card-circles-empty">
          <CardContent className="p-12 text-center">
            <PiggyBank className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-foreground mb-1">No circles yet</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first savings circle and start stacking.</p>
            <CreateCircleDialog />
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && circles && circles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {circles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
        </div>
      )}
    </div>
  );
}
