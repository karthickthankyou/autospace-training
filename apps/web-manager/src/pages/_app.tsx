import '@/styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import type { AppProps } from 'next/app'
import { ApolloProvider } from '@autospace-org/network/src/config/apollo'
import { AppLevelListeners } from '@autospace-org/ui/src/components/atoms/AppLevelListeners'
import { Notifications } from '@autospace-org/ui/src/components/organisms/Notifications'
import { useIsPathInArray } from '@autospace-org/hooks/src'
import { Footer } from '@autospace-org/ui/src/components/organisms/Footer'
import { Header } from '@autospace-org/ui/src/components/organisms/Header'
import { MenuItem } from '@autospace-org/types'

const MENUITEMS: MenuItem[] = [
  { label: 'About', href: '/about', loggedIn: false },
  { label: 'Garages', href: '/garages', loggedIn: true },
]
const SUBMENUITEMS: MenuItem[] = [
  ...MENUITEMS,
  { label: 'Contact', href: '/contact', loggedIn: false },
  { label: 'FAQs', href: '/faqs', loggedIn: false },
  { label: 'How it works', href: '/how-it-works', loggedIn: false },
]

export default function App({ Component, pageProps }: AppProps) {
  const hideNav = useIsPathInArray(['/login', '/register'])

  return (
    <ApolloProvider>
      <AppLevelListeners />
      {!hideNav ? (
        <Header
          type="manager"
          menuItems={MENUITEMS}
          sideMenuItems={SUBMENUITEMS}
        />
      ) : null}
      <Component {...pageProps} />
      {!hideNav ? <Footer /> : null}
      <Notifications />
    </ApolloProvider>
  )
}
