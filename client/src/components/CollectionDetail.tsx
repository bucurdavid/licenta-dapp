import {
  useGetAccountInfo,
  useGetPendingTransactions,
} from '@multiversx/sdk-dapp/hooks'
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {MinterSmartContract} from '../sdk/minterSmartContract.sdk'
import {Car} from '../sdk/car.sdk'

const CollectionDetail = () => {
  const {tokenIdentifier} = useParams()

  const {address} = useGetAccountInfo()
  const {hasPendingTransactions} = useGetPendingTransactions()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [vehicles, setVehicles] = useState<Car[]>([])
  const isLoggedIn = Boolean(address)

  useEffect(() => {
    setIsLoading(true)
    MinterSmartContract.getVehicles(tokenIdentifier!)
      .then((ids: number[]) =>
        Promise.all(ids.map((id) => Car.fromApi(tokenIdentifier!, id)))
      )
      .then((cars) => {
        setVehicles(cars)
      })
      .finally(() => setIsLoading(false))
  }, [address, hasPendingTransactions, tokenIdentifier])

  return (
    <div>
      {isLoading && <p className="text-white text-center">Loading...</p>}
      {!isLoading && vehicles.length === 0 && (
        <p>No cars found in this collection</p>
      )}
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollectionDetail
