export const query = `

query getStores($latitude: Float, $longitude: Float, $filterByTag: String) {
    getStores(latitude: $latitude, longitude: $longitude, keyword: $filterByTag)
      @context(provider: "vtex.store-locator") {
      items {
        name
        id
        address {
          postalCode
          city
          state
          neighborhood
          street
          number
          location {
            latitude
            longitude
          }
        }
        businessHours {
          dayOfWeek
          openingTime
          closingTime
        }
      }
    }
  }
  `;