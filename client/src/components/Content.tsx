import {Route, Routes, useNavigate} from 'react-router-dom'
import Home from './Home'
import Market from './Market'
import {ManufacturerPage} from './ManufacturerPage'
import User from './User'
import CollectionDetail from './CollectionDetail'
import {useEffect} from 'react'
import {useGetAccountInfo} from '@multiversx/sdk-dapp/hooks'
import {MarketMyListed} from './MarketMyListed'

export const Content = () => {
  const {address} = useGetAccountInfo()
  const isLoggedIn = Boolean(address)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])
  return (
    <Routes>
      <Route index path="" element={<Home />} />
      <Route path="manufacturer" element={<ManufacturerPage />} />
      <Route path="user" element={<User />} />
      <Route path="market" element={<Market />} />
      <Route path="market/my-listed" element={<MarketMyListed />} />
      <Route
        path="manufacturer/collection/:tokenIdentifier"
        element={<CollectionDetail />}
      />
      {/* <Route path="about" element={<About />} />
          <Route path="space" element={<Space />} />
          
          <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  )
}

export default Content
