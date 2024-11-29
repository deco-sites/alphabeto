// deno-lint-ignore-file

  
  export interface Data {
    getStores: GetStores
  }
  
  export interface GetStores {
    items: Item[]
    __typename: string
  }
  
  export interface Item {
    distance: number
    name: string
    instructions: string
    id: string
    isActive: boolean
    address: Address
    pickupHolidays: any[]
    businessHours: BusinessHour[]
    __typename: string
  }

  export interface ItemWithWhatsapp extends Item {
    whatsapp: string | undefined
  }
  
  export interface Address {
    postalCode: string
    country: any
    city: string
    state: string
    neighborhood?: string
    street: string
    number?: string
    complement: string
    reference: string
    location: Location
    __typename: string
  }
  
  export interface Location {
    latitude: number
    longitude: number
    __typename: string
  }
  
  export interface BusinessHour {
    dayOfWeek: number
    openingTime: string
    closingTime: string
    __typename: string
  }