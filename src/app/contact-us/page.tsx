import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
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
        If you have any questions or need assistance, please feel free to reach out to us.
        <br />
        Our support team is available from 9 AM to 6 PM IST, Monday to Friday.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6 text-primary"/>
                    <span>Johnson Prabhakar J</span>
                </CardTitle>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="w-6 h-6 text-primary"/>
                    <span>Email Us</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <a href="mailto:support@cloudstage.in" className="text-primary font-semibold hover:underline">support@cloudstage.in</a>
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
                <a href="tel:+918217659321" className="text-primary font-semibold hover:underline">+91 8217659321</a>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}