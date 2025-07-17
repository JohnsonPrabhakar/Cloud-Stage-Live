
import Link from 'next/link';
import { Logo } from '../Logo';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your stage, anywhere. Discover and stream exclusive live events from artists around the world.
            </p>
          </div>
          <div className="md:col-start-3 space-y-2">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/contact-us" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="/artist-register" className="text-sm text-muted-foreground hover:text-foreground">Become an Artist</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms-and-conditions" className="text-sm text-muted-foreground hover:text-foreground">Terms & Conditions</Link></li>
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-sm text-muted-foreground hover:text-foreground">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center">
           <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CloudStage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
