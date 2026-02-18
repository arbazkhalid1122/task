export default function Header() {
  return (
    <header className="mx-auto flex flex-col sm:flex-row h-auto sm:h-[60px] items-center gap-3 sm:gap-5 border-b border-border justify-between py-3 sm:py-0">
      <div className="text-2xl sm:text-3xl font-medium text-primary w-full sm:w-auto text-center sm:text-left font-space-grotesk">
        cryptoi
      </div>
      <div className="flex-1 flex justify-center w-full sm:w-auto font-space-grotesk">
        <input
          type="text"
          placeholder="Search reviews, competitors & discussion platforms..."
          className="h-9 w-full max-w-[640px] rounded-md border border-primary-border bg-bg-lighter px-3 text-sm text-text-dark focus:outline-none placeholder:text-text-primary font-inter"
        />
      </div>
      <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex font-inter">
        <span>Hi, <span className="font-bold text-text-dark">Companyname</span></span>
        <span className="text-[11px] font-semibold transition-transform rotate-90">{'>'}</span>
        <span className="h-10 w-10 rounded border border-primary-border" />
      </div>
    </header>
  );
}

