import { Link } from "react-router-dom";

export default function DashboardFooter() {
  return <footer className="border-t border-gray-400 bg-white">
    <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 py-8 text-[15px] text-black/60 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div><p className="font-display text-lg font-extrabold text-black">arc<span className="text-[#f5b544]">()</span></p><p className="mt-1">Accommodation decisions, made clearer.</p></div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2 font-bold"><Link to="/help" className="hover:text-black">Help</Link><Link to="/terms" className="hover:text-black">Terms</Link><Link to="/privacy" className="hover:text-black">Privacy</Link><Link to="/" className="hover:text-black">Home</Link></nav>
    </div>
  </footer>;
}
