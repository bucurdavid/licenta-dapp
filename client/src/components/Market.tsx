import {Suspense, useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'
import {
  Text,
  Image,
  HStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'
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
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Address,
  AddressValue,
  BigUIntValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  U64Value,
} from '@multiversx/sdk-core/out'
import {refreshAccount} from '@multiversx/sdk-dapp/utils'
import {sendTransactions} from '@multiversx/sdk-dapp/services'
import BigNumber from 'bignumber.js'

export const Market = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [marketContractAddress, setMarketContractAddress] = useState<string>('')
  const [minterContractAddress, setMinterContractAddress] = useState<string>('')
  const [fullOffers, setFullOffers] =
    useState<{Offer: OfferWithIndex; Car: Car}[]>()
  const {address} = useGetAccountInfo()
  const {hasPendingTransactions} = useGetPendingTransactions()

  const buyCar = async (
    senderAddress: string,
    offerIndex: number,
    tokenIdentifier: string,
    price: number
  ) => {
    const acceptOfferTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('ESDTTransfer'))
        .addArg(new TokenIdentifierValue(tokenIdentifier))
        .addArg(new BigUIntValue(price))
        .addArg(new StringValue('acceptOffer'))
        .addArg(new U64Value(offerIndex))
        .build(),
      sender: new Address(senderAddress),
      receiver: new Address(marketContractAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    await refreshAccount()

    await sendTransactions({
      transactions: acceptOfferTx,
      transactionsDisplayInfo: {
        processingMessage: 'Buying vehicle...',
        errorMessage: 'Error occured',
        successMessage: 'Buy successful',
      },
      redirectAfterSign: false,
    })
  }

  useEffect(() => {
    Promise.all([
      MarketSmartContract.getContractAddress(),
      MinterSmartContract.getContractAddress(),
      MarketSmartContract.getOffers(Array.from({length: 10}, (_, i) => i + 1)), // hardcoded
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
      <h1 className="text-2xl text-white py-4">Marketplace</h1>
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
                Last Odometer Value: {offer.Car.attributes.lastOdometerValue}{' '}
                kilometers
              </div>
              <div>
                Last Odometer Date:{' '}
                {new Date(
                  offer.Car.attributes.lastOdometerTimestamp * 1000
                ).toDateString()}
              </div>
              <div className="py-2 text-black">
                <h2 className="text-white text-lg">Car odometer history:</h2>
                <ResponsiveContainer width="99%" height={300}>
                  <LineChart
                    data={offer.Car.historyData.odometerValues.map(
                      (value, index) => {
                        const date = new Date(
                          offer.Car.historyData.odometerTimestamps[index] * 1000
                        )
                        const formattedDate = date
                          .toLocaleString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          .replace(',', '') // remove the comma between date and time

                        return {
                          date: formattedDate,
                          kilometers: value,
                        }
                      }
                    )}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      domain={[
                        0,
                        Math.max(...offer.Car.historyData.odometerValues) +
                          5000,
                      ]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="kilometers"
                      stroke="orange"
                      strokeWidth={4}
                      activeDot={{r: 8}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="py-2 m-2 text-white">
                <h2 className="text-white text-lg">Car dtc history:</h2>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Date</Th>
                      <Th>DTC Errors</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {offer.Car.historyData.dtcTimestamps.map(
                      (timestamp, index) => (
                        <Tr key={index}>
                          <Td>{new Date(timestamp * 1000).toLocaleString()}</Td>
                          <Td>
                            {offer.Car.historyData.dtcCodes[index]
                              .map((buffer) => Buffer.from(buffer))
                              .join(', ')}
                          </Td>
                        </Tr>
                      )
                    )}
                  </Tbody>
                </Table>
              </div>
              <div>
                Car Status:{' '}
                {offer.Offer.offer.status.toString() === 'SecondHand'
                  ? 'Second Hand'
                  : 'New'}
              </div>

              <div>
                <div>
                  Car Price:{' '}
                  {new BigNumber(offer.Offer.offer.paymentAmount)
                    .shiftedBy(-6)
                    .toString()}{' '}
                  USD
                </div>
              </div>
            </CardBody>
            <Divider />
            <CardFooter>
              <ButtonGroup spacing="2">
                {offer.Offer.offer.owner !== address && (
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => {
                      buyCar(
                        address,
                        offer.Offer.index,
                        'USDC-8d4068',
                        offer.Offer.offer.paymentAmount
                      )
                    }}
                  >
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
