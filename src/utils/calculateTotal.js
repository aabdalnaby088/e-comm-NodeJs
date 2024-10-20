
export const calcTotal = (items, discount) => {
    let total 
    if (cur.priceAfterDiscount){
        total = items.reduce((sum, cur) => sum += (cur.priceAfterDiscount * cur.quantity), 0)
    }else{
        total = items.reduce((sum, cur) => sum += (cur.price * cur.quantity), 0)
    }
    let totalAfterDiscount = total; 
    if(discount){
        totalAfterDiscount = total - (total * discount/100)
    }
    return {total, totalAfterDiscount};
}