import {Route, Routes} from 'react-router-dom'
import Home from './Home'
import {Box} from '@chakra-ui/react'
import Market from './Market'
import Manufacturer from './Manufacturer'
import User from './User'

export const Content = () => {
  return (
    <Box>
      <Routes>
        <Route index path="" element={<Home />} />
        <Route path="manufacturer" element={<Manufacturer />} />
        <Route path="user" element={<User />} />
        <Route path="market" element={<Market />} />

        {/* <Route path="about" element={<About />} />
          <Route path="space" element={<Space />} />
          <Route path="space/detail" element={<CampaignDetail />} />
          <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </Box>
  )
}

export default Content
