/*
FIXME: Is there a better name for this? Don't want this to collide with
  say "GPS coordinates" based location. Backend seems to be using "warehouse" to
  refer to this as well. Would that be a better name for this entity?
  Also, I think the models related to Redux should have a suffix "State" so that
  they can be easily distinguished from the API models.
*/
export interface Location {
  id: string
  name: string
  organizationName?: string | null
  hasBinLocationSupport: boolean
  hasPackingSupport: boolean
  hasPartialReceivingSupport: boolean
  locationType: LocationType
}

export interface LocationType {
  description?: string
  locationTypeCode: LocationTypeCode
}

/*
The ordering is important. Read more about this enum below:
https://github.com/openboxes/openboxes/blob/develop/src/groovy/org/pih/warehouse/core/LocationTypeCode.groovy

FIXME: Which of these values have been deprecated???
*/
export enum LocationTypeCode {
  DEPOT = "DEPOT",
  BIN_LOCATION = "BIN_LOCATION",
  INTERNAL = "INTERNAL",
  DISPENSARY = "DISPENSARY",
  WARD = "WARD",
  SUPPLIER = "SUPPLIER",
  DONOR = "DONOR",
  CONSUMER = "CONSUMER",
  DISTRIBUTOR = "DISTRIBUTOR",
  DISPOSAL = "DISPOSAL",
  VIRTUAL = "VIRTUAL"
}

