import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, type LucideIcon } from "lucide-react";

export type DashboardNavItem = readonly [string, LucideIcon, string];

type DashboardNavProps = {
  path: string;
  roleLabel: string;
  workspaceTitle: string;
  nav: readonly DashboardNavItem[];
};

function NavLinks({ nav, path, onNavigate, mobile = false }: { nav: readonly DashboardNavItem[]; path: string; onNavigate?: () => void; mobile?: boolean }) {
  return <>
    {nav.map(([href, Icon, label]) => <Link key={href} to={href} onClick={onNavigate} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-3 ${mobile ? "text-[18px]" : "text-[15px]"} font-bold transition-colors ${mobile ? (path === href ? "border-[#f5b544] bg-[#f5b544] text-black" : "border-white/25 bg-transparent text-white hover:border-[#f5b544] hover:text-[#f5b544]") : (path === href ? "border-black bg-black text-white" : "border-gray-400 bg-white text-black hover:bg-black hover:text-white")}`}><Icon className="h-4 w-4" />{label}</Link>)}
  </>;
}

export default function DashboardNav({ path, roleLabel, workspaceTitle, nav }: DashboardNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  return <header className="relative z-40 border-b border-gray-400 bg-white text-black shadow-sm">
    <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between gap-4 px-5 lg:px-8">
      <Link to="/" className="font-display text-[25px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></Link>
      <span className="hidden text-[15px] font-bold text-black/65 sm:block">{roleLabel}</span>
      <button type="button" aria-label={menuOpen ? "Close dashboard navigation" : "Open dashboard navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="rounded-full border border-gray-400 p-3 transition-transform hover:bg-black hover:text-white lg:hidden">
        <span key={menuOpen ? "close" : "open"} className="menu-icon-swap block">{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</span>
      </button>
    </div>
    <div className="hidden border-t border-gray-400 bg-white lg:block">
      <div className="mx-auto flex max-w-[1240px] items-center gap-3 overflow-x-auto px-5 py-3 lg:px-8">
        <span className="mr-2 shrink-0 text-[15px] font-extrabold">{workspaceTitle}</span>
        <nav aria-label={`${roleLabel} navigation`} className="flex min-w-max items-center gap-2"><NavLinks nav={nav} path={path} /></nav>
      </div>
    </div>
    {menuOpen && <div className="fixed left-0 top-[74px] z-50 h-[calc(100vh-74px)] w-[min(88vw,380px)] overflow-y-auto border-r border-white/20 bg-black p-5 text-white shadow-2xl lg:hidden">
      <p className="text-[15px] font-bold uppercase tracking-[.14em] text-[#f5b544]">{roleLabel}</p>
      <p className="mt-2 text-[18px] font-extrabold">{workspaceTitle}</p>
      <nav aria-label={`${roleLabel} mobile navigation`} className="mt-7 flex flex-col gap-3"><NavLinks nav={nav} path={path} mobile onNavigate={() => setMenuOpen(false)} /></nav>
      <Link to="/" onClick={() => setMenuOpen(false)} className="mt-8 inline-flex items-center rounded-full border border-white/40 px-4 py-3 text-[15px] font-bold text-white">Exit workspace</Link>
    </div>}
  </header>;
}
