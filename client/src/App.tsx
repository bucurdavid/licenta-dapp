import {
  NotificationModal,
  SignTransactionsModals,
  TransactionsToastList,
} from '@multiversx/sdk-dapp/UI'
import {BrowserRouter as Router} from 'react-router-dom'
import {DappProvider} from '@multiversx/sdk-dapp/wrappers'
import './App.css'
import Navbar from './components/Navbar'
import Content from './components/Content'

function App() {
  return (
    <div className="bg-slate-900 h-screen">
      <Router>
        <DappProvider
          environment="devnet"
          customNetworkConfig={{
            name: 'customConfig',
            apiTimeout: 6000,
            walletConnectV2ProjectId: process.env.REACT_APP_WALLETCONNECTV2_KEY,
          }}
        >
          <TransactionsToastList />
          <NotificationModal />
          <SignTransactionsModals />
          <Navbar />
          <Content />
        </DappProvider>
      </Router>
    </div>
  )
}

export default App
