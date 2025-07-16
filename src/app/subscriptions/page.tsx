'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const features = [
  "Access any 20 paid events per month",
  "Ad-free streaming experience",
  "Early access to select events",
  "Exclusive member-only content"
];

export default function SubscriptionsPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const router = useRouter();

    const handleSubscribe = () => {
        if (!user) {
            router.push('/user-login');
            return;
        }
        toast({
            title: "Subscription Successful!",
            description: "Welcome to CloudStage Live Premium."
        })
    }
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Unlock Premium Access
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Elevate your experience with exclusive benefits and unlimited entertainment.
            </p>
      </div>
      <Card className="w-full max-w-md shadow-lg border-2 border-primary">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Premium Plan</CardTitle>
          <CardDescription>Get the best of CloudStage Live.</CardDescription>
          <p className="text-4xl font-bold text-primary pt-4">₹299<span className="text-lg font-normal text-muted-foreground">/month</span></p>
        </CardHeader>
        <CardContent>
            <ul className="space-y-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent" />
                        <span className="text-foreground">{feature}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handleSubscribe}>Subscribe Now</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
