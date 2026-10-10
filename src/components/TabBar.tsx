import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { TABS } from '../nav'
import TabIcon from './TabIcon'

export default function TabBar() {
  const { t } = useTranslation()
  return (
    <nav
      aria-label={t('nav.aria')}
      className="fixed inset-x-0 bottom-0 z-10 before:absolute before:inset-x-0 before:-top-px before:h-0.5 before:bg-gold md:before:inset-x-auto md:before:inset-y-0 md:before:top-0 md:before:-right-px md:before:left-auto md:before:h-auto md:before:w-0.5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:h-dvh md:w-56 md:shrink-0 md:border-t-0 md:border-r md:pb-0"
    >
      <p className="hidden px-5 pt-6 pb-4 font-display text-3xl leading-none font-extrabold text-accent uppercase md:block">
        Carnet
        <br />
        de salle
      </p>
      <ul className="flex md:flex-col md:px-3">
        {TABS.map((tab) => (
          <li key={tab.id} className="flex-1 md:flex-none">
            <NavLink
              to={tab.path}
              end={tab.path === '/'}
              className={({ isActive }) =>
                `relative flex min-h-14 flex-col items-center justify-center gap-0.5 px-1 text-xs font-semibold md:min-h-12 md:flex-row md:justify-start md:gap-3 md:rounded-lg md:px-3 md:text-base ${
                  isActive ? 'text-accent after:absolute after:inset-x-6 after:top-0 after:h-[3px] after:rounded-b-sm after:bg-brand md:bg-accent/10 md:after:hidden' : 'text-muted hover:text-ink'
                }`
              }
            >
              <TabIcon id={tab.id} />
              <span>{t(tab.labelKey)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
