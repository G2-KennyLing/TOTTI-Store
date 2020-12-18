module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = { item, Qty: 0, unit_price: 0 };
        }
        storedItem.Qty++;
        storedItem.unit_price = storedItem.item.unit_price * storedItem.Qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.unit_price
    }
    this.reduceByOne = function (id) {
        this.items[id].Qty--;
        this.items[id].unit_price -= this.items[id].item.unit_price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.unit_price;
        if (this.items[id].Qty <= 0) {
            delete this.items[id];
        }
    }
    this.removeAll = function (id) {
        this.totalQty -= this.items[id].Qty;
        this.totalPrice -= this.items[id].unit_price
        delete this.items[id];
    }
    this.generateArray = function () {
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
    this.paypalArray = function () {
        let arr = [];

    }
};