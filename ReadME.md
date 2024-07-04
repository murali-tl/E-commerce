# Ecommerce API Contract

## `POST` /login

check if user exist
will check whether user or admin and gets logged in
provide access and refresh tokens

### `Parameters`:

Body:

```js
{
    'email': 'String',
    'password': 'String'
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{status: true, message: 'user found', data:{role: "String", email: "String", 'access_token': "String", "refresh_token": "String"} }//user exist
{status: false, message: 'user not found', data: {}} //user not registered
```

400 $~~~~~~~~~$ Invalid email or password  
<br><br>

## `GET` /generate-otp

generates OTP and triggers email notification to user through Services

### `Parameters`:

email: string

```js
{
    "email": "String";
}
```

### `Response`

### code $~~~~~~~~~$ Description

default $~~~~~~~~~$ successful operation

```js
{status: true, message: 'OTP sent', data: {}}
```

<br><br>

## `PATCH` /reset-password

verify OTP sent and update password

### `Parameters`:

```js
{
    "email": "string",
    "otp": "String",
    "new_password":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

default $~~~~~~~~~$ successful operation

```js
{status:true, message:'Password updated',data: {}} //if valid OTP
{ status:false, message: 'Password reset failed', data: { reason: 'OTP do not match'}} //if OTP invalid or incorrect
```

<br><br>

## ```POST```   /refresh-auth
re-generates Access token
###  ```Parameters```: 
userName: string
```js
{
    "refresh-token": "String"; 
}
```

### ```Response```

### code $~~~~~~~~~$  Description
default $~~~~~~~~~$ successful operation
```js
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTXVyYWxpIiwiaWF0IjoxNzE4MzQ0ODUwfQ.nWvHIFI3X_ii6J38pdUdkuKTiSeiy5Ly9SAF6VymbI8"
}
```

<br><br>

## `POST` /user/create-user

create a new user and create a cart as well as wishlist

### `parameters`:

Body:

```js
{
 "first_name":"String",
 "last_name":"String",
 "email":"String",
 "mobile_number":"String",
 "password":"String"
}
```

### `Response`:

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{status: true, message: 'User created',data:{'user_id':'String'}}
```

500 $~~~~~~~~~$ Internal Server Error
<br><br>

## `GET` /home

fetch banner and recent arrived products

### `Parameters`:

Body:

```js
{
 limit : "Number"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Home page data fetched.', data:{
    'banner_images': 'String[]',
    "product_images": "String[]"
    }
}//successful operation
{status: false, message: 'Error while fetching', data:{reason: ""}} //failure
```

<br><br>


## `GET` /list-products

fetch list of products by Category or all products

### `Parameters`:
Query Params:

```
page: Number,

limit: Number,

search : String, //name of product

sort_by: String //price, rating, recent
```

Body:

```js
{
    'category_name': "String[]", //[] list of categories
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Products list fetched.', data:{'category':'category_name',
    products:[
        {
            "product_id" : "String",
            "product_name": "String",
            "images": "String",
            "available_sizes":"String[]",
            "available_colours": "String[]",
            "price": "Float",
            "category": "String",
            "rating": "Float"
        },
        {

        },

        ...
    ],
    total_pages: "Number",
    current_page: "Number",
    total_products: "Number"
    
}//successful operation
{status: false, message: 'Error while fetching', data:{reason: ""}} //failure
```

<br><br>

## `GET` /product/:product-id

fetch details of a product

### `Parameters`:

product_id : String

Body:

```js
{
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Products details fetched.', data:{
            "product_id" : "String",
            "product_name": "String",
            "images": "String",
            "available_sizes":"String[]",
            "available_colours": "String[]",
            "price": "Float",
            "category": "String",
            "rating": "Float"
        }
}//successful operation
{status: false, message: 'Error while fetching', data:{reason: ""}} //failure
```

400 $~~~~~~~~~$ product not found

<br><br>

## `GET` /user/wish-list

fetch wish list of user

### `Parameters`:

Body:

```js
{
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{status: true, message: 'WishList details fetched.', data:{
    products:[
        {
            "product_id" : "String",
            "product_name": "String",
            "images": "String",
            "available_sizes":"String[]",
            "available_colours": "String[]",
            "price": "Float",
            "category": "String",
            "rating": "Float"
        },
        {

        },

        ...
    ]
}}//successful operation
{status: false, message: 'Error while fetching', data: {reason: ""}} //failure
```

400 $~~~~~~~~~$ user not found

<br><br>

## `POST` /user/add-to-wishList

add product to wishList

### `Parameters`:

Body:

```js
{
 "product_id":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Product added to wishlist.', data:{"product_id":"String",}}//successful operation
{status: false, message: 'Error while adding to wishList', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ user or product not found
<br><br>

## `DELETE` /user/remove-from-wishList

remove product from WishList

### `Parameters`:

Body:

```js
{
 "product_id":"String",
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation


```js
{ status: true, message: 'Product removed from wish List.', data:{}}//successful operation
{status: false, message: 'Error while removing from wish list', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ user or product not found

<br><br>


## `GET` /user/cart

fetch cart details of user

### `Parameters`:

Body:

```js
{
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Cart details fetched.', data:{
    products:[
        {
            "product_id" : "String",
            "product_name": "String",
            "images": "String[]",
            "available_sizes":"String[]",
            "available_colours": "String[]",
            "price": "Float",
            "category": "String",
            "rating": "Float"
        },
        {

        },

        ...
    ]
}}//successful operation
{status: false, message: 'Error while fetching', data: {reason: ""}} //failure
```

400 $~~~~~~~~~$ user not found

<br><br>

## `POST` /user/cart/add-to-cart

add product to cart
if already in cart update quantity
and update amount

### `Parameters`:

Body:

```js
{
 "product_id": "String",
 "quantity": "number",
 "size": "String",
 "colour": "String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Product added to Cart.', data:{"product_id": "String"}}//successful operation
{ status: false, message: 'Error while adding to cart', data:{reason: ""}} //failure
```

400 $~~~~~~~~~$ user or product not found
<br><br>

## `DELETE` /user/cart/remove-from-cart

remove product from cart
and update amount

### `Parameters`:

Body:

```js
{
 "product_id":"String",
 "size": "String",
 "colour": "String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Product removed from Cart.', data:{}}//successful operation
{ status: false, message: 'Error while removing from cart', data:{reason: ""}} //failure
```

400 $~~~~~~~~~$ user or product not found

<br><br>

## `GET` /user/calculate-order-amount

calculate amount based on products, coupon codes, and shipping type

### `Parameters`:

Body:

```js
{
    "coupon_code": "String",
    "shipping_type": "String",
    "product_ids": String[]
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Amount calculated.', data:{
    "total_amount": "Float"
    }
}//successful operation
{status: false, message: 'Error while calculating', data: {reason: ""}} //failure
```
<br><br>

## `GET` /user/addresses

fetch addresses of user

### `Parameters`:

Body:

```js
{
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Addresses fetched.', data:{
    addresses:[
        {
            "first_name" : "String",
            "second_name": "String",
            "address_line1": "String",
            "address_line2":"String",
            "country": "String",
            "city": "String",
            "zipcode": "String",
            "email": "String",
            "mobile": "String",
            "optional_text": "String"
        },
        {

        },

        ...
    ]
}}//successful operation
{status: false, message: 'Error while fetching', data: {reason: ""}} //failure
```

400 $~~~~~~~~~$ user not found

<br><br>

## `POST` /user/add-address

add another address or default address

### `Parameters`:

Body:

```js
{
 "first_name":"String",
 "last_name":"String",
 "address_line1":"String",
 "address_line2":"String",
 "city":"String",
 "country":"String",
 "zipcode":"String",
 "optional_text":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Address saved', data:{}}//successful operation
{ status: false, message: 'Error while saving address', data:{reason: ""}} //failure
```

400 $~~~~~~~~~$ User not found
<br><br>


## `POST` /user/make-payment

make payment and trigger create order if payment successful

### `Parameters`:

Body:

```js
{
 "card_holder_name":"String",
 "card_number":"String",
 "month":"String",
 "year":"String",
 "cvv":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'payment successful and order created', data:{
    "order_id": "String"
    }  
}//successful operation
{ status: false, message: 'Payment failed', data:{reason: ""}} //failure
```

<br><br>

## `GET` /user/view-orders

fetch all order details of a paricular user if order_id is not mentioned
otherwise fetch details of a particular order of user

### `Parameters`:

Body:

```js
{
    "order_id": "String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'All orders of user fetched.', data:{
    orders: [
        {
            "order_id"; "String",
            "user_id": "String",
            "products": [Objects],
            "cretaed_at": "timestamp",
            "delivery_date": "timestamp",
            "payment_status" : "String",
            "delivery_status": "String"
        }
    ]
}}//successful operation
{ status: false, message: 'Error while fetching orders...', data:{reason: ""}} //failure
```
<br><br>

## `GET` /product/reviews

fetch reviews of a product

### `Parameters`:

Body:

```js
{
    "product_id":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Addresses fetched.', data:{
    reviews:[
        {
            "user_id": "String",
            "title" : "String",
            "description": "String",
            "rating": "String",
            "useful_count":"String",
            "not_useful_count": "String",
            "created_at": "timestamp"
        },
        {

        },

        ...
    ],
    ratings_count: {
        "1stars": "Number",
        "2stars": "Number",
        "3stars": "Number",
        "4stars": "Number",
        "5stars": "Number",
    }
}}//successful operation
{status: false, message: 'Error while fetching', data: {reason: ""}} //failure
```

400 $~~~~~~~~~$ user not found

<br><br>

## `POST` /user/create-review

user gives review of a product
calculate avg rating of the product and update in  product table

### `Parameters`:

Body:

```js
{
"product_id": "String",
 "title" : "String",
 "description": "String",
 "rating": "String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'review details saved', data:{}}//successful operation
{ status: false, message: 'Error while saving review', data:{reason: ""}} //failure
```

400 $~~~~~~~~~$ user not found

<br><br>

## `PATCH` /user/mark-review
will be called when user clicks on "useful" button or "flg as inappropriate"

### `Parameters`:

Body:

```js
{
 "review_id":"String",
 "is_useful":"boolean",//yes or no
 "inappropriate_flag":"boolean"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'saved', data:{}
}//successful operation
{ status: false, message: 'Error while marking review', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ review not found

<br><br>

# Admin APIs


## `POST` /admin/add-product

add product to database

### `Parameters`:

Body:

```js
{
 "product_name":"String",
 "image_url":String[](Base 64 value),
 "quantity":"number",
 "available_sizes": String[],
 "price": "Number",
 "available_colours": String[],
 "category": "String",
 "description": "String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Product added Successfully.', data:{product_id: "String"}}//successful operation
{ status: false, message: 'Error while adding...', data:{reason: ""}} //failure
```
500 $~~~~~~~~~$ Internal Server Error
<br><br>

## `PUT` /admin/edit-product

update product in database

### `Parameters`:

Body:

```js
{
 "product_id":"String",
 "product_name":"String",
 "image_url":String[](Base 64 value),
 "quantity":"number",
 "available_sizes": String[],
 "price": "Number",
 "available_colours": String[],
 "category": "String",
 "description": "String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Product details updated Successfully.', data:{}}//successful operation
{status: false, message: 'Error while updating product details...', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ product not found
<br><br>

## `DELETE` /admin/delete-product

delete product from database

### `Parameters`:

Body:

```js
{
 "product_id":"String",
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Product removed Successfully.', data:{}}//successful operation
{status: false, message: 'Error while removing product...', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ product not found
<br><br>


## `GET` /admin/view-orders

fetch all order details from database

### `Parameters`:
Query Params:

```
page: Number,

limit: Number,

search : String, //user_id or order_id

```
Body:

```js
{
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'All orders details fetched.', data:{
    orders: [
        {
            "order_id"; "String",
            "user_id": "String"
        }
    ],
total_pages: "Number",
    current_page: "Number",
    total_orders: "Number"
}}//successful operation
{ status: false, message: 'Error while fetching orders...', data:{reason: ""}} //failure
```

<br><br>

## `GET` /admin/view-order

fetch deatils of a specific order

### `Parameters`:

```js
{
 "order_id":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Order details fetched.', data:{
            "order_id"; "String",
            "user_id": "String",
            "products": [Objects],
            "cretaed_at": "timestamp",
            "delivery_date": "timestamp",
            "payment_status" : "String",
            "delivery_status": "String"
}}//successful operation
{ status: false, message: 'Error while fetching order details...', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ order not found
<br><br>

## `GET` /admin/order-status

fetch status of a particular order

### `Parameters`:

```js
{
 "order_id":"String"
}
```
### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Order Status fetched.', data:{
    "products":[],
    "shipping_details":"string",
    "created_at":"Timestamp",
    "payment_status":"String",
    "estimated_delivery_date":"timestamp",
    "delivery_status":,"String"
    }
}//successful operation
{ status: false, message: 'Error while fetching order status...', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ order not found
<br><br>

## `PATCH` /admin/update-order

update order details like payment status, delivery time, delivery status

### `Parameters`:

Body:

```js
{
 "order_id":"Number",
 "estimated_delivery_date":"String",
 "delivery_status":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation
$~~~~~~~~~$

```js
{ status: true, message: 'Order details updated', data:{}}//successful operation
{ status: false, message: 'Error while updating order details...', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ order not found
<br><br>

# Other APIs

## -> login using webhooks
