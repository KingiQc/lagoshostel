type DashboardHeroProps = {
  title: string;
  subtitle: string;
};

export default function DashboardHero({ title, subtitle }: DashboardHeroProps) {
  return <section className="dashboard-hero relative isolate min-h-[270px] overflow-hidden bg-black text-white sm:min-h-[330px]">
    <img src="/dashboard-hero.svg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-black/35" />
    <div className="relative mx-auto flex min-h-[270px] max-w-[1240px] flex-col justify-end px-5 py-10 sm:min-h-[330px] sm:py-14 lg:px-8">
      <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-[.98] tracking-[-.06em] sm:text-6xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/75">{subtitle}</p>
    </div>
  </section>;
}
