import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardFooter from "@/components/DashboardFooter";
import DashboardHero from "@/components/DashboardHero";
import DashboardNav from "@/components/DashboardNav";
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  Star,
} from "lucide-react";

type Room = { name: string; beds: number; price: string };
type PropertyDraft = { step?: number; property?: { name?: string; city?: string; area?: string }; photos?: string[]; amenities?: string[]; rooms?: Room[]; status?: string };

const nav = [["/owner/dashboard", LayoutDashboard, "Overview"], ["/owner/properties", Building2, "Properties"], ["/owner/rooms", BedDouble, "Rooms & beds"], ["/owner/applications", ClipboardList, "Applications"], ["/owner/bookings", CalendarDays, "Bookings"], ["/owner/payments", DollarSign, "Payments"], ["/owner/messages", MessageCircle, "Messages"], ["/owner/reviews", Star, "Reviews"], ["/owner/analytics", BarChart3, "Analytics"], ["/owner/settings", Settings, "Settings"]] as const;
const titles: Record<string, [string, string]> = { "/owner/dashboard": ["Overview", "Your owner workspace at a glance."], "/owner/properties": ["Properties", "Manage your accommodation portfolio."], "/owner/rooms": ["Rooms & beds", "Keep every space and vacancy accurate."], "/owner/bookings": ["Bookings", "Track upcoming move-ins and current residents."], "/owner/payments": ["Payments", "Monitor collections, payouts and balances."], "/owner/messages": ["Messages", "Reply to students and keep communication clear."], "/owner/reviews": ["Reviews", "See what residents are saying about your spaces."], "/owner/analytics": ["Analytics", "Understand occupancy and demand over time."], "/owner/settings": ["Settings", "Manage your workspace and property preferences."] };

function readDraft(): PropertyDraft | null {
  try {
    const saved = window.localStorage.getItem("arc-property-draft") ?? window.localStorage.getItem("arc-owner-property");
    return saved ? (JSON.parse(saved) as PropertyDraft) : null;
  } catch {
    return null;
  }
}

function Shell({ children }: { children: ReactNode }) {
  const path = useLocation().pathname;
  return <div className="dashboard-page min-h-screen bg-white text-[#171717]"><DashboardNav path={path} roleLabel="Owner workspace" workspaceTitle="Owner dashboard" nav={nav} /><DashboardHero title={titles[path]?.[0] ?? "Owner workspace"} subtitle={titles[path]?.[1] ?? "Manage your accommodation business."} /><main className="mx-auto w-full max-w-[1240px] px-5 py-10 lg:px-8">{children}</main><DashboardFooter /></div>;
}

function Heading({ path }: { path: string }) { const [title, subtitle] = titles[path] ?? ["Owner workspace", "Manage your accommodation business."]; return <div><p className="eyebrow">Owner workspace</p><h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.06em] sm:text-5xl">{title}</h1><p className="mt-3 text-sm text-black/50">{subtitle}</p></div>; }

function Empty({ icon: Icon, title, copy, action = "Add a property", href = "/owner/properties/new" }: { icon: typeof Building2; title: string; copy: string; action?: string; href?: string }) { return <section className="mt-8 rounded-2xl border border-dashed border-black/20 bg-white p-10 text-center sm:p-14"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4d6] text-[#a36500]"><Icon /></div><h2 className="mt-5 font-display text-2xl font-extrabold">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black/50">{copy}</p><Link to={href} className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-xs font-bold text-white">{action}<ArrowRight className="ml-2 h-4 w-4" /></Link></section>; }

function Overview({ draft }: { draft: PropertyDraft | null }) { const roomCount = draft?.rooms?.length ?? 0; const bedCount = draft?.rooms?.reduce((sum, room) => sum + room.beds, 0) ?? 0; return <><div className="mt-8 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-black/10 bg-white p-5"><Building2 className="h-5 w-5 text-[#a36500]" /><p className="mt-6 font-display text-3xl font-extrabold">{draft ? "1" : "—"}</p><p className="mt-1 text-xs text-black/50">Properties</p></div><div className="rounded-2xl border border-black/10 bg-white p-5"><BedDouble className="h-5 w-5 text-[#a36500]" /><p className="mt-6 font-display text-3xl font-extrabold">{draft ? roomCount : "—"}</p><p className="mt-1 text-xs text-black/50">Room types</p></div><div className="rounded-2xl border border-black/10 bg-white p-5"><ClipboardList className="h-5 w-5 text-[#a36500]" /><p className="mt-6 font-display text-3xl font-extrabold">{draft ? bedCount : "—"}</p><p className="mt-1 text-xs text-black/50">Configured beds</p></div></div>{draft ? <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow">{draft.status ? "Submitted for review" : "Draft in progress"}</p><h2 className="mt-2 font-display text-2xl font-extrabold">{draft.property?.name || "Continue setting up your property"}</h2><p className="mt-2 text-sm text-black/50">{draft.status ? "Your property is awaiting verification." : "Your property draft has been saved on this device."}</p></div><Link to="/owner/properties/new" className="inline-flex w-fit rounded-full bg-black px-5 py-3 text-xs font-bold text-white">Continue draft <ArrowRight className="ml-2 h-4 w-4" /></Link></div></section> : <Empty icon={Building2} title="Your owner workspace is ready" copy="Create your first property to start adding rooms, beds, applications, and bookings." />}</>; }

function Properties({ draft }: { draft: PropertyDraft | null }) { if (!draft) return <Empty icon={Building2} title="No properties yet" copy="Add your first property to start building its rooms, amenities, and availability." />; return <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><span className={`rounded-full px-3 py-1 text-[10px] font-bold ${draft.status ? "bg-[#dff3e6] text-[#16733b]" : "bg-[#fff4d6] text-[#8a5d00]"}`}>{draft.status ? "Under review" : "Draft"}</span><h2 className="mt-4 font-display text-2xl font-extrabold">{draft.property?.name || "Your new property"}</h2><p className="mt-1 text-sm text-black/50">{draft.property?.city || "City"}{draft.property?.area ? ` · ${draft.property.area}` : ""} · {draft.status ? "Verification pending" : "Continue completing your listing"}</p></div><Link to="/owner/properties/new" className="inline-flex w-fit rounded-full bg-black px-4 py-3 text-xs font-bold text-white">{draft.status ? "View listing" : "Continue editing"} <ArrowRight className="ml-2 h-4 w-4" /></Link></div><div className="mt-7 grid gap-4 border-t border-black/10 pt-6 sm:grid-cols-3"><div><p className="text-xs text-black/45">Photos</p><p className="mt-1 text-lg font-bold">{draft.photos?.length ?? 0}</p></div><div><p className="text-xs text-black/45">Amenities</p><p className="mt-1 text-lg font-bold">{draft.amenities?.length ?? 0}</p></div><div><p className="text-xs text-black/45">Room types</p><p className="mt-1 text-lg font-bold">{draft.rooms?.length ?? 0}</p></div></div></section>; }

function Rooms({ draft }: { draft: PropertyDraft | null }) { const rooms = draft?.rooms ?? []; if (!draft || rooms.length === 0) return <Empty icon={BedDouble} title="No rooms configured" copy="Add room types and bed counts while creating your property. Availability will appear here once rooms exist." action="Configure rooms" />; return <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Draft inventory</p><h2 className="mt-2 font-display text-2xl font-extrabold">Room types & beds</h2></div><Link to="/owner/properties/new" className="rounded-full border border-black/15 px-4 py-3 text-xs font-bold">Edit rooms</Link></div><div className="mt-6 space-y-3">{rooms.map((room, index) => <div key={`${room.name}-${index}`} className="rounded-xl bg-[#f7f6f3] p-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="font-display font-extrabold">{room.name || "Unnamed room type"}</p><p className="mt-1 text-xs text-black/50">{room.price || "Price not set"} per session · {room.beds} bed spaces</p></div><span className="rounded-full bg-white px-3 py-2 text-[10px] font-bold text-black/50">Availability pending</span></div><div className="mt-4 flex flex-wrap gap-2">{Array.from({ length: room.beds }, (_, bed) => <span key={bed} className="flex h-7 w-7 items-center justify-center rounded-full border border-black/15 bg-white text-[10px] font-bold text-black/45">{bed + 1}</span>)}</div></div>)}</div><p className="mt-5 text-xs leading-5 text-black/45">Bed occupancy will be connected to bookings and approved applications when backend data is available.</p></section>; }

function Generic({ title }: { title: string }) { return <Empty icon={CheckCircle2} title={`${title} workspace ready`} copy="This frontend surface is ready for live data, filters, actions, and API integration." action="Return to overview" href="/owner/dashboard" />; }

export default function OwnerPortal() { const path = useLocation().pathname; const [draft, setDraft] = useState<PropertyDraft | null>(null); const [loading, setLoading] = useState(true); useEffect(() => { setDraft(readDraft()); setLoading(false); }, []); if (loading) return <Shell><div className="h-64 animate-pulse rounded-2xl bg-black/5" /></Shell>; return <Shell>{path === "/owner/dashboard" ? <Overview draft={draft} /> : path === "/owner/properties" ? <Properties draft={draft} /> : path === "/owner/rooms" ? <Rooms draft={draft} /> : <Generic title={titles[path]?.[0] ?? "Owner"} />}</Shell>; }
