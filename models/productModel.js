const products = [];

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }
  save() {
    products.push(this);
  }

  // static keyword makes sure that fetchAll method can be called directly on Product class itself
  static fetchAll() {
    return products;
  }
};
