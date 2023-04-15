import {NavLink} from 'react-router-dom'
import {useGetAccountInfo} from '@multiversx/sdk-dapp/hooks'
import {IoCarSport} from 'react-icons/io5'
import {FaUserAlt} from 'react-icons/fa'
import {MdOutlinePrecisionManufacturing} from 'react-icons/md'
export const Home = () => {
  const {address} = useGetAccountInfo()
  const isLoggedIn = Boolean(address)

  return (
    <div className="mt-20 mx-2">
      {isLoggedIn ? (
        <div className="flex justify-evenly">
          <NavLink
            to={'manufacturer'}
            className="flex flex-col w-[20%] items-center bg-blue-200 hover:bg-blue-600 hover:scale-105 p-8 rounded-lg font-medium border-2"
          >
            <div className="mb-2">Manufacturer</div>
            <MdOutlinePrecisionManufacturing size={'40px'} />
          </NavLink>
          <NavLink
            to={'market'}
            className="flex flex-col w-[20%] items-center bg-blue-200 hover:bg-blue-600 hover:scale-105 p-8 rounded-lg font-medium border-2"
          >
            <div className="mb-2">Market</div>
            <IoCarSport size={'40px'} />
          </NavLink>
          <NavLink
            to={'user'}
            className="flex flex-col w-[20%] items-center bg-blue-200 hover:bg-blue-600 hover:scale-105 p-8 rounded-lg font-medium border-2"
          >
            <div className="mb-2">User</div>
            <FaUserAlt size={'40px'} />
          </NavLink>
        </div>
      ) : (
        <div className="text-lg text-center">
          Welcome, please connect your wallet to continue...
        </div>
      )}
    </div>
  )
}

export default Home
