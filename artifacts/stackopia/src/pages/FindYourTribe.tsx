import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/stackopia-ds/components/ui/card";
import { Button } from "@workspace/stackopia-ds/components/ui/button";
import { Input } from "@workspace/stackopia-ds/components/ui/input";
import { Badge } from "@workspace/stackopia-ds/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/stackopia-ds/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/stackopia-ds/components/ui/form";
import { Skeleton } from "@workspace/stackopia-ds/components/ui/skeleton";
import { toast } from "@workspace/stackopia-ds/hooks/use-toast";
import {
  useListTribes,
  useCreateTribeProfile,
  getListTribesQueryKey,
} from "@workspace/api-client-react";
import type { TribeProfile } from "@workspace/api-client-react";
import { Users, Plus, MapPin, Target, Search, X } from "lucide-react";
import { PageHeader } from "../components/PageHeader";

const createSchema = z.object({
  name: z.string().min(1, "Name required"),
  goal: z.string().min(1, "Goal required"),
  city: z.string().min(1, "City required"),
  bio: z.string().optional(),
});

type CreateValues = z.infer<typeof createSchema>;

function AiDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

function TribeCard({ profile }: { profile: TribeProfile }) {
  return (
    <Card data-testid={`card-tribe-${profile.id}`} className="hover:border-primary/40 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base" data-testid={`text-tribe-name-${profile.id}`}>{profile.name}</CardTitle>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{profile.city}</span>
            </div>
          </div>
          <Badge variant="secondary" className="flex items-center gap-1 text-xs shrink-0">
            <Target className="w-3 h-3" />
            {profile.goal}
          </Badge>
        </div>
      </CardHeader>
      {profile.bio && (
        <CardContent className="pt-0">
          <Card className="border border-border bg-muted/30">
            <CardContent className="p-3">
              <p className="text-sm text-foreground leading-relaxed" data-testid={`text-tribe-bio-${profile.id}`}>{profile.bio}</p>
            </CardContent>
          </Card>
        </CardContent>
      )}
    </Card>
  );
}

function CreateProfileDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const createProfile = useCreateTribeProfile();

  const form = useForm<CreateValues>({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", goal: "", city: "", bio: "" },
  });

  function onSubmit(values: CreateValues) {
    createProfile.mutate(
      { data: { name: values.name, goal: values.goal, city: values.city, bio: values.bio || undefined } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListTribesQueryKey() });
          toast({ title: "Profile created!", description: "You are now part of the tribe." });
          setOpen(false);
          form.reset();
        },
        onError: () => {
          toast({ title: "Error", description: "Could not create profile.", variant: "destructive" });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-profile">
          <Plus className="w-4 h-4 mr-1" />
          Join Tribe
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Profile</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} data-testid="input-tribe-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Financial Goal</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. FIRE by 35, Buy a house, Travel fund" {...field} data-testid="input-tribe-goal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Amman, Zarqa, Irbid" {...field} data-testid="input-tribe-city" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="A sentence about your money mindset" {...field} data-testid="input-tribe-bio" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={createProfile.isPending} data-testid="button-create-profile-submit">
              {createProfile.isPending ? <span className="flex items-center gap-2">Creating <AiDots /></span> : "Create Profile"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default function FindYourTribe() {
  const [cityFilter, setCityFilter] = useState("");
  const [goalFilter, setGoalFilter] = useState("");

  const params = {
    ...(cityFilter.trim() ? { city: cityFilter.trim() } : {}),
    ...(goalFilter.trim() ? { goal: goalFilter.trim() } : {}),
  };

  const { data: tribes, isLoading, isError, refetch } = useListTribes(
    Object.keys(params).length > 0 ? params : undefined
  );

  function clearFilters() {
    setCityFilter("");
    setGoalFilter("");
  }

  const hasFilters = cityFilter.trim() || goalFilter.trim();

  return (
    <div className="min-h-[100dvh] max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-8 gap-4">
        <PageHeader
          eyebrow="Community"
          title="Find Your Tribe"
          description="Connect with Jordanians working toward the same financial goals."
        />
        <div className="shrink-0">
          <CreateProfileDialog />
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6" data-testid="card-tribe-filters">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="pl-9"
                data-testid="input-filter-city"
              />
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter by goal..."
                value={goalFilter}
                onChange={(e) => setGoalFilter(e.target.value)}
                className="pl-9"
                data-testid="input-filter-goal"
              />
            </div>
            {hasFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} data-testid="button-clear-filters">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} data-testid={`skeleton-tribe-${i}`}>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Card data-testid="card-tribe-error">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Could not load tribe profiles.</p>
            <Button variant="outline" onClick={() => refetch()} data-testid="button-tribe-retry">Retry</Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && tribes?.length === 0 && (
        <Card data-testid="card-tribe-empty">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-semibold text-foreground mb-1">
              {hasFilters ? "No profiles match your filter" : "No tribe members yet"}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {hasFilters ? "Try adjusting your filters." : "Be the first to join the tribe."}
            </p>
            {!hasFilters && <CreateProfileDialog />}
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters-empty">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && tribes && tribes.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground mb-4" data-testid="text-tribe-count">
            {tribes.length} member{tribes.length !== 1 ? "s" : ""}
            {hasFilters ? " matching your filter" : " in the tribe"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tribes.map((profile) => (
              <TribeCard key={profile.id} profile={profile} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
