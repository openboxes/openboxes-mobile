import LocationGroup from "./LocationGroup";
import LocationType from "./LocationType";

/*
FIXME: Is there a better name for this? Don't want this to collide with
  say "GPS coordinates" based location. Backend seems to be using "warehouse" to
  refer to this as well. Would that be a better name for this entity?
  Also, I think the models related to Redux should have a suffix "State" so that
  they can be easily distinguished from the API models.
*/
export default interface Location {
  id: string
  name: string
  locationGroup: LocationGroup
  organizationName?: string | null
  hasBinLocationSupport: boolean
  hasPackingSupport: boolean
  hasPartialReceivingSupport: boolean
  locationType: LocationType
}
