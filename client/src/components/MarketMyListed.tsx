import {useEffect, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {
  MarketSmartContract,
  Offer,
  OfferWithIndex,
} from '../sdk/marketSmartContract.sdk'
import {MinterSmartContract} from '../sdk/minterSmartContract.sdk'
import {Car} from '../sdk/car.sdk'
import {
  useGetAccountInfo,
  useGetPendingTransactions,
} from '@multiversx/sdk-dapp/hooks'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Image,
  CardFooter,
  Divider,
  Heading,
} from '@chakra-ui/react'
import {
  Address,
  ContractCallPayloadBuilder,
  ContractFunction,
  StringValue,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out'
import {refreshAccount} from '@multiversx/sdk-dapp/utils'
import {sendTransactions} from '@multiversx/sdk-dapp/services'

export const MarketMyListed = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [marketContractAddress, setMarketContractAddress] = useState<string>('')
  const [minterContractAddress, setMinterContractAddress] = useState<string>('')
  const [fullOffers, setFullOffers] =
    useState<{Offer: OfferWithIndex; Car: Car}[]>()
  const {address} = useGetAccountInfo()
  const {hasPendingTransactions} = useGetPendingTransactions()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      MarketSmartContract.getContractAddress(),
      MinterSmartContract.getContractAddress(),
      MarketSmartContract.getUserOffers(address), // hardcoded
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

  const cancelOffer = async (senderAddress: string, id: number) => {
    const cancelOffer = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('cancelOffer'))
        .addArg(new U64Value(id))
        .build(),
      receiver: new Address(marketContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 90000000,
      chainID: 'D',
    })

    await refreshAccount()

    await sendTransactions({
      transactions: cancelOffer,
      transactionsDisplayInfo: {
        processingMessage: 'Cancelling offer...',
        errorMessage: 'Error occured',
        successMessage: 'Offer cancelled successful',
      },
      redirectAfterSign: false,
    })
  }

  return (
    <>
      <div className="text-white p-5">
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={() => {
            goBack()
          }}
        >
          {' '}
          Public Market
        </button>

        {fullOffers?.length! > 0 ? (
          fullOffers?.map((offer) => {
            return (
              <Card className="p-2 m-4">
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
                    Last Odometer Value:{' '}
                    {offer.Car.attributes.lastOdometerValue}
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
                  <div>
                    DTC Codes: {offer.Car.historyData.dtcCodes.join(', ')}
                  </div>
                  <div>
                    DTC Timestamps:{' '}
                    {offer.Car.historyData.dtcTimestamps.join(', ')}
                  </div>
                  <div>
                    Incidents: {offer.Car.historyData.incidents.join(', ')}
                  </div>
                  <div>
                    Incident Timestamps:{' '}
                    {offer.Car.historyData.incidentTimestamps.join(', ')}
                  </div>
                  <div>Car Status: {offer.Offer.offer.status} </div>
                </CardBody>
                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => cancelOffer(address!, offer.Offer.index)}
                    >
                      Cancel Offer
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="text-white p-5">
            <h1 className="text-2xl">No cars listed</h1>
          </div>
        )}
      </div>
    </>
  )
}

export default MarketMyListed
