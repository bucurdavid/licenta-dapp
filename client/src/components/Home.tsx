import {PlusSquareIcon, StarIcon} from '@chakra-ui/icons'
import {NavLink} from 'react-router-dom'
import {useGetAccountInfo} from '@multiversx/sdk-dapp/hooks'

export const Home = () => {
  const {address} = useGetAccountInfo()
  const isLoggedIn = Boolean(address)

  return (
    <div className="mt-20 mx-2">
      {isLoggedIn ? (
        <div className="flex justify-evenly">
          <NavLink
            to={'manufacturer'}
            className="flex grow flex-col items-center bg-blue-200 hover:bg-blue-600 hover:scale-105 p-8 rounded-lg font-medium border-2"
          >
            <div className="mb-2">Manufacturer</div>
            <PlusSquareIcon boxSize={100}></PlusSquareIcon>
          </NavLink>
          <NavLink
            to={'manufacturer'}
            className="flex grow flex-col items-center bg-blue-200 hover:bg-blue-600 hover:scale-105 p-8 rounded-lg font-medium border-2"
          >
            <div className="mb-2">Market</div>
            <PlusSquareIcon boxSize={100}></PlusSquareIcon>
          </NavLink>
          <NavLink
            to={'user'}
            className="flex flex-col grow items-center bg-blue-200 hover:bg-blue-600 hover:scale-105 p-8 rounded-lg font-medium border-2"
          >
            <div className="mb-2">User</div>
            <StarIcon boxSize={100}></StarIcon>
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
