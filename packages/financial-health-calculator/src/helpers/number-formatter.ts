export const formatCurrency = (number: number, currency: string, userLocale: string) => {
  return new Intl.NumberFormat(userLocale, { style: 'currency', currency }).format(number);
};

export const formatNumber = (number: number, userLocale: string) => {
  return new Intl.NumberFormat(userLocale).format(number);
};
