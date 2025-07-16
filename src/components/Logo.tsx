import Link from 'next/link';
import { Clapperboard } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Clapperboard className="h-8 w-8 text-primary" />
      <span className="text-2xl font-headline font-bold text-primary">
        CloudStage Live
      </span>
    </Link>
  );
}
