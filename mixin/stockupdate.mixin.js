module.exports = {
    methods: {
        async onCreatedStock(ctx, params) {
            ctx.emit("posstock.updated", {
                id: params.item,
                qty: params.qty,
                shop: params.shop,
                item: params.item,
                uid: ctx.params.uid,
                owner: ctx.params.owner,
                name: params.name
            });

        },
        async beforeUpdatingStock(ctx) {
            let _current = await this.broker.call("v1.posstock.find", {
                query: { _id: ctx.params._id }
            });
            const _item = _current[0];
            //console.log("current item ====",_item);
            let _changeQty = 0;
            if (_item) {
                let _qty = ctx.params.qty ? ctx.params.qty : 0;
                if (ctx.params.deleteFlag) {
                    _changeQty = _item.qty;
                }
                else {

                    _changeQty = (_item.qty - _qty);
                }
            }
            _changeQty = _changeQty * -1;
            //console.log("_changeQty",_changeQty);
            let _params = ctx.params;
            _params.id = ctx.params._id;
            this.broker.emit("posstock.updated", {
                id: _item.item,
                qty: _changeQty,
                shop: _item.shop,
                item: _item.item,
                uid: ctx.params.uid,
                owner: ctx.params.owner,
                name: _item.name
            });

        }





    }
};