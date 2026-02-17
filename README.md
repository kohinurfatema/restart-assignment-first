# SwiftCart - E-Commerce Application

A modern and responsive e-commerce website built with vanilla HTML, CSS (Tailwind + DaisyUI), and JavaScript.

## Live Demo
- **Live Link:** [https://restart-assignment-first.vercel.app/](https://restart-assignment-first.vercel.app/)
- **GitHub Repository:** [https://github.com/kohinurfatema/restart-assignment-first](https://github.com/kohinurfatema/restart-assignment-first)

## Features

### UI/UX
- Responsive Navbar with cart count
- Hero Section with background image and CTA
- Why Choose Us Section (4 features)
- Trending Now Section (Top 3 rated products from API)
- Dedicated Products Page with category filtering
- Newsletter Subscription in Footer
- Footer with Quick Links, Support, and Social Media

### Dynamic Functionality
- Products loaded from FakeStore API
- Category filter buttons (All, Electronics, Jewelery, Men's Clothing, Women's Clothing)
- Product cards with image, title, price, rating, and category badge
- Product detail modal with full description
- Add to Cart with quantity management
- Cart sidebar with total price calculation
- Remove from cart and update quantity
- LocalStorage persistence for cart
- Loading spinner during API fetch
- Toast notifications

## Technology Stack
- HTML5
- CSS3 / Tailwind CSS / DaisyUI
- Vanilla JavaScript (No frameworks)
- FakeStore API

## API Endpoints
```
GET https://fakestoreapi.com/products
GET https://fakestoreapi.com/products/categories
GET https://fakestoreapi.com/products/category/{category}
```

## Getting Started

1. Clone the repository:
```bash
git clone [YOUR_REPO_URL_HERE]
cd restart-assignment-first
```

2. Open `index.html` in your browser or use a local server.

---

## JavaScript Questions & Answers

### ১) null এবং undefined এর মধ্যে পার্থক্য কী?

`undefined` মানে হলো একটি ভেরিয়েবল ডিক্লেয়ার করা হয়েছে কিন্তু তাতে কোনো মান assign করা হয়নি। JavaScript স্বয়ংক্রিয়ভাবে একটি ভেরিয়েবলকে `undefined` সেট করে যদি তাতে কোনো value না দেওয়া হয়।

`null` হলো একটি ইচ্ছাকৃত খালি মান। Developer সচেতনভাবে assign করে যখন বোঝাতে চায় যে variable টিতে কোনো object বা value নেই।

```javascript
let a;
console.log(a); // undefined (কোনো মান দেওয়া হয়নি)

let b = null;
console.log(b); // null (ইচ্ছাকৃতভাবে খালি রাখা হয়েছে)

console.log(typeof undefined); // "undefined"
console.log(typeof null);      // "object"
```

---

### ২) JavaScript এ map() function এর ব্যবহার কী? এটি forEach() থেকে কীভাবে আলাদা?

`map()` একটি array এর প্রতিটি element এর উপর function চালায় এবং একটি **নতুন array** return করে। Original array পরিবর্তন হয় না।

`forEach()` ও array এর প্রতিটি element এর উপর function চালায় কিন্তু এটি **কিছুই return করে না** (undefined return করে)।

**পার্থক্য:**
- `map()` নতুন array return করে, `forEach()` কিছু return করে না
- `map()` এর result variable এ store করা যায়
- `forEach()` শুধু side effects এর জন্য ব্যবহার হয় (যেমন: console.log, DOM update)

```javascript
const numbers = [1, 2, 3, 4];

// map() - নতুন array return করে
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]

// forEach() - কিছু return করে না
const result = numbers.forEach(num => num * 2);
console.log(result); // undefined
```

---

### ৩) == এবং === এর মধ্যে পার্থক্য কী?

`==` (Loose Equality) দুটি value compare করার আগে **type conversion** করে। শুধু value check করে, data type check করে না।

`===` (Strict Equality) কোনো type conversion করে না। Value এবং data type **উভয়ই** check করে।

```javascript
// == এর ক্ষেত্রে (type conversion হয়)
console.log(5 == "5");         // true
console.log(0 == false);       // true
console.log(null == undefined); // true

// === এর ক্ষেত্রে (type conversion হয় না)
console.log(5 === "5");         // false (number vs string)
console.log(0 === false);       // false (number vs boolean)
console.log(null === undefined); // false
```

সবসময় `===` ব্যবহার করা উচিত কারণ এটি আরো নিরাপদ এবং unexpected bugs এড়াতে সাহায্য করে।

---

### ৪) API data fetch করার সময় async/await এর গুরুত্ব কী?

`async/await` হলো JavaScript এ asynchronous code লেখার আধুনিক এবং সহজ উপায়। এটি Promise-based code কে synchronous code এর মতো দেখতে ও লিখতে সাহায্য করে।

**গুরুত্ব:**
1. **Code Readability:** Code synchronous এর মতো লেখা যায়, যা বুঝতে সহজ
2. **Error Handling:** `try-catch` block দিয়ে সহজে error handle করা যায়
3. **Callback Hell এড়ানো:** Nested callback ও Promise chaining এর জটিলতা দূর করে
4. **Sequential Execution:** একাধিক async operation সহজে sequential করা যায়

```javascript
// async/await ছাড়া (Promise chaining)
function getProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
}

// async/await সহ (আরো পরিষ্কার)
async function getProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
```

---

### ৫) JavaScript এ Scope এর ধারণা ব্যাখ্যা করুন (Global, Function, Block)।

Scope নির্ধারণ করে একটি variable কোন কোন জায়গায় accessible হবে। JavaScript এ তিন ধরনের scope আছে:

**১. Global Scope:**
Function বা block এর বাইরে declare করা variable। পুরো program এ যেকোনো জায়গায় access করা যায়।

```javascript
let globalVar = "আমি global";

function test() {
    console.log(globalVar); // কাজ করবে
}
console.log(globalVar); // কাজ করবে
```

**২. Function Scope:**
Function এর ভিতরে declare করা variable। শুধু সেই function এর ভিতরেই access করা যায়।

```javascript
function myFunction() {
    let functionVar = "আমি function এর ভিতরে";
    console.log(functionVar); // কাজ করবে
}
console.log(functionVar); // Error: functionVar is not defined
```

**৩. Block Scope:**
`{}` curly braces এর ভিতরে `let` বা `const` দিয়ে declare করা variable। শুধু সেই block এর ভিতরেই access করা যায়।

```javascript
if (true) {
    let blockVar = "আমি block এর ভিতরে";
    console.log(blockVar); // কাজ করবে
}
console.log(blockVar); // Error: blockVar is not defined
```

**গুরুত্বপূর্ণ:** `var` keyword block scope follow করে না, শুধু function scope follow করে। `let` এবং `const` block scope follow করে। বর্তমানে `let` এবং `const` ব্যবহার করা best practice।

```javascript
if (true) {
    var x = 10;
    let y = 20;
}
console.log(x); // 10 (var block scope follow করে না)
console.log(y); // Error (let block scoped)
```
