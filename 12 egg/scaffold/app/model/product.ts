interface IProduct {
  id: string;
  name: string;
}
class Product {
  products: IProduct[] = [];

  list () {
    return this.products;
  }

  add (product: IProduct) {
    this.products.push(product);
  }

  getProductById (id: string) {
    const target = this.products.find(product => product.id === id);
    return target || {};
  }
}
export default Product;
