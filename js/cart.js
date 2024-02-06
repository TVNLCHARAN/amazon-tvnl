export let cart = localStorage.getItem('cart');
export let total = Number(JSON.parse(localStorage.getItem('total')));
if (!cart) {
    cart = {};
}else{
    cart = JSON.parse(cart);
}


// localStorage.removeItem('cart');
// localStorage.removeItem('total');