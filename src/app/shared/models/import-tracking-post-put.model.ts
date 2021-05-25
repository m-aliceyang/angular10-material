export interface ImportTrackingPostPutModel {
  systemRef?: string;
  poNo?: string;
  department?: string;
  exCountry?: string;
  shipperName?: string;
  consigneeId?: string;
  invoiceNo?: string;
  receivedDate?: Date;
  numberPackage?: number;
  grossWeight?: number;
  chargeWeight?: number;
  hawb?: string;
  mawb?: string;
  flightNumber?: string;
  statusId?: string;
  etd?: Date;
  eta?: Date;
  deliveredDate?: Date;
  publicRemarks?: string;
  privateRemarks?: string;
  invoiceCurrency?: string;
  invoiceAmount?: number;
  tranTypeId?: string;
  destOrigId?: string;
  collectionDate?: Date;
  declarationDate?: Date;
  buNumber?: string;
  invoiceAmountHkd?: number;
  debitNumber?: string;
  shippingChargeHkd?: number;
  hawbIssueDate?: Date;
  companyId: string;
  amounts?: ImportTrackingPostPutAmountModel[];
}

export interface ImportTrackingPostPutAmountModel {
  id?: number;
  currency?: string;
  debitNoteNumber?: string;
  amount?: number;
  isDirty: boolean;
  isRemove: boolean;
}
