import {
  useGetAccountInfo,
  useGetPendingTransactions,
} from '@multiversx/sdk-dapp/hooks'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {MinterSmartContract} from '../sdk/minterSmartContract.sdk'
import {Car} from '../sdk/car.sdk'
import {getAccountBalance, refreshAccount} from '@multiversx/sdk-dapp/utils'
import {sendTransactions} from '@multiversx/sdk-dapp/services'
import {
  Address,
  AddressValue,
  BigUIntValue,
  BooleanValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  StringValue,
  TokenIdentifierValue,
  Transaction,
  U64Value,
  U8Value,
} from '@multiversx/sdk-core/out'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import {
  MarketSmartContract,
  OfferWithIndex,
} from '../sdk/marketSmartContract.sdk'
import BigNumber from 'bignumber.js'
import {numberToPaddedHex} from './utils'

const CollectionDetail = () => {
  const {tokenIdentifier} = useParams()
  const {address} = useGetAccountInfo()
  const {hasPendingTransactions} = useGetPendingTransactions()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [minterContractAddress, setMinterContractAddress] = useState<string>()
  const [marketContractAddress, setMarketContractAddress] = useState<string>()
  const [vehicles, setVehicles] = useState<Car[]>([])
  const [listedOffers, setListedOffers] =
    useState<{identifier: string; nonce: number}[]>()

  const [vin, setVin] = useState('')
  const handleVin = (event: any) => setVin(event.target.value)
  const [vehicleName, setVehicleName] = useState('')
  const handleVehicleName = (event: any) => setVehicleName(event.target.value)
  const [buildYear, setBuildYear] = useState(0)
  const handleBuildYear = (event: any) => setBuildYear(event.target.value)
  const [plantCountry, setPlantCountry] = useState('')
  const handlePlantCountry = (event: any) => setPlantCountry(event.target.value)
  const [media, setMedia] = useState('')
  const handleMedia = (event: any) => setMedia(event.target.value)

  const handlePrice = (event: any) => setPrice(event.target.value)
  const [price, setPrice] = useState(0)

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const {
    isOpen: isListOpen,
    onOpen: onListOpen,
    onClose: onListClose,
  } = useDisclosure()

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      MarketSmartContract.getContractAddress(),
      MinterSmartContract.getContractAddress(),
      MinterSmartContract.getVehicles(tokenIdentifier!).then((ids: number[]) =>
        Promise.all(ids.map((id) => Car.fromApi(tokenIdentifier!, id)))
      ),
      MarketSmartContract.getUserOffers(address),
    ])
      .then(([market, address, cars, offers]) => {
        setMarketContractAddress(market.bech32)
        setMinterContractAddress(address.bech32)
        setVehicles(cars)
        const tokenIdentifiers = offers.map((offer: OfferWithIndex) => ({
          identifier: offer.offer.carTokenIdentifier,
          nonce: offer.offer.carNonce,
        }))
        console.log(tokenIdentifiers)
        setListedOffers(tokenIdentifiers)
      })
      .finally(() => setIsLoading(false))
  }, [address, hasPendingTransactions, tokenIdentifier])

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
        .addArg(new U8Value(0))
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

  const withdraw = async (
    senderAddress: string,
    tokenIdentifier: string,
    nonce: number
  ) => {
    const withdrawCars = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('withdrawCars'))
        .addArg(new BooleanValue(false))
        .addArg(new TokenIdentifierValue(tokenIdentifier!))
        .addArg(new U64Value(nonce))
        .build(),
      receiver: new Address(minterContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 19000000,
      chainID: 'D',
    })
    await refreshAccount()

    await sendTransactions({
      transactions: withdrawCars,
      transactionsDisplayInfo: {
        processingMessage: 'Withdrawing Cars...',
        errorMessage: 'Error occured',
        successMessage: 'Withdraw successful',
      },
      redirectAfterSign: false,
    })
  }

  const createVehicle = async (
    senderAddress: string,
    tokenIdentifier: string,
    vin: string,
    modelName: string,
    buildYear: number,
    plantCountry: string,
    media: string
  ) => {
    const createVehicle = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('createVehicle'))
        .addArg(new TokenIdentifierValue(tokenIdentifier))
        .addArg(new StringValue(vin))
        .addArg(new StringValue(modelName))
        .addArg(new U64Value(buildYear))
        .addArg(new StringValue(plantCountry))
        .addArg(new StringValue(media))
        .build(),
      receiver: new Address(minterContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })
    await refreshAccount()

    await sendTransactions({
      transactions: createVehicle,
      transactionsDisplayInfo: {
        processingMessage: 'Creating vehicle...',
        errorMessage: 'Error occured',
        successMessage: 'Creation successful',
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
      <>
        <Button className="m-2" onClick={onCreateOpen}>
          Create vehicle (mint)
        </Button>
        <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>List Vehicle</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form className="px-2">
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    VIN:
                  </label>
                  <input
                    id="vin"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="WUZZZZ8KZ9A123456"
                    onChange={handleVin}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Model Name:
                  </label>
                  <input
                    id="model-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleVehicleName}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Build Year:
                  </label>
                  <input
                    id="build-year"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleBuildYear}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Plant country:
                  </label>
                  <input
                    id="plant-country"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handlePlantCountry}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Image url:
                  </label>
                  <input
                    id="image-url"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleMedia}
                    required
                  />
                </div>
              </form>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onCreateClose}>
                Close
              </Button>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={async () => {
                  createVehicle(
                    address,
                    tokenIdentifier!,
                    vin,
                    vehicleName,
                    buildYear,
                    plantCountry,
                    media
                  )

                  onCreateClose() // close modal after listing car
                }}
              >
                Create vehicle
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
      {!isLoading && vehicles.length > 0 && (
        <div>
          <h2 className="text-white font-bold p-2 text-xl">Vehicles</h2>
          <div className="grid grid-cols-4 gap-4">
            {vehicles.map((car: Car, index) => (
              <div key={index} className="bg-slate-400 m-2 p-2 text-white">
                <ul>
                  <li>
                    <h2>{car.name}</h2>
                    <p>Make: {car.make}</p>
                    <p>Token ID: {car.tokenIdentifier}</p>
                    <p>Collection: {car.collection}</p>
                    <p>Supply: {car.supply}</p>
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
                <>
                  {listedOffers?.some(
                    (offer) =>
                      offer.identifier === car.collection &&
                      offer.nonce === car.nonce
                  ) ? null : (
                    <Button onClick={onListOpen}>List this car</Button>
                  )}
                  <Button
                    onClick={() => {
                      withdraw(address, car.collection, car.nonce)
                    }}
                  >
                    withdraw this car
                  </Button>
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
                        <Button colorScheme="blue" mr={3} onClick={onListClose}>
                          Close
                        </Button>

                        <Button
                          colorScheme="gray"
                          mr={3}
                          onClick={async () => {
                            await listCar(
                              address,
                              marketContractAddress!,
                              car.collection,
                              car.nonce,
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
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionDetail
