export const formatCurrency = (number: number, currency: string) => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(number);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('en-GB').format(number);
};
