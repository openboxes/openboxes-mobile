export interface VM {
  header: string
  name: string
  description: string
  details: DetailsItemVM[]
}

export interface DetailsItemVM {
  key: string
  name: string
  value: string
}
