import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Home,
  LogOut,
  Mail,
  MessageCircle,
  UserRound,
  Wrench,
} from "lucide-react";

type ApplicationRecord = {
  id: string;
  hostelName: string;
  hostelLocation: string;
  roomName: string;
  roomPrice: string;
  moveInDate: string;
  submittedAt: string;
  status: "submitted";
};

const nav = [
  ["/student", Home, "Overview"],
  ["/student/applications", FileText, "Applications"],
  ["/student/bookings", CheckCircle2, "Bookings"],
  ["/student/payments", CreditCard, "Payments"],
  ["/student/messages", MessageCircle, "Messages"],
  ["/student/notifications", Bell, "Notifications"],
  ["/student/profile", UserRound, "Profile"],
  ["/student/maintenance", Wrench, "Maintenance"],
] as const;

const content: Record<string, [string, string]> = {
  "/student/applications": ["Applications", "Applications you submit will appear here."],
  "/student/payments": ["Payments", "Your completed and pending transactions will appear here."],
  "/student/messages": ["Messages", "Conversations with hostel teams will appear here."],
  "/student/notifications": ["Notifications", "Updates about applications, bookings, and your account will appear here."],
  "/student/profile": ["Profile & preferences", "Keep your contact details and accommodation preferences current."],
  "/student/maintenance": ["Maintenance", "Report and track issues with your accommodation."],
};

const storageKey = "arc.student.application";

function readApplication(): ApplicationRecord | null {
  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as ApplicationRecord) : null;
  } catch {
    return null;
  }
}

function formatDate(value: string) {
  if (!value) return "Not selected";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(`${value}T12:00:00`));
}

function Shell({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#171717]">
      <header className="border-b border-white/10 bg-black text-white">
        <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5 lg:px-8">
          <Link to="/" className="font-display text-[25px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></Link>
          <div className="flex items-center gap-3"><span className="hidden text-xs text-white/50 sm:block">Student space</span><Link to="/student" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">Dashboard</Link></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-8 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="hidden lg:block"><p className="eyebrow">Student space</p><h2 className="mt-2 font-display text-xl font-extrabold">My arc()</h2><nav className="mt-8 space-y-1">{nav.map(([href, Icon, label]) => <Link key={href} to={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${path === href ? "bg-black text-white" : "text-black/55 hover:bg-white"}`}><Icon className="h-4 w-4" />{label}</Link>)}</nav><Link to="/" className="mt-16 flex items-center gap-3 px-3 text-xs font-bold text-black/40"><LogOut className="h-4 w-4" /> Log out</Link></aside>
        <main><Link to="/student" className="mb-6 inline-flex items-center text-xs font-bold text-black/45 hover:text-black"><ArrowRight className="mr-2 h-4 w-4 rotate-180" /> Overview</Link><p className="eyebrow">Student space</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">{content[path]?.[0] ?? "Student space"}</h1><p className="mt-3 text-sm text-black/50">{content[path]?.[1]}</p>{children}</main>
      </div>
    </div>
  );
}

function Applications({ application }: { application: ApplicationRecord | null }) {
  if (!application) return <Empty title="Applications" path="/student/applications" />;
  return <section className="mt-8 rounded-2xl border border-black/10 bg-white p-5 sm:p-7"><div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold text-black/45">Active application</p><h2 className="mt-1 font-display text-2xl font-extrabold">{application.hostelName}</h2><p className="mt-1 text-sm text-black/50">{application.hostelLocation} · {application.roomName}</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff4d6] px-3 py-2 text-[11px] font-bold text-[#8a5d00]"><span className="h-2 w-2 rounded-full bg-[#d19a20]" /> Submitted</span></div><div className="mt-6 grid gap-5 sm:grid-cols-3"><div><p className="text-xs font-bold text-black/45">Move-in date</p><p className="mt-1 text-sm font-bold">{formatDate(application.moveInDate)}</p></div><div><p className="text-xs font-bold text-black/45">Application ID</p><p className="mt-1 text-sm font-bold">{application.id}</p></div><div><p className="text-xs font-bold text-black/45">Submitted</p><p className="mt-1 text-sm font-bold">{formatDate(application.submittedAt.slice(0, 10))}</p></div></div><div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-[#f7f6f3] p-4 sm:flex-row sm:items-center"><p className="max-w-xl text-xs leading-5 text-black/55">The hostel team will review your details and contact you when there is an update.</p><Link to={`/student/applications/${application.id}`} className="inline-flex w-fit items-center rounded-full bg-black px-4 py-3 text-xs font-bold text-white">View application <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section>;
}

function Empty({ title, path }: { title: string; path: string }) {
  const copy = path === "/student/applications" ? "Search verified hostels and submit an application to see it tracked here." : path === "/student/payments" ? "There are no payment records yet. Your receipts will be stored here after checkout." : path === "/student/messages" ? "When you contact a hostel, your conversation will show up here." : "You’re all caught up. New updates will appear here when something needs your attention.";
  return <section className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4d6] text-[#a36500]">{path === "/student/payments" ? <CreditCard /> : path === "/student/messages" ? <Mail /> : <FileText />}</div><h2 className="mt-5 font-display text-2xl font-extrabold">No {title.toLowerCase()} yet</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/50">{copy}</p>{(path === "/student/applications" || path === "/student/messages") && <Link to="/find-a-hostel" className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-xs font-bold text-white">Find a hostel <ArrowRight className="ml-2 h-4 w-4" /></Link>}</section>;
}

function Profile() { return <form onSubmit={(event) => event.preventDefault()} className="mt-8 max-w-2xl rounded-2xl border border-black/10 bg-white p-6 sm:p-8"><div className="flex items-center gap-4 border-b border-black/10 pb-6"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5b544] text-lg font-bold">?</div><div><h2 className="font-display text-xl font-extrabold">Your personal details</h2><p className="mt-1 text-xs text-black/45">Complete your profile before applying for accommodation.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">First name<input required className="auth-input" placeholder="First name" /></label><label className="text-xs font-bold">Last name<input required className="auth-input" placeholder="Last name" /></label><label className="text-xs font-bold sm:col-span-2">Email address<input required type="email" className="auth-input" placeholder="you@example.com" /></label><label className="text-xs font-bold">University<input className="auth-input" placeholder="Your university" /></label><label className="text-xs font-bold">Phone number<input className="auth-input" placeholder="0800 000 0000" /></label></div><button className="mt-6 rounded-full bg-black px-5 py-3 text-xs font-bold text-white">Save profile</button></form>; }

function Maintenance() { const [sent, setSent] = useState(false); if (sent) return <section className="mt-8 rounded-2xl border border-black/10 bg-white p-12 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-[#1f9d55]" /><h2 className="mt-4 font-display text-2xl font-extrabold">Request submitted</h2><p className="mt-2 text-sm text-black/50">Your accommodation team will respond when they’ve reviewed the issue.</p><button onClick={() => setSent(false)} className="mt-6 rounded-full border border-black/15 px-5 py-3 text-xs font-bold">Report another issue</button></section>; return <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="mt-8 max-w-2xl rounded-2xl border border-black/10 bg-white p-6 sm:p-8"><div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-[#a36500]" /><h2 className="font-display text-xl font-extrabold">Report an issue</h2></div><div className="mt-6 space-y-4"><label className="block text-xs font-bold">Issue type<select required className="auth-input"><option value="">Select an issue</option><option>Power</option><option>Water</option><option>Room repair</option><option>Security</option><option>Other</option></select></label><label className="block text-xs font-bold">Description<textarea required className="mt-1 h-32 w-full rounded-xl border border-black/15 p-3 text-sm outline-none" placeholder="Tell us what needs attention..." /></label><label className="block text-xs font-bold">Preferred access time<input type="text" className="auth-input" placeholder="e.g. Weekdays after 4pm" /></label></div><button className="mt-6 rounded-full bg-black px-5 py-3 text-xs font-bold text-white">Submit request</button></form>; }

export default function StudentOperations() {
  const path = useLocation().pathname;
  const [application, setApplication] = useState<ApplicationRecord | null>(null);
  useEffect(() => setApplication(readApplication()), []);
  const [title] = content[path] ?? ["Student space", "Manage your accommodation journey."];
  return <Shell path={path}>{path === "/student/applications" ? <Applications application={application} /> : path === "/student/profile" ? <Profile /> : path === "/student/maintenance" ? <Maintenance /> : <Empty title={title} path={path} />}</Shell>;
}
