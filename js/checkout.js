import {cart} from './cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

let total = localStorage.getItem('total')
if(total){
    total = Number(JSON.parse(total));
}

let productSummary = '';
let totalPrice = 0.0;
let totalCost;
let tax;
let shippingCost = 0;
const today = dayjs();
const deliveryOptions = {'one':{
    'date': today.add(7, 'days').format('dddd, MMMM D'),
    'deliveryCost': 0
},'two':{
    'date': today.add(3, 'days').format('dddd, MMMM D'),
    'deliveryCost': 499
},'three':{
    'date': today.add(1, 'days').format('dddd, MMMM D'),
    'deliveryCost': 999
}};

export function updateProductDetails(){
    let productDetails = '';
    totalPrice = 0;
    Object.keys(cart).forEach((key)=>{
        productDetails += `
        <div class="products-details product-${key}">
            <div class="deldate-${key} date">
                Delivery Date: ${deliveryOptions['one'].date}
            </div>
            <div class="product-outer-div">
                <div><img class="product-img" src="${cart[key].img}" alt="product"></div>
                <div class="details">
                    <div class="product-name">${cart[key].name}</div>
                    <div style="color: maroon;font-weight: bold;margin-bottom: 10px;">$${(cart[key].price/100).toFixed(2)}</div>
                    <div class="product-quantity update-${key}">Quantity: ${cart[key].quantity}
                        <p class="change-links update-quantity" data-update-id=${key}>Update</p>
                        <p class="change-links delete-button" data-delete-id=${key}>Delete</p>
                    </div>
                    </div>
                <div class="date-div">
                    <div class="product-name" style="margin-bottom: 10px;">Choose a delivery date</div>
                    <div class="delivery-grid">
                        <div style="display: grid;grid-template-columns: 20px 1fr;column-gap: 10px;">
                        <div class="radio-div">
                        <input type="radio" name="${key}-date" value="one" checked>
                            </div>
                            <div class="delivery-date">
                            <label for="choose-date"><span style="color: green;font-size: 15px;font-weight: bold;">${deliveryOptions['one'].date}</span><br><span style="color: gray;font-size: 13px;">Free Shipping</span></label>
                                <label for="choose-date"></label>
                                </div>
                        </div>

                        <div style="display: grid;grid-template-columns: 20px 1fr;column-gap: 10px;">
                            <div class="radio-div">
                                <input type="radio" name="${key}-date" value="two">
                            </div>
                            <div class="delivery-date">
                                <label for="choose-date"><span style="color: green;font-size: 15px;font-weight: bold;">${deliveryOptions['two'].date}</span><br><span style="color: gray;font-size: 13px;">Delivery charge: $${deliveryOptions['two'].deliveryCost/100}</span></label>
                                <label for="choose-date"></label>
                            </div>
                        </div>

                        <div style="display: grid;grid-template-columns: 20px 1fr;column-gap: 10px;">
                            <div class="radio-div">
                                <input type="radio" name="${key}-date" value="three">
                            </div>
                            <div class="delivery-date">
                            <label for="choose-date"><span style="color: green;font-size: 15px;font-weight: bold;">${deliveryOptions['three'].date} </span><br><span style="color: gray;font-size: 13px;">Delivery Charge: $${deliveryOptions['three'].deliveryCost/100}</span></label>
                                <label for="choose-date"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    });
    
    let prod = document.querySelector('.products-list');    
    if(prod){
        prod.innerHTML = productDetails;
        changeBill();
        changeCartIcon();
        updateQuantity();
    }
}
updateProductDetails();

function updateQuantity(){
    document.querySelectorAll('.update-quantity').forEach((updateButton)=>{
        updateButton.addEventListener('click',()=>{
            let id = updateButton.dataset.updateId;
            document.querySelector(`.update-${id}`).innerHTML = `
                <label for="quantity" class="product-quantity">Quantity: </label>
                <input type="number" class="input-${id}" min=1 value=1 id="quantity-input">
                <button class="save-button update-buttons">Save</button>
                <button class="cancel-button update-buttons">Cancel</button>
            `;
            document.querySelector(".cancel-button").addEventListener('click',()=>{
                document.querySelector(`.update-${id}`).innerHTML = `
                Quantity: ${cart[id].quantity}
                <p class="change-links update-quantity" data-update-id=${id}>Update</p>
                <p class="change-links delete-button" data-delete-id=${id}>Delete</p>
                `;
                calculateShippingCost();
                changeCartIcon();
                changeBill();
                updateQuantity();
            });
            document.querySelector(".save-button").addEventListener('click',()=>{
                let quantity = document.querySelector(`.input-${id}`).value;
                if(quantity<=0){
                    quantity = 1;
                }
                console.log(total);
                total=total+Number(quantity)-cart[id].quantity;
                cart[id].quantity = quantity;
                console.log(total);
                localStorage.setItem('total',total);
                localStorage.setItem('cart',JSON.stringify(cart));
                document.querySelector(`.update-${id}`).innerHTML = `
                Quantity: ${quantity}
                <p class="change-links update-quantity" data-update-id=${id}>Update</p>
                <p class="change-links delete-button" data-delete-id=${id}>Delete</p>
                `;
                changeCartIcon();
                calculateShippingCost();
                changeBill();
                updateQuantity();
            });
        });
    });
}

function changeBill(){
    total = Number(JSON.parse(localStorage.getItem('total')) || 0);
    totalPrice = 0;
    Object.keys(cart).forEach((key)=>{        
        totalPrice += Number(cart[key].price)*Number(cart[key].quantity);
    });
    totalPrice = Number((totalPrice/100).toFixed(2));
    shippingCost = Number((shippingCost/100).toFixed(2));
    totalCost = (totalPrice+shippingCost).toFixed(2);
    tax = ((totalPrice)*0.1).toFixed(2);
    productSummary = `
    <div><h4>Order Summary</h4></div>
        <div class="summary-div">
            <div class="inline-text">Items(${total}): </div>
            <div class="price-div">$${totalPrice}</div>
        </div>
        <div class="summary-div">
            <div class="inline-text">Shipping & handling: </div>
            <div class="price-div"><pre style="margin: 0px;font-family: Roboto;">      $${shippingCost}</pre><hr></div>
        </div>
        <div class="summary-div">
            <div class="inline-text">Total before Tax: </div>
            <div class="price-div">$${totalCost}</div>
        </div>
        <div class="summary-div">
        <div class="inline-text">Estimated tax (10%):</div>
        <div class="price-div">$${tax}</div>
        </div>
        <hr>
        <div class="summary-div" style="color: maroon;font-weight: bold;">
            <div class="inline-text">Order Total: </div>
            <div class="price-div">$${(Number(totalCost)+Number(tax)).toFixed(2)}</div>
        </div>
        <div class="summary-div">
            <div class="inline-text" style="font-weight: bold; margin-right: 20px;">Use PayPal
                <input type="checkbox" name="PayPal" id="paypal">
            </div>
        </div>
        <div>
        <button class="button-primary">Place Your Order</button>
    </div>`;
    let prod = document.querySelector('.order-summary');
    if(prod)
        prod.innerHTML = productSummary;
    document.querySelectorAll('.delete-button').forEach((button)=>{
        button.addEventListener('click',()=>{
            if(document.querySelector(`.product-${button.dataset.deleteId}`).style.display !== 'none'){
                total-=cart[button.dataset.deleteId].quantity;
                delete cart[button.dataset.deleteId];
                localStorage.setItem('cart',JSON.stringify(cart));
                localStorage.setItem('total',JSON.stringify(total));
                document.querySelector(`.product-${button.dataset.deleteId}`).style.display = 'none';
                calculateShippingCost();
                totalPrice = 0.0;
                changeBill();
                changeCartIcon();
            }
        })
    });
}


function changeCartIcon(){
    total = Number(JSON.parse(localStorage.getItem('total')));
    document.querySelector('.second-section').innerHTML =  ``;
    document.querySelector('.second-section').innerHTML =  `CheckOut (<span class="check-items">${total} items</span>)`;
}

function changeDate(){
    let deliveryDate;
    Object.keys(cart).forEach((key)=>{
        deliveryDate = deliveryOptions['one'].date;
        document.getElementsByName(`${key}-date`).forEach((button)=>{            
            if(button.checked){
                deliveryDate = deliveryOptions[button.value].date;
            }
        });
        document.querySelector(`.deldate-${key}`).innerHTML = `Delivery Date: ${deliveryDate}`;
    })
}


Object.keys(cart).forEach((key)=>{
    document.getElementsByName(`${key}-date`).forEach((radio)=>{
        radio.addEventListener('click',()=>{
            changeDate();
            calculateShippingCost();
            totalPrice = 0.0;
            changeBill();
        });
    })
})

function calculateShippingCost(){
    shippingCost = 0;
    Object.keys(cart).forEach((key)=>{
        document.getElementsByName(`${key}-date`).forEach((radio)=>{
            if(radio.checked){
                shippingCost += deliveryOptions[radio.value].deliveryCost;
            }
        })
    });
    console.log(shippingCost);
}