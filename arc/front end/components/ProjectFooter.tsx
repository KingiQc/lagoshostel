import { Link } from "react-router-dom";

const footerGroups = [
  { title: "Explore", links: [["Find hostels", "/find-a-hostel"], ["How it works", "/how-it-works"], ["For universities", "/universities"]] },
  { title: "Company", links: [["About arc()", "/about"], ["Safety", "/safety"], ["Contact", "/contact"]] },
  { title: "Support", links: [["Help centre", "/help"], ["FAQ", "/faq"], ["Log in", "/login"]] },
] as const;

export default function ProjectFooter() {
  return <footer className="border-t border-black/10 bg-[#1c1c1c] text-white">
    <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
      <div><Link to="/" className="font-display text-[25px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></Link><p className="mt-4 max-w-[260px] text-[15px] leading-6 text-white/50">A clearer way for students and property teams to connect around university accommodation.</p></div>
      {footerGroups.map((group) => <div key={group.title}><p className="text-[15px] font-bold uppercase tracking-[.14em] text-white/40">{group.title}</p><nav className="mt-4 flex flex-col items-start gap-3 text-[15px] text-white/70" aria-label={`${group.title} links`}>{group.links.map(([label, href]) => <Link key={href} to={href} className="transition hover:text-white">{label}</Link>)}</nav></div>)}
    </div>
    <div className="mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-white/10 px-5 py-5 text-[15px] text-white/40 sm:flex-row sm:items-center sm:justify-between lg:px-8"><p>© {new Date().getFullYear()} arc(). Built for better student living.</p><div className="flex gap-4"><Link to="/terms" className="hover:text-white">Terms</Link><Link to="/privacy" className="hover:text-white">Privacy</Link></div></div>
  </footer>;
}
