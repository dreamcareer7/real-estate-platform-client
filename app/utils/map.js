export const allLocationBasedFilterOptions = {
  counties: null,
  mls_areas: null,
  subdivisions: null,
  school_districts: null,
  high_schools: null,
  middle_schools: null,
  primary_schools: null,
  elementary_schools: null,
  senior_high_schools: null,
  junior_high_schools: null,
  intermediate_schools: null
}

export const normalizeListingLocation = listing => {
  if (listing.location) {
    return {
      ...listing,
      lat: listing.location.latitude,
      lng: listing.location.longitude
    }
  }

  return {
    ...listing,
    lat: listing.property.address.location.latitude,
    lng: listing.property.address.location.longitude
  }
}

export const normalizeListingsForMarkers = markers =>
  markers.filter(marker => marker.location || marker.property).map(normalizeListingLocation)

const setCssPosition = buildings => {
  buildings.forEach((building, i) => {
    buildings[i].points[0].cssPosition = {
      left: 0,
      top: `${i * 21}px`
    }
  })

  return buildings
}

export const setCssPositionToListingsWithSameBuilding = clusters => {
  let newClusters = []
  const pointsGroupByLat = _.groupBy(clusters, 'lat')

  Object.keys(pointsGroupByLat).forEach(lat => {
    const listingsWithSameBuilding = pointsGroupByLat[lat]

    if (listingsWithSameBuilding.length > 1) {
      newClusters = [
        ...newClusters,
        ...setCssPosition(listingsWithSameBuilding)
      ]

      return
    }

    newClusters = [...newClusters, pointsGroupByLat[lat][0]]
  })

  return newClusters
}

export const generatePointsFromBounds = bounds => [
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  },
  {
    latitude: bounds.nw.lat,
    longitude: bounds.nw.lng
  },
  {
    latitude: bounds.sw.lat,
    longitude: bounds.sw.lng
  },
  {
    latitude: bounds.se.lat,
    longitude: bounds.se.lng
  },
  {
    latitude: bounds.ne.lat,
    longitude: bounds.ne.lng
  }
]

export const getBounds = (bounds) => {
  if (bounds == null) {
    return {}
  }

  const northEast = bounds.getNorthEast()
  const southWest = bounds.getSouthWest()

  const nw = { lat: northEast.lat(), lng: southWest.lng() }
  const sw = { lat: southWest.lat(), lng: southWest.lng() }
  const se = { lat: southWest.lat(), lng: northEast.lng() }
  const ne = { lat: northEast.lat(), lng: northEast.lng() }

  return { nw, sw, se, ne }
}

export function isLocationInTX(latitude, longitude) {
  return latitude < 36.5007041 &&
    latitude > 25.8371638 &&
    longitude < -93.5080389 &&
    longitude > -106.6456461
}

export function isLocationInDallas(latitude, longitude) {
  return latitude < 33.0237921 &&
    latitude > 32.617537 &&
    longitude < -96.4637379 &&
    longitude > -96.999347
}
