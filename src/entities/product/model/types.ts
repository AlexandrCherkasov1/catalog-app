export interface ProductCharacteristicDto {
  label: string;
  name: string;
  value: string;
}

export interface ProductLabelsDto {
  discount?: string;
  first_weapon?: string;
  new?: string;
}

export interface ProductTraitsDto {
  value: string;
}

export interface ProductDto {
  available: boolean;
  characteristics: ProductCharacteristicDto[];
  cml2_traits?: ProductTraitsDto;
  id: number;
  labels: ProductLabelsDto;
  name: string;
  preview_picture?: string;
  price: number;
  price_discount: number;
  quantity: number;
  reviews: number;
}

export interface ProductsResponseDto {
  count_items: number;
  items: ProductDto[];
  per_page: number;
}