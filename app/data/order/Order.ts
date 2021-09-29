import Location from "./Location";

export default interface Order {
  id: string
  name: string
  description?: string | null
  identifier?: string | null
  statusCode?: string | null
  requestedDeliveryDate?: Date | null
  origin: Location | null
  destination: Location | null
}
