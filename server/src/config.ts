export interface CarAttributes {
  vin: string
  name: string
  buildYear: number
  plantCountry: string
  lastOdometerValue: number
  lastOdometerTimestamp: number
}

export interface HistoryData {
  odometerValues: number[]
  odometerTimestamps: number[]
  dtcCodes: string[][]
  dtcTimestamps: number[]
  incidents: boolean[]
  incidentTimestamps: number[]
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

export interface Model {
  name: string
  tokenIdentifier: string
}

export interface Manufacturer {
  name: string
  models: Model[]
}

export const minterContractAddress =
  'erd1qqqqqqqqqqqqqpgqks3uwdl7htl4z5dtkp462k783yxknmnchn9q9ezeg9'
export const dataContractAddres =
  'erd1qqqqqqqqqqqqqpgqpjfycjjyypr5katnsh503yyg0upezxedhn9qgwaemy'
export const marketContractAddress =
  'erd1qqqqqqqqqqqqqpgq0zpe7un05kwe2hz4hd2fsnuycm6qgyp6hn9qft3q3y'

export class HelloWorldClass {
  checkInternalServerHealth() {
    return {data: 'hello'}
  }
}
