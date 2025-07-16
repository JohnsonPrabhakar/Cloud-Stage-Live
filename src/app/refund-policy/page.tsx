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
        <p className="lead">
          Thank you for purchasing tickets on CloudStage Live. We appreciate your support for the artists on our platform.
        </p>
        <h2 className="font-headline">Event Tickets</h2>
        <p>
          All sales for live event tickets are final. Refunds are generally not provided unless an event is canceled by the artist or CloudStage Live.
        </p>
        <p>
          If an event is canceled, you will be notified via email and a full refund will be processed to your original payment method within 5-7 business days.
        </p>
        <h2 className="font-headline">Subscriptions</h2>
        <p>
          Subscription fees are non-refundable. You may cancel your subscription at any time, and you will continue to have access to premium features until the end of your current billing period. No partial refunds will be issued.
        </p>
        <p>This is a placeholder document. For a real application, you would need to consult with a legal professional to draft a complete and compliant Refund Policy.</p>
      </div>
    </div>
  );
}
