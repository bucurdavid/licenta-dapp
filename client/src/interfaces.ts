export interface HistoryData {
  odometerValues: number[]
  odometerTimestamps: number[]
  dtcCodes: string[][]
  dtcTimestamps: number[]
  incidents: boolean[]
  incidentTimestamps: number[]
}

export interface Model {
  name: string
  tokenIdentifier: string
}

export interface Manufacturer {
  name: string
  models: Model[]
}

export enum CarStatus {
  New,
  SecondHand,
}

export interface Offers {
  owner: string
  carTokenIdentifier: string
  carNonce: number
  carAmount: number
  paymentTokenIdentifier: string
  paymentNonce: number
  paymentAmount: number
  status: CarStatus
  quantity: number
}

export interface CarAttributes {
  vin: string
  name: string
  buildYear: number
  plantCountry: string
  lastOdometerValue: number
  lastOdometerTimestamp: number
}
