interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
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
      {isLoggedIn ? (
        <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex font-inter">
          <span>
            Hi, <span className="font-bold text-text-dark">Companyname</span>
          </span>
          <span className="text-[11px] font-semibold transition-transform rotate-90">{'>'}</span>
          <span className="h-10 w-10 rounded border border-primary-border" />
        </div>
      ) : (
        <div className="hidden items-center gap-3 text-xs text-text-tertiary lg:flex font-inter">
          <button className="px-5 py-3 rounded bg-primary text-xs font-semibold text-white opacity-100 transition-all hover:opacity-90 active:scale-[0.98]">
            Signup for free
          </button>
          <button className="px-5 py-3 rounded hover:text-black/50 text-xs font-semibold text-black opacity-100 transition-all active:scale-[0.98]">
            Login
          </button>
        </div>
      )}
    </header>
  );
}
