export enum FinancialStatus {
  AUTHORIZED = "authorized",
  EXPIRED = "expired",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  PARTIALLY_REFUNDED = "partially_refunded",
  PENDING = "pending",
  REFUNDED = "refunded",
  UNPAID = "unpaid",
  VOIDED = "voided",
}

export interface BillingAddress {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: null;
  country: string;
  last_name: string;
  address2: null;
  company: null;
  latitude: null;
  longitude: null;
  name: string;
  country_code: string;
  province_code: null;
}

export interface Customer {
  id: number;
  email: string;
  accepts_marketing: false;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  state: string;
  note: null;
  verified_email: boolean;
  multipass_identifier: null;
  tax_exempt: boolean;
  phone: string;
  email_marketing_consent: {
    state: string;
    opt_in_level: string;
    consent_updated_at: null;
  };
  sms_marketing_consent: {
    state: string;
    opt_in_level: string;
    consent_updated_at: null;
    consent_collected_from: string;
  };
  tags: string;
  currency: string;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: null;
  tax_exemptions: [];
  admin_graphql_api_id: string;
  default_address: {
    id: number;
    customer_id: number;
    first_name: string;
    last_name: string;
    company: null;
    address1: string;
    address2: null;
    city: string;
    province: null;
    country: string;
    zip: string;
    phone: string;
    name: string;
    province_code: null;
    country_code: string;
    country_name: string;
    default: boolean;
  };
}

export interface LineItem {
  id: number;
  admin_graphql_api_id: string;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: any;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  product_exists: boolean;
  product_id: number;
  properties: any[];
  quantity: number;
  requires_shipping: true;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  variant_id: number;
  variant_inventory_management: string;
  variant_title: string;
  vendor: string;
  tax_lines: any[];
  duties: any[];
  discount_allocations: any[];
}

export interface Order {
  id: number;
  admin_graphql_api_id: string;
  app_id: 1608003;
  browser_ip: null;
  buyer_accepts_marketing: false;
  cancel_reason: null;
  cancelled_at: null;
  cart_token: null;
  checkout_id: null;
  checkout_token: null;
  client_details: null;
  closed_at: null;
  confirmed: true;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: {
    shop_money: {
      amount: "0.30";
      currency_code: "EUR";
    };
    presentment_money: {
      amount: "0.30";
      currency_code: "EUR";
    };
  };
  current_total_additional_fees_set: null;
  current_total_discounts: "0.00";
  current_total_discounts_set: {
    shop_money: {
      amount: "0.00";
      currency_code: "EUR";
    };
    presentment_money: {
      amount: "0.00";
      currency_code: "EUR";
    };
  };
  current_total_duties_set: null;
  current_total_price: "0.30";
  current_total_price_set: {
    shop_money: {
      amount: "0.30";
      currency_code: "EUR";
    };
    presentment_money: {
      amount: "0.30";
      currency_code: "EUR";
    };
  };
  current_total_tax: "0.00";
  current_total_tax_set: {
    shop_money: {
      amount: "0.00";
      currency_code: "EUR";
    };
    presentment_money: {
      amount: "0.00";
      currency_code: "EUR";
    };
  };
  customer_locale: null;
  device_id: null;
  discount_codes: [];
  email: string;
  estimated_taxes: false;
  financial_status: FinancialStatus;
  fulfillment_status: null;
  landing_site: null;
  landing_site_ref: null;
  location_id: null;
  merchant_of_record_app_id: null;
  name: string;
  note: null;
  note_attributes: [];
  number: 20;
  order_number: 1020;
  order_status_url: string;
  original_total_additional_fees_set: null;
  original_total_duties_set: null;
  payment_gateway_names: [];
  phone: null;
  presentment_currency: string;
  processed_at: string;
  reference: null;
  referring_site: null;
  source_identifier: null;
  source_name: string;
  source_url: null;
  subtotal_price: string;
  subtotal_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  tags: "egnition-sample-data";
  tax_lines: [];
  taxes_included: false;
  test: false;
  token: string;
  total_discounts: string;
  total_discounts_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_line_items_price: string;
  total_line_items_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_outstanding: string;
  total_price: string;
  total_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_shipping_price_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_tax: string;
  total_tax_set: {
    shop_money: {
      amount: string;
      currency_code: string;
    };
    presentment_money: {
      amount: string;
      currency_code: string;
    };
  };
  total_tip_received: string;
  total_weight: 0;
  updated_at: string;
  user_id: null;
  billing_address: BillingAddress;
  customer: Customer;
  discount_applications: [];
  fulfillments: [];
  line_items: LineItem[];
  payment_terms: null;
  refunds: [];
  shipping_address: {
    first_name: string;
    address1: string;
    phone: string;
    city: string;
    zip: string;
    province: null;
    country: string;
    last_name: string;
    address2: null;
    company: null;
    latitude: null;
    longitude: null;
    name: string;
    country_code: string;
    province_code: null;
  };
  shipping_lines: [];
}
