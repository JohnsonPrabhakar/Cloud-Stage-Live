
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle2, PartyPopper } from "lucide-react"
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const features = [
  "Access any 20 paid events per month",
  "Ad-free streaming experience",
  "Early access to select events",
  "Exclusive member-only content"
];

export default function SubscriptionsPage() {
    const { user, subscribeUser } = useAuth();
    const router = useRouter();

    const handleSubscribe = () => {
        if (!user) {
            router.push('/user-login');
            return;
        }
        subscribeUser();
    }

    const isSubscribed = user?.subscription && user.subscription.expiryDate > new Date();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md mb-8 self-start container">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
        </div>
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            {isSubscribed ? "You are a Premium Member" : "Unlock Premium Access"}
            </h1>
            <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            {isSubscribed ? `Your plan is active and renews on ${user.subscription?.expiryDate.toLocaleDateString()}.` : "Elevate your experience with exclusive benefits and unlimited entertainment."}
            </p>
      </div>

      {isSubscribed ? (
        <Alert className="max-w-md">
          <PartyPopper className="h-4 w-4" />
          <AlertTitle>Welcome, Premium Member!</AlertTitle>
          <AlertDescription>
            You have {user.subscription?.eventCount} event credits remaining this month. Enjoy the show!
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="w-full max-w-md shadow-lg border-2 border-primary">
            <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">Premium Plan</CardTitle>
            <CardDescription>Get the best of CloudStage Live.</CardDescription>
            <p className="text-4xl font-bold text-primary pt-4">Rs. 299<span className="text-lg font-normal text-muted-foreground">/month</span></p>
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
      )}

    </div>
  )
}
