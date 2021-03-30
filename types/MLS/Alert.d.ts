declare interface AlertFilters {
  minimum_price?: Nullable<number>
  maximum_price?: Nullable<number>
  minimum_bedrooms?: Nullable<number>
  maximum_bedrooms?: Nullable<number>
  minimum_bathrooms?: Nullable<number>
  maximum_bathrooms?: Nullable<number>
  minimum_square_meters?: Nullable<number>
  maximum_square_meters?: Nullable<number>
  created_by?: Nullable<UUID>
  points?: Nullable<IPoint[]>
  minimum_lot_square_meters?: Nullable<number>
  maximum_lot_square_meters?: Nullable<number>
  minimum_year_built?: Nullable<number>
  maximum_year_built?: Nullable<number>
  pool?: Nullable<boolean>
  pets?: Nullable<boolean>
  number_of_pets_allowed?: Nullable<number>
  application_fee?: Nullable<boolean>
  appliances?: Nullable<boolean>
  furnished?: Nullable<boolean>
  fenced_yard?: Nullable<boolean>
  title?: Nullable<string>
  property_types: IPropertyType[]
  property_subtypes: IPropertySubtype[]
  listing_statuses?: Nullable<IListingStatus[]>
  open_house?: Nullable<boolean>
  minimum_sold_date?: Nullable<number>
  excluded_listing_ids?: Nullable<UUID[]>
  mls_areas?: Nullable<unknown[]>
  postal_codes?: Nullable<unknown[]>
  search?: Nullable<string>
  limit?: Nullable<number>
}

declare interface AlertFiltersWithRadiusAndCenter extends AlertFilters {
  radius: number
  center: IPoint
}