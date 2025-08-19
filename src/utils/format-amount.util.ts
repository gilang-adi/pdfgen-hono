export const formatAmount = (amount: number): string => {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

export const formatAmountWithCurrency = (amount: number, currency: string): string => {
  return `${currency} ${formatAmount(amount)}`;
}