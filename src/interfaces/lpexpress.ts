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
  address1: string;
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

export interface Shipment {
  template: number;
  weight: number;
  partCount: number;
  documents: {
    cn22Form: Cn22Form;
  };
  sender?: Sender;
  receiver: Receiver;
  additionalServices?: [
    {
      id: 2;
      title: "Pirmenybinis siuntimas";
      description: 'Siunta, kuri žymima specialiu "Prioritaire/Pirmenybinė" ženklu ir yra pristatoma pirmumo tvarka.';
      summary: "Siunta pažymėta ženklu „Prioritaire / Pirmenybinė“ ir gavėją pasiekia greičiau.";
      price: { amount: 0; currency: "EUR" };
    }
  ];
  id?: string;
  createdOn?: string;
  barcode?: string;
  price?: { amount: 3.8; vat: 0; currency: "EUR" };
  status?: string;
  type?: string;
  size?: string;
  title?: string;
  addressResolverInfo?: any[];
}
