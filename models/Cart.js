module.exports = function Cart(prevItems) {
  this.items = prevItems.items;
  this.total_kol = prevItems.total_kol; //total count of items
  this.total_price = prevItems.total_price; //total price

  this.add = function(item, id) {
    var cur = this.items[id];
    if (!cur) {
      cur = this.items[id] = { item: item, kol: 0, price: 0 }
    }
    cur.kol++;
    cur.price = cur.price * cur.kol;
    this.total_kol++;
    this.total_price += cur.item.price

    this.generateArray = function() { //transform items into array
      var arr = [];
      for (var id in this.items) {
        arr.push(this.items[id]);
      }
      return arr;
    }
  }
}