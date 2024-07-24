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
{status: true, message: 'user found', data:{role: "String", 'access_token': "String", "refresh_token": "String"} }//user exist
{status: false, message: 'user not found', data: {}} //user not registered
```

400 $~~~~~~~~~$ Invalid email or password  
<br><br>

## `POST` /generate-otp

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
    "user_id": "string",
    "otp": "String",
    "new_password":"String"
}
```

### `Response`

### code $~~~~~~~~~$ Description

default $~~~~~~~~~$ successful operation

```js
{status:true, message:'New Password updated',data: {}} //if valid OTP
{ status:false, message: 'User details or OTP is incorrect', data: {}} //if OTP invalid or incorrect
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
 "full_name":"String",
 "email":"String",
 "password":"String"
}
```

### `Response`:

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{status: true, message: 'User registered',data:{'user_id':'String'}}
```

500 $~~~~~~~~~$ Internal Server Error
<br><br>

## `GET` /get-product-parameters

fetch product parameters like Categories, colors, and Sizes

### `Parameters`:

Body:

```js
{
 
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Product Parameters fetched.', data:{
    "categories": [ {
        "category_id": "String",
        "Category_name": "String"
    }, ...],
    "colors": [
        {
            "color_id": "String",
            "color_name": "String",
            "color_code": "HexValues"
        },
        ...
    ],
    "sizes": [
        {
            "size_id": "String",
            "size_type": "String" //S,M, L , XL....
        },
        ...
    ]
    }
}//successful operation
{status: false, message: 'Error while fetching', data:{reason: ""}} //failure
```

<br><br>


## `GET` /home

fetch banner and recent arrived products

### `Parameters`:

Body:

```js
{
 
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Home page data fetched.', data:{
    "products": [
        {
            "product_id" : "String",
            "product_name": "String",
            "description": "String",
            "images": "String[]",
            "size_ids":"String[]",
            "color_ids": "String[]",
            "price": "Float",
            "category_id": "String",
            "rating": "Float",
            "quantity": "Number"
        },
        ...
    ]
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

category_id: String

color_id: string
```

Body:

```js
{
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Products list fetched.', data:{
    products:[
        {
            "product_id" : "String",
            "product_name": "String",
            "description": "String",
            "images": "String[]",
            "size_ids":"String[]",
            "color_ids": "String[]",
            "price": "Float",
            "category_id": "String",
            "rating": "Float",
            "quantity": "Number"
        },
        {

        },

        ...
    ],
    total_pages: "Number",
    current_page: "Number",
    total_products: "Number"
    
}}//successful operation
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
            "description": "String",
            "images": "String[]",
            "size_ids":"String[]",
            "color_ids": "String[]",
            "price": "Float",
            "category_id": "String",
            "rating": "Float",
            "quantity": "Number",
            colors : [
                {
                    "color_id": "String",
                    "color_name": "String",
                    "color_code": "String"
                },
                ...
            ],
            sizes: [
                {
                    "size_id": "String",
                    "size_type": "String"
                },
                ...
            ],
            category: {
                "category_id": "String",
                "category_name": "String"
            }
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
    user_id: "String",
    product_details: [ { product_id: "String",
                         size: "String",
                         quantity: "Number"
                       }
                       ...
                      ],
    products:[
        {
            "product_id" : "String",
            "product_name": "String",
            "images": "String[]",
            "price": "Float",
            "category": "String",
            size: "String",
            quantity: "Number",
            "colour": "String"
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
 "size_id": "String",
 "color_id": "String"
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

calculate amount based on products, and shipping type

### `Parameters`:

Body:

```js
{
    "shipping_type": "String",
    "product_ids": String[]
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'Amount calculated.', data:{
    "sub_amount": "Float",
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


## `POST` /user/create-order

create order 

### `Parameters`:

Body:

```js
{
 "amount":"Float",
 "shipping_type": "String",
 "address": "json",
 "product_details":"Objects[]",  // [{product_id: ,size: , quantity: , colour:}]
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true, message: 'order created', data: paymentIntent  //object
}//successful operation
{ status: false, message: 'Order creation failed', data:{reason: ""}} //failure
```

<br><br>

## `POST` /user/webhook

verify payment signature and send response to user

### `Parameters`:
customerController.createReview
Headers:

```js
{'stripe-signature': "String" }
```

Body:

```js
{
 "event":"Object"
}
```

### `Response`

### code $~~~~~~~~~$ Description

200 $~~~~~~~~~$ successful operation

```js
{ status: true}//successful operation
{ status: false} //failure
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

## `GET` /product/reviews/:product_id

fetch reviews of a product

### `Parameters`:
product_id: String

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
    },
average_rating: "Float"
}}//successful operation
{status: false, message: 'Error while fetching', data: {reason: ""}} //failure
```

400 $~~~~~~~~~$ user not found

<br><br>


# Admin APIs


## `POST` /admin/add-product

add product to database

### `Parameters`:

Body:

```js
{
 "product_name":"String",
 "images":String[](Base 64 value),
 "quantity":"number",
 "size_ids": String[],
 "price": "Number",
 "color_ids": String[],
 "category_id": "String",
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
 "images":String[](Base 64 value),
 "quantity":"number",
 "size_ids": String[],
 "price": "Number",
 "color_ids": String[],
 "category_id": "String",
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

## `GET` /admin/view-order/:order_id

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
            "created_at": "timestamp",
            "delivery_date": "timestamp",
            "payment_status" : "String",
            "delivery_status": "String"
}}//successful operation
{ status: false, message: 'Error while fetching order details...', data:{reason: ""}} //failure
```
400 $~~~~~~~~~$ order not found
<br><br>
