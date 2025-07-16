import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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
        <h1 className="font-headline">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last Updated: July 16, 2025</p>
        <p>
          CloudStage (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform via our website or services. By accessing or using CloudStage, you agree to the terms of this Privacy Policy.
        </p>

        <h2 className="font-headline">1. Information We Collect</h2>
        <p>We may collect the following personal data:</p>
        <ul>
            <li><strong>Users:</strong> Name, email address, phone number, ticket purchases, viewing history.</li>
            <li><strong>Artists:</strong> Name, profile details, category (musician, comedian, etc.), uploaded event content, and banking details for payouts.</li>
            <li><strong>Technical:</strong> Device data, IP address, browser type, access times, cookies.</li>
        </ul>

        <h2 className="font-headline">2. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
            <li>Deliver services and process ticket purchases</li>
            <li>Provide customer support</li>
            <li>Monitor event engagement</li>
            <li>Prevent fraud and abuse</li>
            <li>Notify users of changes, events, or updates</li>
            <li>Ensure compliance with laws and platform policies</li>
        </ul>

        <h2 className="font-headline">3. Artist Content &amp; Liability Disclaimer</h2>
        <p>CloudStage acts solely as a technology platform to host and distribute live performances and movies by independent artists. We do not own, endorse, or control the content of artist performances.</p>
        <ul>
            <li>Artists are fully responsible for the legality of their content, including:
                <ul>
                    <li>Copyrighted music or material (songs, jokes, visuals)</li>
                    <li>Profanity, obscenity, or hate speech</li>
                    <li>Any illegal or unauthorized behavior in a performance</li>
                </ul>
            </li>
            <li>Any claims, takedown notices, or legal proceedings resulting from an artist’s event will be solely directed to the artist and not CloudStage.</li>
        </ul>

        <h2 className="font-headline">4. User Behavior &amp; Responsibilities</h2>
        <ul>
            <li>Users must behave respectfully and lawfully while interacting with events, artists, and others on the platform.</li>
            <li>Hate speech, harassment, abusive language, or illegal activity (e.g., recording or rebroadcasting without permission) is strictly prohibited.</li>
            <li>CloudStage reserves the right to block, remove, or report users violating these terms.</li>
        </ul>

        <h2 className="font-headline">5. Payments &amp; Third Parties</h2>
        <ul>
            <li>All transactions are processed via third-party payment gateways (e.g., Cashfree).</li>
            <li>CloudStage does not store sensitive payment information like card numbers or CVV.</li>
            <li>All transactions are subject to the third party’s respective privacy and refund policies.</li>
        </ul>

        <h2 className="font-headline">6. Security</h2>
        <p>We take security seriously and implement industry-standard measures to protect your data. However, no platform can guarantee 100% security, and you acknowledge the inherent risks.</p>

        <h2 className="font-headline">7. Data Retention</h2>
        <p>We retain user and artist data only as long as necessary for legitimate business and legal purposes, unless you request deletion.</p>

        <h2 className="font-headline">8. Children’s Privacy</h2>
        <p>CloudStage is not intended for use by children under 13 years of age. If you are a parent or guardian and believe your child has used the platform, please contact us for removal.</p>

        <h2 className="font-headline">9. Your Rights</h2>
        <p>You may request:</p>
        <ul>
            <li>Access to your data</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your account</li>
        </ul>
        <p>To do so, please contact us via our support page or email.</p>

        <h2 className="font-headline">10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically. Continued use of CloudStage indicates acceptance of these terms.</p>

        <h2 className="font-headline">11. Contact Us</h2>
        <p>If you have questions, email us at: <a href="mailto:support@cloudstage.live">support@cloudstage.live</a></p>
      </div>
    </div>
  );
}