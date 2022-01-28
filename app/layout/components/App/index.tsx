import React from 'react'

import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

import DatabaseView, { route as DatabaseViewRoute } from '@app/database/views/DatabaseView'

import useHoverable from '@app/ui/use/useHoverable'

import Modals from '@app/layout/components/Modals'
import Sidebar from '@app/layout/components/Sidebar'
import BottomPanel from '@app/layout/components/BottomPanel'
import KeybindingScope from '@app/keybindings/components/KeybindingScope'

import Providers from '@app/layout/components/Providers'
import DatabaseViewProvider from '@app/database/views/DatabaseView/providers/DatabaseViewProvider'

import styles from './styles.scss'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <Router>
    <Providers>
      {children}
    </Providers>
  </Router>
)

const Wrapped = () => {
  useHoverable()

  return (
    <div className={styles.main}>
      <Modals />
      <KeybindingScope scope="view" />
      <div className={styles.stack}>
        <Sidebar />
        <div className={styles.wrapper}>
          <Switch>
            <DatabaseViewProvider>
              <Route path={DatabaseViewRoute.match.pattern}>
                <DatabaseView />
              </Route>
            </DatabaseViewProvider>
          </Switch>
        </div>
      </div>
      <BottomPanel />
    </div>
  )
}

const App = () => (
  <Wrapper>
    <Wrapped />
  </Wrapper>
)

export default App
