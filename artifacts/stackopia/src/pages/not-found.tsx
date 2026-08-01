import { Card, CardContent } from "@workspace/stackopia-ds/components/ui/card";
import { Button } from "@workspace/stackopia-ds/components/ui/button";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground">
              404 Not Found
            </h1>
          </div>
          <Card className="border border-border bg-muted/30 mb-4">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                This page doesn't exist. You may have mistyped the URL.
              </p>
            </CardContent>
          </Card>
          <Link href="/">
            <Button className="w-full" data-testid="button-go-home">
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
