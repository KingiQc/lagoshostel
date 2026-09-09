import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Mail, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "owner">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState(location.pathname === "/signup" ? "signup" : "login");
  const signup = mode === "signup";
  const submit = (event: FormEvent) => {
    event.preventDefault();
    navigate(role === "student" ? "/dashboard" : "/owner/dashboard");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#242424] text-white">
      <div className="auth-underlay">
        <div className="auth-underlay-nav"><span className="font-display text-lg font-extrabold">arc<span className="text-[#f5b544]">()</span></span><span>For students</span><span>For owners</span><span className="ml-auto">Find a hostel</span><span className="rounded-full bg-white/15 px-4 py-2">List your hostel</span></div>
        <div className="mx-auto mt-36 max-w-6xl px-6"><div className="h-3 w-36 rounded-full bg-white/30" /><div className="mt-4 h-16 w-[480px] rounded-2xl bg-white/10" /><div className="mt-14 grid grid-cols-3 gap-4"><div className="h-36 rounded-2xl bg-white/10" /><div className="h-36 rounded-2xl bg-white/10" /><div className="h-36 rounded-2xl bg-white/10" /></div></div>
      </div>
      <div className="absolute inset-0 bg-black/75" />
      <header className="relative z-10 mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 lg:px-8"><Link to="/" className="font-display text-[25px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></Link><Link to="/" className="text-xs font-bold text-white/70 hover:text-white"><ArrowLeft className="mr-2 inline h-4 w-4" /> Back to home</Link></header>
      <main className="relative z-10 flex min-h-[calc(100vh-74px)] items-center justify-center px-4 py-10">
        <section className="relative grid w-full max-w-[770px] overflow-hidden rounded-[4px] bg-white text-[#171717] shadow-2xl md:grid-cols-[.9fr_1.1fr]">
          <Link to="/" className="absolute right-3 top-3 z-10 rounded-full p-1 text-black/50 transition hover:bg-black/10 hover:text-black"><X className="h-4 w-4" /></Link>
          <div className="flex flex-col justify-between border-r border-black/10 p-7 sm:p-9"><div><div className="font-display text-[18px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></div><h1 className="mt-7 max-w-[180px] font-display text-[17px] font-extrabold leading-6">{signup ? "Find your next room" : "Effortlessly find student housing"}</h1><p className="mt-5 text-[11px] leading-5 text-black/55">{signup ? "Find a place to live, compare your options and move in with confidence." : "Find trusted student accommodation near your university with everything in one place."}</p><div className="mt-5 space-y-3 text-[10px] text-black/60"><p><Check className="mr-2 inline h-3 w-3 text-[#a36500]" /> {signup ? "Search verified hostels" : "Verified properties and owners"}</p><p><Check className="mr-2 inline h-3 w-3 text-[#a36500]" /> {signup ? "Reserve your space securely" : "Clear pricing and availability"}</p><p><Check className="mr-2 inline h-3 w-3 text-[#a36500]" /> {signup ? "Manage everything in one place" : "Student support when you need it"}</p></div></div><p className="mt-8 text-[9px] leading-4 text-black/40">By creating an account, you agree to the Terms of Service, Privacy Policy and Cookie Policy.</p></div>
          <div className="p-7 sm:p-9"><div className="mb-5"><h2 className="font-display text-[19px] font-extrabold">{signup ? "Find work with arc" : "Welcome back"}</h2><p className="mt-1 text-[10px] text-black/45">{signup ? "Looking to hire? Join as a client" : "Log in to continue to your account"}</p></div><div className="mb-5 grid grid-cols-2 rounded-full bg-[#f3f3f1] p-1"><button onClick={() => setRole("student")} className={`rounded-full py-2 text-[10px] font-bold ${role === "student" ? "bg-black text-white" : "text-black/45"}`}>I’m a student</button><button onClick={() => setRole("owner")} className={`rounded-full py-2 text-[10px] font-bold ${role === "owner" ? "bg-black text-white" : "text-black/45"}`}>I’m an owner</button></div><form onSubmit={submit} className="space-y-3">{signup && <label className="block text-[10px] font-medium text-black/55">Full name *<input required className="auth-input" placeholder="Your full name" /></label>}<label className="block text-[10px] font-medium text-black/55">Email *<div className="relative"><Mail className="absolute left-2 top-2.5 h-3.5 w-3.5 text-black/30" /><input required type="email" className="auth-input pl-7" placeholder="you@example.com" /></div></label><label className="block text-[10px] font-medium text-black/55">Password *<div className="relative"><KeyRound className="absolute left-2 top-2.5 h-3.5 w-3.5 text-black/30" /><input required type={showPassword ? "text" : "password"} className="auth-input pl-7 pr-8" placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2.5">{showPassword ? <EyeOff className="h-3.5 w-3.5 text-black/35" /> : <Eye className="h-3.5 w-3.5 text-black/35" />}</button></div></label>{!signup && <div className="flex justify-end"><button type="button" className="text-[10px] font-semibold text-[#a36500]">Forgot password?</button></div>}<button className="w-full rounded-[3px] bg-[#1769e8] py-2.5 text-[11px] font-bold text-white transition hover:bg-black">{signup ? "Sign up with email" : "Log in"}</button></form><div className="my-4 flex items-center gap-3 text-[9px] text-black/30"><span className="h-px flex-1 bg-black/10" />OR<span className="h-px flex-1 bg-black/10" /></div><div className="flex justify-center gap-5"><button aria-label="LinkedIn" className="auth-social bg-[#377bb5]">in</button><button aria-label="GitHub" className="auth-social bg-[#292929]">●</button><button aria-label="Google" className="auth-social bg-white text-[#4285f4] shadow-sm">G</button><button aria-label="Facebook" className="auth-social bg-[#4387d9]">f</button></div><p className="mt-5 text-center text-[10px] text-black/45">{signup ? "Already have an account?" : "Don’t have an account?"} <button onClick={() => setMode(signup ? "login" : "signup")} className="font-bold text-[#a36500]">{signup ? "Log in" : "Sign up"}</button></p></div>
        </section>
      </main>
    </div>
  );
}
