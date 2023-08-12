
# ExpressShop

I made fullstack Express.js app with Vanilla JavaScript frontend and with MongoDB and Mongoose nosql database.  
This is online shop where you can log in, see products that are uploaded by other users for sale, upload your own products for sale, edit and delete only your own products, add items to your cart, purchase orders, download Invoices for your orders, reset your password, logout and more!  

In this app:  
- I'm using session with the express-session package for storing the loged in user
- I've implemented XSS Attacks protection with the csurf package where you must send token with every POST/PUT/PATCH/DELETE request
- EJS view engine for views templates
- Multer package for uploading images
- PDFKit package for creating PDF documents on the fly where I'm using the core package filesystem for creating writable streams and storing the invoice in the pdf where user can preview the document and download it
- Sending E-mails with nodemailer (other services requested payment) when Signing up and when you request to reset your password
- Using Express-validator package to validate the body data when trying to post and patch data
- I've integrated Stripe payment when purchasing the order ( dummy stripe credit card: all 424242..)
- Beautiful pagination for the products page and shop page.
  


## Home Page:  
![homepage](https://github.com/aleksandromilenkov/expressShop/assets/64156983/25a50b62-993c-41be-8066-27aa12b5e6a2)


## Cart page:  
![cart](https://github.com/aleksandromilenkov/expressShop/assets/64156983/d3953c94-64cd-48ce-835d-5a77d3aed946)


## Checkout page:  

![checkout](https://github.com/aleksandromilenkov/expressShop/assets/64156983/16f6001c-a8b0-4d3b-8551-2172eb18d7e7)

## Stripe integration page:
![stripe](https://github.com/aleksandromilenkov/expressShop/assets/64156983/5baf69c1-de9c-4fd7-a8f5-7784d578838f)

## Orders page:  
![orders](https://github.com/aleksandromilenkov/expressShop/assets/64156983/ad616cf7-228c-46e3-9209-27eef46d92bb)

## Add product page :
![addProduct](https://github.com/aleksandromilenkov/expressShop/assets/64156983/274bf4fe-390c-4508-a4e0-d59d497a7433)
## Your products (Admin products) page :
![adminProducts](https://github.com/aleksandromilenkov/expressShop/assets/64156983/f6fc0638-5ec4-43c4-adcd-0833b15cf383)
## Home page when not loged in :
![homePageLogoff](https://github.com/aleksandromilenkov/expressShop/assets/64156983/3efea86c-1d28-4834-90f1-71925f6e712d)
## Login page :
![login](https://github.com/aleksandromilenkov/expressShop/assets/64156983/5969e28c-8916-4d37-8d2f-8d5dc8838cb3))
## Tour Details page :
![natoursDetails3](https://github.com/aleksandromilenkov/NatoursAPI/assets/64156983/ec431ede-7c9c-41df-9dd5-b3a06c1ebd5b)
## Signup page :
![signup](https://github.com/aleksandromilenkov/expressShop/assets/64156983/50100c7e-2c20-4202-a619-72991bf999fc)
## Reset password page :
![resetpw](https://github.com/aleksandromilenkov/expressShop/assets/64156983/67b0cfec-a4a5-423d-a677-66958206c720)
## Reset password page when clicking the link in the -email :
![resetpw2](https://github.com/aleksandromilenkov/expressShop/assets/64156983/377e3a8f-644b-49c7-b3b8-da6a1fb6ed27)


## Installation
This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

## Prerequisites
Node package manager - npm.  

## Installation
1. Clone the repo
```
git clone https://github.com/aleksandromilenkov/expressShop.git
```
2. In the top level terminal of the folder just do npm install
```npm
npm install 
```
2. Type this command in the terminal 
```npm
npm run start 
```

Now go to localhost:3000 and you will see the app.
## Usage
Use this app for whatever you like.

## Built with
- Express.js
- EJS
- FetchAPI
- Node.js
- express-session 
- MongoDB  
- Mongoose  
- Csurf
- Multer  
- Bcrypt
- Stripe
- Pdfkit
- Nodemailer
- And more...  

