import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, ListChecks, AlertTriangle, FilePenLine, Star, DownloadCloud } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/faq-tracker', label: 'FAQs', icon: ListChecks },
  { href: '/fallback-log', label: 'Unanswered Questions', icon: AlertTriangle },
  { href: '/response-editor', label: 'Response Editor', icon: FilePenLine },
  { href: '/response-grader', label: 'Response Grader', icon: Star },
  { href: '/data-export', label: 'Data Export', icon: DownloadCloud },
];

