export interface RootResponse {
  data: InvoiceData;
  response_code: string;
  response_desc: string;
  request_time: string;
  response_time: string;
  ref_id: string;
}

export interface InvoiceData {
  is_headerless: boolean;
  company_details: CompanyDetails;
  admission_details: AdmissionDetails;
  invoiced_items: InvoicedItemGroup[];
  invoice_details: InvoiceDetails;
  settlement_details: SettlementDetail[];
}

export interface CompanyDetails {
  company_name: string;
  company_address: string;
  company_contact_no: string;
  company_npwp: string;
  entity_name: string;
  company_bank_account_no: string;
  company_bank_name: string;
  account_holder: string;
  is_pkp: boolean;
}

export interface AdmissionDetails {
  admission_no: string;
  patient_name: string;
  mr_no: number;
  address: string;
  patient_type: string;
  primary_doctor: string;
  payer_name: string;
  bed: string;
  ward: string;
  class: string;
  invoice_no: string;
  invoice_date: string;
  admission_date: string;
  discharge_date: string;
  email: string;
}

export interface InvoicedItemGroup {
  sales_item_type_id: number;
  sales_item_type_name: string;
  total_item_amount: number;
  total_discount_amount: number;
  total_payer_amount: number;
  total_patient_amount: number;
  items: InvoicedItem[];
}

export interface InvoicedItem {
  sales_item_id: number;
  sales_item_name: string;
  doctor_user_id: number;
  doctor_user_name: string;
  store_id: number;
  store_name: string;
  order_date: string;
  start_date?: string;
  end_date?: string;
  quantity: number;
  uom_id: number;
  uom_name: string;
  sales_price: number;
  item_amount: number;
  discount_amount: number;
  payer_amount: number;
  patient_amount: number;
}

export interface InvoiceDetails {
  total_item_amount: number;
  total_discount_amount: number;
  total_payer_amount: number;
  total_patient_amount: number;
  payer_admin_fee: number;
  patient_admin_fee: number;
  payer_round_amount: number;
  patient_round_amount: number;
  payer_balance_amount: number;
  patient_balance_amount: number;
  payer_net_amount: number;
  patient_net_amount: number;
  tax_base_amount: number;
  paid_amount: number;
  vat: number;
  vat_exempted: number;
  in_words_patient: string;
  in_words_payer: string;
  notes: string;
  cashier_name: string;
  e_invoice_url: string;
}

export interface SettlementDetail {
  settlement_no: string;
  settlement_date: string;
  settlement_type: string;
  payment_mode: string;
  payer_name: string;
  account_no: string;
  description: string;
  cashier_name: string;
  settlement_amount: number;
  in_word_settlement_amount: string;
}
