export interface LpexpressToken {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

export interface CnPart {
  summary: string;
  weight: number;
  quantity: number;
  amount: string;
  currencyCode: string;
  countryCode: string;
  sortOrder?: number;
}

export interface Cn22Form {
  parcelType: string;
  cnParts: CnPart[];
  id?: string;
}

export interface Address {
  country: string;
  postalCode: string;
  locality: string;
  address1?: string;
  street?: string;
  building?: string;
}

export interface Receiver {
  id?: string;
  name: string;
  address: Address;
  phone: string;
  email?: string;
}

export interface Sender {
  id?: string;
  name: string;
  address: Address;
  phone: string;
  email?: string;
}

export enum ShipmentStatus {
  LABEL_CREATED = "LABEL_CREATED",
  PENDING = "PENDING",
}

export interface Documents {
  cn22Form?: Cn22Form;
}

export interface AdditionalService {
  id: number;
  title?: string;
  description?: string;
  summary?: string;
  price?: { amount: 0; currency: "EUR" };
}

export interface Shipment {
  template: number;
  weight: number;
  partCount: number;
  documents: Documents;
  sender?: Sender;
  receiver: Receiver;
  additionalServices?: AdditionalService[];
  id?: string;
  createdOn?: string;
  barcode?: string;
  price?: { amount: 3.8; vat: 0; currency: "EUR" };
  status?: ShipmentStatus;
  type?: string;
  size?: string;
  title?: string;
  addressResolverInfo?: any[];
}

export interface Sticker {
  itemId: string;
  label: string;
  contentType: string;
}
