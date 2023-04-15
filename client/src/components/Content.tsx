import {Route, Routes} from 'react-router-dom'
import Home from './Home'
import Market from './Market'
import {ManufacturerPage} from './ManufacturerPage'
import User from './User'

export const Content = () => {
  return (
    <Routes>
      <Route index path="" element={<Home />} />
      <Route path="manufacturer" element={<ManufacturerPage />} />
      <Route path="user" element={<User />} />
      <Route path="market" element={<Market />} />

      {/* <Route path="about" element={<About />} />
          <Route path="space" element={<Space />} />
          <Route path="manufacturer/collection-detail" element={<CampaignDetail />} />
          <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  )
}

export default Content
