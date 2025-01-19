import {CatalogItemType} from "./CatalogItemType";

export type CatalogSearchResponseType = {
  items: CatalogItemType[]
  next?: string
  current?: string
  previous?: string
}