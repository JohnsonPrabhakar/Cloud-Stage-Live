import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="mb-8">
            <Button asChild variant="outline">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </Button>
      </div>
      <div className="prose lg:prose-xl dark:prose-invert mx-auto">
        <h1 className="font-headline">Terms and Conditions</h1>
        <p className="text-sm text-muted-foreground">Last updated: July 8, 2024</p>
        <p>
          Welcome to CloudStage. By accessing or using our platform, you agree to be bound by the following terms:
        </p>
        
        <h2 className="font-headline">1. Embedded Content Usage:</h2>
        <ul>
            <li>CloudStage currently uses YouTube embedded videos in the Movies section purely for viewership.</li>
            <li>All rights and ownership of such videos remain with YouTube or the original content owners.</li>
            <li>CloudStage does not claim ownership or control over any embedded video content and is not liable for any copyright issues associated with such third-party content.</li>
        </ul>

        <h2 className="font-headline">2. Live Events:</h2>
        <ul>
            <li>All events hosted on CloudStage are streamed and organized by registered users (artists or performers).</li>
            <li>CloudStage serves only as a technology platform to host and distribute live content.</li>
            <li>CloudStage shall not be held responsible for the accuracy, appropriateness, or legality of any live content streamed by users.</li>
        </ul>

        <h2 className="font-headline">3. User Conduct:</h2>
        <ul>
            <li>Users agree to use the platform in a respectful and lawful manner.</li>
            <li>Any abusive, harmful, or illegal behavior (including in chat, comments, or uploads) will result in account suspension.</li>
            <li>Users are fully responsible for their actions and interactions on the platform.</li>
        </ul>
        
        <h2 className="font-headline">4. Service Modifications:</h2>
        <ul>
            <li>CloudStage is currently in a testing phase. Features may change or evolve over time.</li>
            <li>CloudStage reserves the right to modify or discontinue any part of the service temporarily or permanently without prior notice.</li>
        </ul>

        <h2 className="font-headline">5. Disclaimers:</h2>
        <ul>
            <li>The CloudStage platform is provided "as is" and "as available" without warranties of any kind.</li>
            <li>We do not guarantee uninterrupted service or platform uptime during the testing phase.</li>
        </ul>
      </div>
    </div>
  );
}
