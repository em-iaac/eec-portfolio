import { Link, NavLink } from 'react-router-dom'
import LogoMark from './LogoMark'

const NAV = [
  { n: '01', label: 'WORK', to: '/work' },
  { n: '02', label: 'ABOUT', to: '/about' },
  { n: '03', label: 'CV', to: '/cv' },
]

export default function TitleBlock({ sheet }: { sheet: string }) {
  return (
    <header className="border-b border-ink bg-mylar">
      <div className="flex flex-wrap items-stretch">
        <Link
          to="/"
          aria-label="Home"
          className="flex min-w-16 items-center justify-center border-r border-ink/35 px-3.5 py-2.5 focus-visible:outline-2 focus-visible:outline-redline"
        >
          <LogoMark size={34} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-center border-r-0 px-3.5 py-2.5 sm:flex-none sm:border-r sm:border-ink/35">
          <span className="font-expanded text-xs font-semibold tracking-[0.1em] text-ink">
            EMILIE EL CHIDIAC
          </span>
          <span className="mt-0.5 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-anno">
            DESIGN TECHNOLOGY ARCHITECT
            <br />
            MACAD @ IAAC · <span className="text-redline">OPEN TO R&D ROLES IN EUROPE</span>
          </span>
        </div>
        <nav
          aria-label="Primary"
          className="order-last flex min-w-full flex-1 items-center gap-5 border-t border-ink/20 px-3.5 py-2.5 font-mono text-[10px] tracking-[0.1em] sm:order-none sm:min-w-0 sm:border-t-0 sm:border-r sm:border-ink/35"
        >
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `-m-3 p-3 text-ink no-underline hover:text-redline focus-visible:outline-2 focus-visible:outline-redline ${
                  isActive ? 'text-redline underline underline-offset-4' : ''
                }`
              }
            >
              <span className="mr-1 text-anno">{item.n}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden flex-col justify-center border-r border-ink/35 px-3.5 py-2.5 font-mono text-[10px] text-anno md:flex">
          <span>SHEET</span>
          <span className="text-[13px] font-medium text-ink">{sheet}</span>
        </div>
        <div className="flex w-full items-center px-3.5 pb-2.5 sm:w-auto sm:pb-0">
          <span className="-rotate-1 border-[1.5px] border-redline px-2.5 py-1.5 font-mono text-[9.5px] tracking-[0.12em] whitespace-nowrap text-redline">
            ISSUED FOR: <b className="font-medium">READ</b> <span className="text-anno">/ explore</span>
            <span className="sr-only">(EXPLORE mode plots in Session 3)</span>
          </span>
        </div>
      </div>
    </header>
  )
}
