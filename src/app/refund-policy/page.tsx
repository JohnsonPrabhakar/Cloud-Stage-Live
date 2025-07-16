import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
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
        <h1 className="font-headline">Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: July 8, 2024</p>
        <p>
          Thank you for purchasing a ticket on CloudStage. We appreciate your support for the artists on our platform.
        </p>

        <h2 className="font-headline">Cancellations &amp; Refunds</h2>
        <p>
          All ticket sales are final. We do not offer refunds or exchanges for purchased tickets, including for events that are rescheduled.
        </p>
        <p>
          If an event is cancelled by the artist or CloudStage, a full refund will be automatically processed to your original payment method within 5-7 business days. You will be notified via email if an event you have a ticket for is cancelled.
        </p>
        
        <h2 className="font-headline">Contact Us</h2>
        <p>
          If you have any questions about our Refund Policy, please contact us at <a href="mailto:support@cloudstage.in">support@cloudstage.in</a>.
        </p>
      </div>
    </div>
  );
}