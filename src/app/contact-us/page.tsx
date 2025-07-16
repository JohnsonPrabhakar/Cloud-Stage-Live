import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function ContactUsPage() {
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
      <h1 className="text-4xl font-headline font-bold text-center mb-8">Contact Us</h1>
      <p className="text-center text-lg text-muted-foreground mb-12">
        We'd love to hear from you. Reach out with any questions or feedback.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-primary"/>
                    <span>Email Us</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>For general inquiries, please email us at:</p>
                <a href="mailto:support@cloudstage.live" className="text-primary font-semibold hover:underline">support@cloudstage.live</a>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Phone className="w-6 h-6 text-primary"/>
                    <span>Call Us</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>Our support team is available Mon-Fri, 9am-5pm.</p>
                <a href="tel:+1234567890" className="text-primary font-semibold hover:underline">+1 (234) 567-890</a>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
