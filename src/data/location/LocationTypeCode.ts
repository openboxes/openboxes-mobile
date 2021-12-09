/*
The ordering is important. Read more about this enum below:
https://github.com/openboxes/openboxes/blob/develop/src/groovy/org/pih/warehouse/core/LocationTypeCode.groovy

FIXME: Which of these values have been deprecated???
*/
export enum LocationTypeCode {
  DEPOT = 'DEPOT',
  BIN_LOCATION = 'BIN_LOCATION',
  INTERNAL = 'INTERNAL',
  DISPENSARY = 'DISPENSARY',
  WARD = 'WARD',
  SUPPLIER = 'SUPPLIER',
  DONOR = 'DONOR',
  CONSUMER = 'CONSUMER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  DISPOSAL = 'DISPOSAL',
  VIRTUAL = 'VIRTUAL',
}
