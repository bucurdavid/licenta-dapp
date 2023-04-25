import {
  useGetAccountInfo,
  useGetPendingTransactions,
} from '@multiversx/sdk-dapp/hooks'
import {useEffect, useState} from 'react'
import {MinterSmartContract} from '../sdk/minterSmartContract.sdk'
import {Manufacturer} from './interfaces'
import {NavLink} from 'react-router-dom'
import {
  Address,
  BooleanValue,
  ContractCallPayloadBuilder,
  ContractFunction,
  StringValue,
  TokenTransfer,
  Transaction,
} from '@multiversx/sdk-core/out'
import {refreshAccount} from '@multiversx/sdk-dapp/utils'
import {sendTransactions} from '@multiversx/sdk-dapp/services'
import {Button} from '@chakra-ui/button'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'

export const ManufacturerPage = () => {
  const {address} = useGetAccountInfo()
  const [manufacturer, setManufacturer] = useState<Manufacturer>()
  const [isManufacturer, setIsManufacturer] = useState<boolean>(false)
  const {hasPendingTransactions} = useGetPendingTransactions()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isLoggedIn = Boolean(address)

  const [minterContractAddress, setMinterContractAddress] = useState<string>()
  const {isOpen, onOpen, onClose} = useDisclosure()

  const [modelName, setModelName] = useState('')
  const handleModelName = (event: any) => setModelName(event.target.value)
  const [ticker, setTicker] = useState('')
  const handleTicker = (event: any) => setTicker(event.target.value)
  const [manufacturerName, setManufacturerName] = useState('')
  const handleManufacturerName = (event: any) =>
    setManufacturerName(event.target.value)
  useEffect(() => {
    Promise.all([
      MinterSmartContract.checkAddressIsWhitelisted(address),
      MinterSmartContract.getContractAddress(),
      MinterSmartContract.getManufacturer(address),
    ]).then(([isWhitelisted, contractAddress, manufacturer]) => {
      setManufacturer(manufacturer)
      setIsManufacturer(isWhitelisted)
      setMinterContractAddress(contractAddress.bech32)
      setIsLoading(false)
    })
  }, [isManufacturer, address, hasPendingTransactions])

  const initiateManufacturer = async (senderAddress: string, name: string) => {
    const initManufacturer = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('initializeManufacturer'))
        .addArg(new StringValue(name))
        .build(),
      receiver: new Address(minterContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 12000000,
      chainID: 'D',
    })

    await refreshAccount()

    await sendTransactions({
      transactions: initManufacturer,
      transactionsDisplayInfo: {
        processingMessage: 'Initiating...',
        errorMessage: 'Error occured',
        successMessage: 'Initiation successful',
      },
      redirectAfterSign: false,
    })
  }

  const setLocalRoles = async (
    senderAddress: string,
    tokenIdentifier: string
  ) => {
    const setLocalRoles = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setLocalRoles'))
        .addArg(new StringValue(tokenIdentifier))
        .build(),
      receiver: new Address(minterContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 90000000,
      chainID: 'D',
    })

    await refreshAccount()

    await sendTransactions({
      transactions: setLocalRoles,
      transactionsDisplayInfo: {
        processingMessage: 'setting Roles...',
        errorMessage: 'Error occured',
        successMessage: 'Roles set successful',
      },
      redirectAfterSign: false,
    })
  }

  const setTransferRole = async (
    senderAddress: string,
    tokenIdentifier: string
  ) => {
    const setTransferRole = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('setTransferRole'))
        .addArg(new StringValue(tokenIdentifier))
        .build(),
      receiver: new Address(minterContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 80000000,
      chainID: 'D',
    })

    await refreshAccount()

    await sendTransactions({
      transactions: setTransferRole,
      transactionsDisplayInfo: {
        processingMessage: 'Setting Transfer Roles...',
        errorMessage: 'Error occured',
        successMessage: 'Roles set successful',
      },
      redirectAfterSign: false,
    })
  }

  const createModel = async (
    senderAddress: string,
    modelName: string,
    ticker: string
  ) => {
    const createModel = new Transaction({
      value: TokenTransfer.egldFromAmount(0.05),
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('createModel'))
        .addArg(new StringValue(modelName))
        .addArg(new StringValue(ticker))
        .build(),
      receiver: new Address(minterContractAddress!),
      sender: new Address(senderAddress),
      gasLimit: 120000000,
      chainID: 'D',
    })

    await refreshAccount()

    await sendTransactions({
      transactions: createModel,
      transactionsDisplayInfo: {
        processingMessage: 'Creating Model...',
        errorMessage: 'Error occured',
        successMessage: 'Creation successful',
      },
      redirectAfterSign: false,
    })
  }

  const withdraw = async (senderAddress: string) => {
    const withdrawCars = new Transaction({
      value: 0,
      data: new ContractCallPayloadBuilder()
        .setFunction(new ContractFunction('withdrawCars'))
        .addArg(new BooleanValue(true))
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

  return (
    <div className="text-white p-4">
      {isLoggedIn ? (
        <>
          {!isLoading ? (
            <>
              <h1 className="text-lg">Manufacturer Page</h1>
              {isManufacturer ? (
                <>
                  <div className="pt-10">
                    <h2 className="font-bold text-2xl">
                      Make:{' '}
                      <span className="font-normal">{manufacturer?.name}</span>
                    </h2>
                    {manufacturer?.name.length == 0 && (
                      <>
                        <form>
                          <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                              Make:
                            </label>
                            <input
                              id="model-name"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              placeholder="AUDI/BMW"
                              onChange={handleManufacturerName}
                              required
                            />
                          </div>
                        </form>
                        <Button
                          onClick={() => {
                            initiateManufacturer(address, manufacturerName)
                          }}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </div>
                  <div>
                    <Button className="my-4" onClick={onOpen}>
                      Crete Model
                    </Button>
                    <Button className="mx-2" onClick={() => withdraw(address)}>
                      Withdraw all cars
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalOverlay />
                      <ModalContent>
                        <ModalHeader>Fill the fields</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                          <form>
                            <div className="mb-6">
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Model Name (Collection Name):
                              </label>
                              <input
                                id="model-name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="AUDIA4"
                                onChange={handleModelName}
                                required
                              />
                            </div>
                            <div className="mb-6">
                              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Ticker:
                              </label>
                              <input
                                id="ticker"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="AUDIA4"
                                onChange={handleTicker}
                                required
                              />
                            </div>
                          </form>
                        </ModalBody>
                        <ModalFooter>
                          <Button colorScheme="blue" mr={3} onClick={onClose}>
                            Close
                          </Button>
                          <Button
                            colorScheme="gray"
                            mr={3}
                            onClick={async () => {
                              createModel(address, modelName, ticker)
                              onClose() // close modal after listing car
                            }}
                          >
                            Create
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </div>
                  <div className="pt-5">
                    <div className="text-white text-left p-2 m-2 grid grid-cols-4 gap-4">
                      {manufacturer?.models.map((model) => (
                        <div
                          className="bg-slate-500 p-4"
                          key={model.tokenIdentifier}
                        >
                          <h3>
                            Collection Name: <span>{model.name}</span>
                          </h3>
                          <h3>
                            Token Identifier:{' '}
                            <span>{model.tokenIdentifier}</span>
                          </h3>
                          <NavLink
                            to={`collection/${model.tokenIdentifier}`}
                            className="text-blue-500"
                          >
                            See Vehicles
                          </NavLink>
                          <button
                            className="text-blue-500 mx-2"
                            onClick={() =>
                              setLocalRoles(address, model.tokenIdentifier)
                            }
                          >
                            Set local roles
                          </button>
                          <button
                            className="text-blue-500 mx-2"
                            onClick={() =>
                              setTransferRole(address, model.tokenIdentifier)
                            }
                          >
                            Set transfer roles
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-lg text-center">
                  You are not a manufacturer
                </div>
              )}
            </>
          ) : (
            <div className="text-lg text-center">Loading...</div>
          )}
        </>
      ) : (
        <div className="text-lg text-center">
          Welcome, please connect your wallet to continue...
        </div>
      )}
    </div>
  )
}
export default ManufacturerPage
