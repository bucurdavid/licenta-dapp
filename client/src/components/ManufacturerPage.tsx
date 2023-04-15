import {
  useGetAccountInfo,
  useGetPendingTransactions,
} from '@multiversx/sdk-dapp/hooks'
import {useEffect, useState} from 'react'
import {MinterSmartContract} from '../sdk/minterSmartContract.sdk'
import {Manufacturer} from './interfaces'

export const ManufacturerPage = () => {
  const {address} = useGetAccountInfo()
  const [manufacturer, setManufacturer] = useState<Manufacturer>()
  const {hasPendingTransactions} = useGetPendingTransactions()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const isLoggedIn = Boolean(address)
  const isManufacturer = Boolean(manufacturer?.name)

  useEffect(() => {
    MinterSmartContract.getManufacturer(address).then(
      (manufacturer: Manufacturer) => {
        console.log(manufacturer)
        if (manufacturer) {
          setManufacturer(manufacturer)
          setIsLoading(false)
        }
      }
    )
    console.log(hasPendingTransactions)
  }, [address, hasPendingTransactions])
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
                  </div>
                  <div className="pt-5 grid grid-cols-4">
                    <div className="bg-slate-200 text-black text-left p-2 m-2">
                      {manufacturer?.models.map((model) => (
                        <div key={model.tokenIdentifier}>
                          <h3>
                            Collection Name: <span>{model.name}</span>
                          </h3>
                          <h3>
                            Token Identifier:{' '}
                            <span>{model.tokenIdentifier}</span>
                          </h3>
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
