import {Location} from "../location/Models";
import {User} from "./User";
import {Locale} from "../Locale";

export interface Session {
  location: Location
  isSuperuser: boolean
  isUserAdmin: boolean
  /*
  FIXME
    This is supposed to be locale code. If the number of locales supported is finite, then we
    should describe it as an enum.
   */
  activeLanguage: string
  user: User
  logoLabel: string
  logoUrl: string
  supportedLocales: Locale[]
}
