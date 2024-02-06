import {products} from './products.js';
import {cart} from './cart.js'

let str = '';

products.forEach(
    (product)=>{
        str+=`
        <div class="product-container">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </div>
            <div class="product-name limit-text-to-2-lines">
                ${product.name}
            </div>

            <div class="product-rating-container">
                <img class="product-rating-stars"
                  src="images/ratings/rating-${product.rating.stars*10}.png">
                <div class="product-rating-count link-primary">
                  ${product.rating.count}
                </div>
            </div>
    
            <div class="product-price">
            $${(product.priceCents/100).toFixed(2)}
            </div>

            <div class="product-quantity-container">
            <select class='selector-${product.id}'>
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
            </div>

            <div class="product-spacer"></div>

            <div class="added-to-cart added-to-cart-${product.id}">
            <img src="images/icons/checkmark.png">
            Added
            </div>

            <button data-price=${product.priceCents} data-product-img=${product.image} data-product-name=${encodeURIComponent(product.name)} data-product-id=${product.id} class="add-to-cart-button button-primary js-add-to-cart">
            Add to Cart
            </button>
        </div>`
    }
)


let grid = document.querySelector('.products-grid')
grid.innerHTML = str;

let total = localStorage.getItem('total');

if (total !== null && total !== '') {
    total = Number(JSON.parse(total));
} else {
    total = 0;
}


if(total>=100){
    document.querySelector('.total').classList.add('too-many-items-in-cart');
}

document.querySelector('.total').innerHTML = total;
let timer;

document.querySelectorAll('.js-add-to-cart').forEach(
    (button)=>{
        button.addEventListener('click',()=>{
            let id;
            let quantity = Number(document.querySelector(`.selector-${button.dataset.productId}`).value);
            Object.keys(cart).forEach((key)=>{
                if(key === button.dataset.productId){
                    id = key;
                    cart[key].quantity+=quantity;
                    cart[key].img = button.dataset.productImg;
                    return
                }
            });
            total+=quantity;
            if(!id){
                cart[button.dataset.productId] = {'name':decodeURIComponent(button.getAttribute('data-product-name')),'quantity':quantity,'img':button.dataset.productImg,'price':button.dataset.price};
            
            }
            document.querySelector('.total').innerHTML = total;
            let classlist = document.querySelector(`.added-to-cart-${button.dataset.productId}`).classList;
            if(classlist.contains('added-successfully')){
                clearTimeout(timer);
            }
            classlist.add('added-successfully');
            timer = setTimeout(()=>{
                classlist.remove('added-successfully');
            },4000);
            localStorage.setItem('total',JSON.stringify(total));
            localStorage.setItem('cart',JSON.stringify(cart));
            if(total>=100){
                document.querySelector('.total').classList.add('too-many-items-in-cart');
            }
        
        })
    }
);

// let searchQuery = document.querySelector('.search-bar')
// searchQuery.addEventListener('input',(event)=>(
//     {
        
//     }
// ));