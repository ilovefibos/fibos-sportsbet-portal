const PriceFormatter = {
  formatPrice(price, unit = 'FO') {
    return `${(price / 10000).toDecimal(4)} ${unit}`;
  },
  formatQuantity(quantity, symbol = 'FO', contract = 'eosio') {
    return `${Number(quantity)
      .toFixed(4)
      .toString()} ${symbol}@${contract}`;
  },
  install(Vue) {
    Vue.filter('price', (value, unit) => PriceFormatter.formatPrice(value, unit));
  },
};

export default PriceFormatter;
