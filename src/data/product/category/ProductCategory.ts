export interface ProductCategory {
  id: string
  name: string
  parentCategory?: ProductCategory | null
}
