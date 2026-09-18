import { ArrowLeft, Check, Eye, EyeOff, KeyRound, Mail, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, signup } from "@/lib/api";

type LoginProps = {
  embedded?: boolean;
  initialMode?: "login" | "signup";
  onClose?: () => void;
};

export default function Login({ embedded = false, initialMode, onClose }: LoginProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "owner">("student");
  const [mode, setMode] = useState<"login" | "signup">(initialMode ?? (location.pathname === "/signup" ? "signup" : "login"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const signupMode = mode === "signup";

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = signupMode
        ? await signup({ name, email, password, role })
        : await login({ email, password });
      window.localStorage.setItem("arc.session", JSON.stringify(response));
      navigate(response.user.role === "owner" ? "/owner/dashboard" : "/dashboard");
      onClose?.();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not complete authentication.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError("");
  };

  return (
    <div className={embedded ? "fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 text-white" : "relative min-h-screen overflow-hidden bg-[#242424] text-white"}>
      {!embedded && (
        <>
          <div className="auth-underlay" />
          <div className="absolute inset-0 bg-black/75" />
          <header className="relative z-10 mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
            <Link to="/" className="font-display text-[25px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></Link>
            <Link to="/" className="text-xs font-bold text-white/70 hover:text-white"><ArrowLeft className="mr-2 inline h-4 w-4" /> Back to home</Link>
          </header>
        </>
      )}

      <main className={embedded ? "w-full max-w-[770px]" : "relative z-10 flex min-h-[calc(100vh-74px)] items-center justify-center px-4 py-10"}>
        <section className="relative grid w-full max-w-[770px] overflow-hidden rounded-[4px] bg-white text-[#171717] shadow-2xl md:grid-cols-[.9fr_1.1fr]">
          {onClose ? <button type="button" aria-label="Close authentication" onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full p-1 text-black/50 transition hover:bg-black/10 hover:text-black"><X className="h-4 w-4" /></button> : <Link aria-label="Close authentication" to="/" className="absolute right-3 top-3 z-10 rounded-full p-1 text-black/50 transition hover:bg-black/10 hover:text-black"><X className="h-4 w-4" /></Link>}
          <div className="flex flex-col justify-between border-r border-black/10 p-7 sm:p-9">
            <div>
              <div className="font-display text-[18px] font-extrabold tracking-[-.08em]">arc<span className="text-[#f5b544]">()</span></div>
              <h1 className="mt-7 max-w-[190px] font-display text-[17px] font-extrabold leading-6">{signupMode ? "Find your next room" : "Effortlessly find student housing"}</h1>
              <p className="mt-5 text-[11px] leading-5 text-black/55">{signupMode ? "Find a place to live, compare your options and move in with confidence." : "Find trusted student accommodation near your university with everything in one place."}</p>
              <div className="mt-5 space-y-3 text-[10px] text-black/60">
                <p><Check className="mr-2 inline h-3 w-3 text-[#a36500]" /> {signupMode ? "Search verified hostels" : "Verified properties and owners"}</p>
                <p><Check className="mr-2 inline h-3 w-3 text-[#a36500]" /> {signupMode ? "Reserve your space securely" : "Clear pricing and availability"}</p>
                <p><Check className="mr-2 inline h-3 w-3 text-[#a36500]" /> {signupMode ? "Manage everything in one place" : "Student support when you need it"}</p>
              </div>
            </div>
            <p className="mt-8 text-[9px] leading-4 text-black/40">By creating an account, you agree to the <Link className="underline" to="/terms">Terms of Service</Link> and <Link className="underline" to="/privacy">Privacy Policy</Link>.</p>
          </div>

          <div className="p-7 sm:p-9">
            <div className="mb-5"><h2 className="font-display text-[19px] font-extrabold">{signupMode ? "Create your arc() account" : "Welcome back"}</h2><p className="mt-1 text-[10px] text-black/45">{signupMode ? "Start your accommodation journey" : "Log in to continue to your account"}</p></div>
            <div className="mb-5 grid grid-cols-2 rounded-full bg-[#f3f3f1] p-1"><button type="button" onClick={() => setRole("student")} className={`rounded-full py-2 text-[10px] font-bold ${role === "student" ? "bg-black text-white" : "text-black/45"}`}>I’m a student</button><button type="button" onClick={() => setRole("owner")} className={`rounded-full py-2 text-[10px] font-bold ${role === "owner" ? "bg-black text-white" : "text-black/45"}`}>I’m an owner</button></div>
            <form onSubmit={submit} className="space-y-3">
              {signupMode && <label className="block text-[10px] font-medium text-black/55">Full name *<input required value={name} onChange={(event) => setName(event.target.value)} className="auth-input" placeholder="Your full name" autoComplete="name" /></label>}
              <label className="block text-[10px] font-medium text-black/55">Email *<div className="relative"><Mail className="absolute left-2 top-2.5 h-3.5 w-3.5 text-black/30" /><input required value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="auth-input pl-7" placeholder="you@example.com" autoComplete="email" /></div></label>
              <label className="block text-[10px] font-medium text-black/55">Password *<div className="relative"><KeyRound className="absolute left-2 top-2.5 h-3.5 w-3.5 text-black/30" /><input required minLength={signupMode ? 8 : 1} value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} className="auth-input pl-7 pr-8" placeholder={signupMode ? "At least 8 characters" : "Your password"} autoComplete={signupMode ? "new-password" : "current-password"} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-black/35">{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button></div></label>
              {error && <p role="alert" className="rounded-lg bg-[#fff0f0] px-3 py-2 text-[10px] leading-4 text-[#a52a2a]">{error}</p>}
              <button disabled={loading} type="submit" className="mt-2 w-full rounded-full bg-black py-3 text-[11px] font-bold text-white transition hover:bg-black/85 disabled:cursor-wait disabled:opacity-60">{loading ? "Connecting..." : signupMode ? "Create account" : "Log in"}</button>
            </form>
            <p className="mt-6 text-center text-[10px] text-black/45">{signupMode ? "Already have an account?" : "Don’t have an account?"} <button type="button" onClick={() => switchMode(signupMode ? "login" : "signup")} className="font-bold text-black underline">{signupMode ? "Log in" : "Sign up"}</button></p>
          </div>
        </section>
      </main>
    </div>
  );
}
