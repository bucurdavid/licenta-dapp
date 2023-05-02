import {Suspense, useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {Text, Image, HStack} from '@chakra-ui/react'
import {
  MarketSmartContract,
  OfferWithIndex,
} from '../sdk/marketSmartContract.sdk'
import {MinterSmartContract} from '../sdk/minterSmartContract.sdk'
import {
  useGetAccountInfo,
  useGetPendingTransactions,
} from '@multiversx/sdk-dapp/hooks'
import {Car} from '../sdk/car.sdk'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Spinner,
} from '@chakra-ui/react'

export const Market = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [marketContractAddress, setMarketContractAddress] = useState<string>('')
  const [minterContractAddress, setMinterContractAddress] = useState<string>('')
  const [fullOffers, setFullOffers] =
    useState<{Offer: OfferWithIndex; Car: Car}[]>()
  const {address} = useGetAccountInfo()
  const {hasPendingTransactions} = useGetPendingTransactions()

  useEffect(() => {
    Promise.all([
      MarketSmartContract.getContractAddress(),
      MinterSmartContract.getContractAddress(),
      MarketSmartContract.getOffers(Array.from({length: 100}, (_, i) => i + 1)), // hardcoded
    ])
      .then(([market, minter, offers]) => {
        setMarketContractAddress(market.bech32)
        setMinterContractAddress(minter.bech32)
        Promise.all(
          offers.map(
            (offer: OfferWithIndex) =>
              Car.fromApi(
                offer.offer.carTokenIdentifier!,
                offer.offer.carNonce
              ).then((car) => ({Offer: offer, Car: car})) // add the Car object to the Offer object
          )
        ).then((updatedOffers) => {
          console.log(updatedOffers)
          setFullOffers(updatedOffers)
        })
      })
      .finally(() => setIsLoading(false))
  }, [address, hasPendingTransactions])
  return (
    <div className="p-4">
      <NavLink
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        to="my-listed"
      >
        {' '}
        My Listed Cars
      </NavLink>
      {isLoading ? (
        <div className="text-lg text-center text-white">Loading...</div>
      ) : !fullOffers ? (
        <div className="text-white p-5">
          <h1 className="text-2xl">No cars listed</h1>
        </div>
      ) : (
        fullOffers.map((offer) => (
          <Card className="p-2 m-4" key={offer.Offer.index}>
            <CardBody>
              <Image src={offer.Car.nftImage} />
              <Heading size="md">{offer.Car.name}</Heading>
              <div>Token Identifier: {offer.Car.tokenIdentifier}</div>
              <div>Collection: {offer.Car.collection}</div>
              <div>Nonce: {offer.Car.nonce}</div>
              <div>Name: {offer.Car.name}</div>
              <div>Make: {offer.Car.make}</div>
              <div>Supply: {offer.Car.supply}</div>
              <div>Vin: {offer.Car.attributes.vin}</div>
              <div>Build Year: {offer.Car.attributes.buildYear}</div>
              <div>Plant Country: {offer.Car.attributes.plantCountry}</div>
              <div>
                Last Odometer Value: {offer.Car.attributes.lastOdometerValue}
              </div>
              <div>
                Last Odometer Timestamp:{' '}
                {offer.Car.attributes.lastOdometerTimestamp}
              </div>
              <div>
                Odometer Values:{' '}
                {offer.Car.historyData.odometerValues.join(', ')}
              </div>
              <div>
                Odometer Timestamps:{' '}
                {offer.Car.historyData.odometerTimestamps.join(', ')}
              </div>
              <div>DTC Codes: {offer.Car.historyData.dtcCodes.join(', ')}</div>
              <div>
                DTC Timestamps: {offer.Car.historyData.dtcTimestamps.join(', ')}
              </div>
              <div>Incidents: {offer.Car.historyData.incidents.join(', ')}</div>
              <div>
                Incident Timestamps:{' '}
                {offer.Car.historyData.incidentTimestamps.join(', ')}
              </div>
              <div>Car Status: {offer.Offer.offer.status} </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing="2">
                {offer.Offer.offer.owner !== address && (
                  <Button variant="solid" colorScheme="blue">
                    Buy now
                  </Button>
                )}
              </ButtonGroup>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

export default Market
