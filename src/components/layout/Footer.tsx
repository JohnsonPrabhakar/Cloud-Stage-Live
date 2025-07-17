
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-6">
          <p className="text-sm text-muted-foreground text-center md:text-left mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CloudStage. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/contact-us" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
            <Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-foreground">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
