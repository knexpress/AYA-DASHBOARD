import Link from 'next/link';
import { MessageCircleHeart } from 'lucide-react'; // Or a more fitting logo icon

export function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <MessageCircleHeart className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
      <span className="text-xl font-headline font-semibold text-foreground whitespace-nowrap group-data-[state=collapsed]:hidden">
        AYA Admin
      </span>
    </Link>
  );
}
