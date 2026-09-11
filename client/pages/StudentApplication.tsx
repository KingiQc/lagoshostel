import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  FileText,
  Home,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";

type RoomOption = {
  id: "single" | "shared";
  name: string;
  price: string;
  description: string;
};

type ApplicationRecord = {
  id: string;
  hostelName: string;
  hostelLocation: string;
  roomName: string;
  roomPrice: string;
  moveInDate: string;
  submittedAt: string;
  status: "submitted";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  university: string;
  documents: string[];
};

const rooms: RoomOption[] = [
  {
    id: "single",
    name: "Single room",
    price: "₦450,000",
    description: "A private furnished room for focused university life.",
  },
  {
    id: "shared",
    name: "4-bed shared room",
    price: "₦220,000",
    description: "An affordable shared room with one space currently available.",
  },
];

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
  return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(`${value}T12:00:00`));
}

function Header() {
  return (
    <header className="border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-5 lg:px-8">
        <Link to="/" className="font-display text-[25px] font-extrabold tracking-[-.08em]">
          arc<span className="text-[#f5b544]">()</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-white/50 sm:block">Student space</span>
          <Link to="/student/applications" className="rounded-full bg-white px-4 py-2 text-xs font-bold text-black">
            My applications
          </Link>
        </div>
      </div>
    </header>
  );
}

function Progress({ step }: { step: number }) {
  const steps = ["Room & date", "Your details", "Documents", "Review"];
  return (
    <div className="mb-8 grid grid-cols-4 gap-2">
      {steps.map((label, index) => {
        const current = index + 1;
        return (
          <div key={label} className="min-w-0">
            <div className={`h-1 rounded-full ${current <= step ? "bg-[#f5b544]" : "bg-black/10"}`} />
            <p className={`mt-2 truncate text-[10px] font-bold uppercase tracking-[.08em] ${current <= step ? "text-black" : "text-black/35"}`}>
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ApplicationDetail({ application }: { application: ApplicationRecord }) {
  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#171717]">
      <Header />
      <main className="mx-auto max-w-[1000px] px-5 py-10 lg:px-8">
        <Link to="/student/applications" className="inline-flex items-center text-xs font-bold text-black/50 hover:text-black">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to applications
        </Link>
        <div className="mt-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Application {application.id}</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-.06em] sm:text-6xl">Your application.</h1>
            <p className="mt-3 text-sm text-black/55">Submitted {formatDate(application.submittedAt.slice(0, 10))}. We’ll update you here as the hostel reviews it.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff4d6] px-4 py-2 text-xs font-bold text-[#8a5d00]"><CheckCircle2 className="h-4 w-4" /> Submitted</span>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4 border-b border-black/10 pb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5b544]/25"><Home className="h-5 w-5" /></div>
              <div><p className="text-xs font-bold text-black/45">Property</p><h2 className="mt-1 font-display text-2xl font-extrabold">{application.hostelName}</h2><p className="mt-1 text-sm text-black/50">{application.hostelLocation}</p></div>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div><p className="text-xs font-bold text-black/45">Room selected</p><p className="mt-1 text-sm font-bold">{application.roomName}</p><p className="mt-1 text-xs text-black/50">{application.roomPrice} per session</p></div>
              <div><p className="text-xs font-bold text-black/45">Preferred move-in</p><p className="mt-1 text-sm font-bold">{formatDate(application.moveInDate)}</p></div>
              <div><p className="text-xs font-bold text-black/45">Applicant</p><p className="mt-1 text-sm font-bold">{application.firstName} {application.lastName}</p><p className="mt-1 text-xs text-black/50">{application.email}</p></div>
              <div><p className="text-xs font-bold text-black/45">University</p><p className="mt-1 text-sm font-bold">{application.university}</p></div>
            </div>
            <div className="mt-8 rounded-xl bg-[#f7f6f3] p-4">
              <p className="flex items-center gap-2 text-xs font-bold"><ShieldCheck className="h-4 w-4 text-[#1f9d55]" /> What happens next</p>
              <p className="mt-2 text-xs leading-6 text-black/55">The hostel team will review your details and contact you using the information provided. No payment is due for an application.</p>
            </div>
          </section>
          <aside className="h-fit rounded-2xl border border-black/10 bg-black p-6 text-white">
            <p className="eyebrow text-white/45">Submitted documents</p>
            <div className="mt-5 space-y-3">
              {application.documents.map((document) => <div key={document} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-xs"><FileText className="h-4 w-4 text-[#f5b544]" /><span className="truncate">{document}</span><Check className="ml-auto h-4 w-4 text-[#74d69a]" /></div>)}
            </div>
            <p className="mt-5 text-[11px] leading-5 text-white/45">Documents are ready for secure upload when your account is connected to the platform.</p>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function StudentApplication() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const existingApplication = useMemo(() => readApplication(), []);
  const [step, setStep] = useState(1);
  const [roomId, setRoomId] = useState<RoomOption["id"]>((searchParams.get("room") as RoomOption["id"]) || "shared");
  const [moveInDate, setMoveInDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [university, setUniversity] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (id) {
    if (!existingApplication || existingApplication.id !== id) {
      return <div className="min-h-screen bg-[#f7f6f3] px-5 py-20 text-center"><FileText className="mx-auto h-10 w-10 text-black/25" /><h1 className="mt-5 font-display text-3xl font-extrabold">Application not found</h1><p className="mx-auto mt-2 max-w-md text-sm text-black/50">This application is not available on this device yet.</p><Link to="/student/applications" className="mt-6 inline-flex rounded-full bg-black px-5 py-3 text-xs font-bold text-white">Back to applications</Link></div>;
    }
    return <ApplicationDetail application={existingApplication} />;
  }

  const selectedRoom = rooms.find((room) => room.id === roomId) ?? rooms[1];

  const chooseFiles = (event: ChangeEvent<HTMLInputElement>) => {
    setDocuments(Array.from(event.target.files ?? []).map((file) => file.name));
    setError("");
  };

  const next = () => {
    setError("");
    if (step === 1 && (!moveInDate || !roomId)) return setError("Choose a room and preferred move-in date to continue.");
    if (step === 2 && (!firstName || !lastName || !email || !phone || !university)) return setError("Complete all required details to continue.");
    if (step === 3 && documents.length === 0) return setError("Add at least one document so the hostel can review your application.");
    setStep((current) => Math.min(4, current + 1));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    const application: ApplicationRecord = {
      id: `ARC-${Date.now().toString().slice(-6)}`,
      hostelName: "Greenfield Residence",
      hostelLocation: "Yaba, Lagos",
      roomName: selectedRoom.name,
      roomPrice: selectedRoom.price,
      moveInDate,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      firstName,
      lastName,
      email,
      phone,
      university,
      documents,
    };
    window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(application));
      navigate(`/student/applications/${application.id}`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#171717]">
      <Header />
      <main className="mx-auto max-w-[1080px] px-5 py-10 lg:px-8">
        <Link to="/hostels/greenfield-residence" className="inline-flex items-center text-xs font-bold text-black/50 hover:text-black"><ArrowLeft className="mr-2 h-4 w-4" /> Back to property</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
          <section>
            <p className="eyebrow">Greenfield Residence · Apply</p>
            <h1 className="mt-2 font-display text-4xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-6xl">Make this place<br />your next home.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-black/55">Send the hostel team your details and preferred room. An application does not charge you or guarantee a booking.</p>
            <form onSubmit={(event) => { event.preventDefault(); if (step === 4) submit(event); else next(); }} className="mt-9 rounded-2xl border border-black/10 bg-white p-5 sm:p-8">
              <Progress step={step} />
              {error && <div className="mb-6 rounded-xl border border-[#dcae4d] bg-[#fff7e3] px-4 py-3 text-xs font-semibold text-[#7a5200]" role="alert">{error}</div>}
              {step === 1 && <div><div className="flex items-center gap-3"><Home className="h-5 w-5 text-[#a36500]" /><div><h2 className="font-display text-2xl font-extrabold">Choose your space</h2><p className="mt-1 text-xs text-black/50">Select the room type you want the hostel to review.</p></div></div><div className="mt-6 space-y-3">{rooms.map((room) => <button type="button" key={room.id} onClick={() => setRoomId(room.id)} className={`flex w-full items-start justify-between gap-4 rounded-xl border p-4 text-left transition ${room.id === roomId ? "border-black bg-[#fff7e3]" : "border-black/10 hover:border-black/30"}`}><span className="flex gap-3"><span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${room.id === roomId ? "border-black bg-black" : "border-black/25"}`}>{room.id === roomId && <span className="h-1.5 w-1.5 rounded-full bg-[#f5b544]" />}</span><span><strong className="block text-sm">{room.name}</strong><span className="mt-1 block text-xs leading-5 text-black/50">{room.description}</span></span></span><span className="shrink-0 text-right text-sm font-bold">{room.price}<span className="block text-[10px] font-medium text-black/40">per session</span></span></button>)}</div><label className="mt-6 block text-xs font-bold">Preferred move-in date<input required type="date" value={moveInDate} onChange={(event) => setMoveInDate(event.target.value)} className="auth-input" /></label></div>}
              {step === 2 && <div><div className="flex items-center gap-3"><UserRound className="h-5 w-5 text-[#a36500]" /><div><h2 className="font-display text-2xl font-extrabold">Tell us about you</h2><p className="mt-1 text-xs text-black/50">The hostel uses these details to contact you about your application.</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold">First name<input required value={firstName} onChange={(event) => setFirstName(event.target.value)} className="auth-input" placeholder="First name" /></label><label className="text-xs font-bold">Last name<input required value={lastName} onChange={(event) => setLastName(event.target.value)} className="auth-input" placeholder="Last name" /></label><label className="text-xs font-bold sm:col-span-2">Email address<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input" placeholder="you@example.com" /></label><label className="text-xs font-bold">Phone number<input required value={phone} onChange={(event) => setPhone(event.target.value)} className="auth-input" placeholder="0800 000 0000" /></label><label className="text-xs font-bold">University<input required value={university} onChange={(event) => setUniversity(event.target.value)} className="auth-input" placeholder="Your university" /></label></div></div>}
              {step === 3 && <div><div className="flex items-center gap-3"><Upload className="h-5 w-5 text-[#a36500]" /><div><h2 className="font-display text-2xl font-extrabold">Add your documents</h2><p className="mt-1 text-xs text-black/50">Choose the documents the hostel may need to review your application.</p></div></div><label className="mt-7 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-black/20 bg-[#f7f6f3] px-5 py-10 text-center hover:border-black/50"><Upload className="h-7 w-7 text-black/35" /><strong className="mt-3 text-sm">Choose documents</strong><span className="mt-1 text-xs text-black/45">PDF, JPG or PNG · files stay on this device for now</span><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={chooseFiles} className="sr-only" /></label>{documents.length > 0 && <div className="mt-4 space-y-2">{documents.map((document) => <div key={document} className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-xs"><FileText className="h-4 w-4 text-[#a36500]" /><span className="truncate">{document}</span><Check className="ml-auto h-4 w-4 text-[#1f9d55]" /></div>)}</div>}</div>}
              {step === 4 && <div><div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-[#a36500]" /><div><h2 className="font-display text-2xl font-extrabold">Review your application</h2><p className="mt-1 text-xs text-black/50">Check your details before sending them to the hostel.</p></div></div><div className="mt-6 divide-y divide-black/10 rounded-xl border border-black/10"><div className="flex items-center justify-between gap-4 p-4 text-sm"><span className="text-black/50">Room</span><strong className="text-right">{selectedRoom.name}</strong></div><div className="flex items-center justify-between gap-4 p-4 text-sm"><span className="text-black/50">Move-in</span><strong className="text-right">{formatDate(moveInDate)}</strong></div><div className="flex items-center justify-between gap-4 p-4 text-sm"><span className="text-black/50">Applicant</span><strong className="text-right">{firstName} {lastName}</strong></div><div className="flex items-center justify-between gap-4 p-4 text-sm"><span className="text-black/50">Contact</span><strong className="max-w-[60%] text-right">{email}<br />{phone}</strong></div><div className="flex items-center justify-between gap-4 p-4 text-sm"><span className="text-black/50">Documents</span><strong className="text-right">{documents.length} selected</strong></div></div><div className="mt-5 flex gap-3 rounded-xl bg-[#f7f6f3] p-4 text-xs leading-5 text-black/55"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#1f9d55]" /> No payment is required to submit this application. You can withdraw it before the hostel accepts it.</div></div>}
              <div className="mt-8 flex items-center justify-between gap-3 border-t border-black/10 pt-5"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} className={`rounded-full border border-black/15 px-5 py-3 text-xs font-bold ${step === 1 ? "invisible" : ""}`}>Back</button>{step < 4 ? <button type="button" onClick={next} className="rounded-full bg-black px-5 py-3 text-xs font-bold text-white">Continue <ArrowRight className="ml-2 inline h-4 w-4" /></button> : <button type="submit" disabled={submitting} className="rounded-full bg-black px-5 py-3 text-xs font-bold text-white disabled:cursor-wait disabled:opacity-60">{submitting ? "Submitting…" : "Submit application"} <ArrowRight className="ml-2 inline h-4 w-4" /></button>}</div>
            </form>
          </section>
          <aside className="h-fit rounded-2xl bg-black p-6 text-white lg:sticky lg:top-8"><p className="eyebrow text-white/45">Your selection</p><h2 className="mt-3 font-display text-2xl font-extrabold">Greenfield Residence</h2><p className="mt-1 text-xs text-white/45">Yaba, Lagos · Verified property</p><div className="mt-7 border-t border-white/10 pt-5"><div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-[#f5b544]" /><div><p className="text-[10px] uppercase tracking-[.1em] text-white/40">Room</p><p className="mt-1 text-sm font-bold">{selectedRoom.name}</p></div></div>{moveInDate && <div className="mt-5 flex items-center gap-3"><CalendarDays className="h-4 w-4 text-[#f5b544]" /><div><p className="text-[10px] uppercase tracking-[.1em] text-white/40">Move-in</p><p className="mt-1 text-sm font-bold">{formatDate(moveInDate)}</p></div></div>}</div><div className="mt-7 rounded-xl bg-white/5 p-4 text-xs leading-5 text-white/55"><ShieldCheck className="mr-2 inline h-4 w-4 text-[#74d69a]" /> Your application is free. The hostel will respond after reviewing your details.</div></aside>
        </div>
      </main>
    </div>
  );
}
