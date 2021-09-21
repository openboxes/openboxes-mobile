import Location from "./Location";

export default interface Order {
  id: string
  name: string
  description?: string | null
  origin: Location | null
  destination: Location | null
}
