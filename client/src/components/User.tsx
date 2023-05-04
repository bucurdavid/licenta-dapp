import React, {useEffect, useState} from 'react'
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
import {collectionWhitelist} from './utils'
import {
  Button,
  Modal,
  ModalBody,
  Image,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
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
  U8Value,
} from '@multiversx/sdk-core/out'
import {refreshAccount} from '@multiversx/sdk-dapp/utils'
import {sendTransactions} from '@multiversx/sdk-dapp/services'
import BigNumber from 'bignumber.js'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {Table, Thead, Tbody, Tr, Th, Td} from '@chakra-ui/react'

export const User = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [marketContractAddress, setMarketContractAddress] = useState<string>('')
  const [minterContractAddress, setMinterContractAddress] = useState<string>('')
  const [modalProps, setModalProps] = useState<{
    collection: string
    nonce: number
  }>()
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [listedOffers, setListedOffers] =
    useState<{identifier: string; nonce: number}[]>()

  const {address} = useGetAccountInfo()
  const {hasPendingTransactions} = useGetPendingTransactions()

  const handlePrice = (event: any) => setPrice(event.target.value)
  const [price, setPrice] = useState(0)

  const {
    isOpen: isListOpen,
    onOpen: onListOpen,
    onClose: onListClose,
  } = useDisclosure()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [market, minter, nfts, lists] = await Promise.all([
          MarketSmartContract.getContractAddress(),
          MinterSmartContract.getContractAddress(),
          fetch(
            `https://devnet-api.multiversx.com/accounts/${address}/nfts`
          ).then((response) => response.json()),
          MarketSmartContract.getUserOffers(address),
        ])
        setMarketContractAddress(market.bech32)
        setMinterContractAddress(minter.bech32)
        const tokenIdentifiers = lists.map((offer: OfferWithIndex) => ({
          identifier: offer.offer.carTokenIdentifier,
          nonce: offer.offer.carNonce,
        }))
        console.log(tokenIdentifiers)
        setListedOffers(tokenIdentifiers)
        const vehicles = await Promise.all(
          nfts
            .filter((nft: any) =>
              collectionWhitelist.includes(nft['collection'])
            )
            .map(async (nft: any) => await Car.fromApiResponse(nft))
        )
        setVehicles(vehicles)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [address, hasPendingTransactions])

  const listCar = async (
    senderAddress: string,
    marketAddress: string,
    carIdentifier: string,
    carNonce: number,
    carAmount = 1,
    wantedTokenAmount: number,
    wantedTokenIdentifier = 'USDC-8d4068'
  ) => {
    const listCarTx = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('ESDTNFTTransfer'))
        .addArg(new TokenIdentifierValue(carIdentifier))
        .addArg(new U64Value(carNonce))
        .addArg(new BigUIntValue(carAmount))
        .addArg(new AddressValue(new Address(marketAddress)))
        .addArg(new StringValue('addOffer'))
        .addArg(new TokenIdentifierValue(wantedTokenIdentifier))
        .addArg(new U64Value(0))
        .addArg(new BigUIntValue(wantedTokenAmount))
        .addArg(new U8Value(1))
        .build(),
      sender: new Address(senderAddress),
      receiver: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    await refreshAccount()

    await sendTransactions({
      transactions: listCarTx,
      transactionsDisplayInfo: {
        processingMessage: 'Listing vehicle...',
        errorMessage: 'Error occured',
        successMessage: 'List successful',
      },
      redirectAfterSign: false,
    })
  }

  return (
    <div className="text-white bg-slate-900">
      {isLoading && <p className="text-white text-center">Loading...</p>}
      {!isLoading && vehicles.length === 0 && (
        <p>No cars found in this collection</p>
      )}
      {!isLoading && vehicles.length > 0 && (
        <div>
          <h2 className="text-white font-bold p-2 text-xl">My vehicles</h2>
          <div className="grid grid-cols-2 gap-4">
            {vehicles.map((car: Car, index) => {
              return (
                <div key={index} className="bg-slate-400 m-2 p-2 text-white">
                  <ul>
                    <li>
                      <Image src={car.nftImage} />
                      <h2>{car.name}</h2>
                      <p>Make: {car.make}</p>
                      <p>Token ID: {car.tokenIdentifier}</p>
                      <p>Collection: {car.collection}</p>
                      <p>Nonce: {car.nonce}</p>
                      <ul>
                        <li>VIN: {car.attributes.vin}</li>
                        <li>Name: {car.attributes.name}</li>
                        <li>Build Year: {car.attributes.buildYear}</li>
                        <li>Plant Country: {car.attributes.plantCountry}</li>
                        <li>
                          Last odometer read: {car.attributes.lastOdometerValue}{' '}
                          kilometers
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <div className="py-2 text-black">
                    <h2 className="text-white text-lg">
                      Car odometer history:
                    </h2>
                    <LineChart
                      width={800}
                      height={400}
                      data={car.historyData.odometerValues.map(
                        (value, index) => {
                          const date = new Date(
                            car.historyData.odometerTimestamps[index] * 1000
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
                      <YAxis />
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
                  </div>
                  <div className="py-2 m-2 text-black">
                    <h2 className="text-white text-lg">Car dtc history:</h2>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>DTC Errors</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {car.historyData.dtcTimestamps.map(
                          (timestamp, index) => (
                            <Tr key={index}>
                              <Td>
                                {new Date(timestamp * 1000).toLocaleString()}
                              </Td>
                              <Td>
                                {car.historyData.dtcCodes[index].join(', ')}
                              </Td>
                            </Tr>
                          )
                        )}
                      </Tbody>
                    </Table>
                  </div>
                  <>
                    {listedOffers?.some(
                      (offer) =>
                        offer.identifier === car.collection &&
                        offer.nonce === car.nonce
                    ) ? null : (
                      <Button
                        onClick={() => {
                          setModalProps({
                            collection: car.collection,
                            nonce: car.nonce,
                          })
                          onListOpen()
                        }}
                      >
                        List this car
                      </Button>
                    )}

                    <Modal isOpen={isListOpen} onClose={onListClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>List Vehicle</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <form>
                            <div className="mb-6">
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Price:
                              </label>
                              <input
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="price"
                                onChange={handlePrice}
                                required
                              />
                            </div>
                          </form>
                        </ModalBody>

                        <ModalFooter>
                          <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={onListClose}
                          >
                            Close
                          </Button>

                          <Button
                            colorScheme="gray"
                            mr={3}
                            onClick={async () => {
                              await listCar(
                                address,
                                marketContractAddress!,
                                modalProps!.collection,
                                modalProps!.nonce,
                                1,
                                new BigNumber(price)
                                  .shiftedBy(6)
                                  .decimalPlaces(0)
                                  .toNumber() //price
                              )
                              onListClose() // close modal after listing car
                            }}
                          >
                            List car
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default User
