-- Three Gals Restaurant - Menu Data
-- Target: SQL Server
-- Generated from: data/menu.json

CREATE TABLE menuItems (
    id                NVARCHAR(100)  NOT NULL IDENTITY PRIMARY KEY,
    name              NVARCHAR(200)  NOT NULL,
    price             DECIMAL(10, 2) NOT NULL,
    category          NVARCHAR(24)  NOT NULL,
    image             NVARCHAR(50)  NULL,
    short_description NVARCHAR(200)  NULL,
    description       NVARCHAR(500)  NULL,
    details           NVARCHAR(500)  NULL,
    tags              NVARCHAR(100)  NULL
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'classic-gal',
    N'Klassic Kenna Burger',
    9.50,
    N'burgers',
    N'Klassic Kenna Burger.png',
    N'Double smashed patties, crisp lettuce, tomato, pickles, onion.',
    N'A balanced house burger with juicy beef, toasted bun, and the perfect amount of veggies. ',
    N'One beef patty, Pickles, onion, lettuce, tomato, Served on toasted brioche',
    N'Best Seller, House Favorite, Kenna''s Favorite'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'pb-gal',
    N'PB + Java Burger',
    9.75,
    N'burgers',
    N'PBJava.jpg',
    N'Beef patty, peanut butter glaze, espresso BBQ, lettuce, jalapenos.',
    N'A bold sweet-and-savory burger featuring a juicy beef patty topped with creamy peanut butter and smoky espresso-infused BBQ sauce, balanced with crisp lettuce and a kick of jalapeno.',
    N'Beef patty, Peanut butter glaze, Espresso BBQ sause, Lettuce, jalapenos, Served on toasted brioche',
    N'A Coding Special, Fresh'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'veg-gal',
    N'Vegitaidan Burger',
    9.75,
    N'burgers',
    N'Veggie Burger.jpg',
    N'Vegetarian patty, avocado, spinach, pickled onion, lemon aioli.',
    N'A fresh vegetarian option with creamy avocado and a bright finish.',
    N'Vegetarian patty, Avocado & spinach, Pickled red onion, Lemon aioli',
    N'Vegetarian, Fresh'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'death-gal',
    N'Leviathan Burger',
    23.75,
    N'burgers',
    N'Leviathan Burger.png',
    N'Six smash patties on 8 inch buns, avocado, lettuce, tomato, onion rings, pickles, bacon, and ketchup.',
    N'More meal than most people can survive. Includes triple batch of hot-honey fries.',
    N'Six smash patties, Avocado, lettuce, tomato, Onion rings, pickles, bacon, Hot-honey fries',
    N'Carnavore, Death by Burger'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'han-gal',
    N'Classic Han Burger',
    11.50,
    N'burgers',
    N'Classic Han Burger.png',
    N'Juicy beef patty, crisp lettuce, tomato, pickles, cucumber, onions, and house green sauce.',
    N'A balanced house burger with juicy beef, toasted gluten-free bun, and a bright green herb sauce that makes it stand out.',
    N'Juicy beef patty, Green herb sauce, Pickles, onion, tomato, cucumber, lettuce, Served on a tasty gluten-free bun',
    N'Allergy-Friendly, Hannah''s Favorite'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'bacon-gal',
    N'Bacon Beach Burger',
    12.50,
    N'burgers',
    N'Bacon Beach.png',
    N'Beef patty, crispy bacon, grilled pineapple, BBQ sauce, lettuce, tomato.',
    N' tropical twist on a classic burger-featuring a juicy beef patty stacked with crispy bacon, sweet grilled pineapple, and rich BBQ sauce, all balanced with fresh lettuce and tomato for a perfect beachside bite.',
    N'Juicy beef patty, Crispy bacon, Grilled pineapple, BBQ sauce, Lettuce & tomato, Served on toasted brioche',
    N'Best Seller, House Favorite, Beachside Blast'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'Regular-Fries',
    N'House Fries',
    3.75,
    N'Fries',
    N'Regular Fries.png',
    N'House-cut, Crispy, Perfectly Seasoned.',
    N'Crispy, golden house-cut fries with a perfectly seasoned crunch and fluffy interior-served hot and fresh, just the way comfort food should be at Three Gals.',
    N'Six smash patties, Avocado, lettuce, tomato, Onion rings, pickles, bacon, Hot-honey fries',
    N'Carnavore, Fresh'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'green-lemonade',
    N'Green Lemonade',
    5.50,
    N'drinks',
    N'Greenlemonade.png',
    N'A refreshing blend of green tea, lemon, and natural sweeteners.',
    N'A revitalizing drink that combines the freshness of green tea with the zesty kick of lemon.',
    N'Green tea, Lemon, Natural sweeteners',
    N'Fresh, House Favorite'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'hot-dog',
    N'OG Hot Dog',
    1.75,
    N'hot-dogs',
    N'hotdog.png',
    N'The original hot dog.',
    N'An original hot dog with cost efficient ingredients and unique flavor.',
    N'Meat, Bun, Toppings',
    N'Classic, Budget Friendly'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'Soda',
    N'Soda',
    2.75,
    N'drinks',
    N'Greenlemonade.png',
    N'A refreshing beverage.',
    N'A refreshing soda with a crisp taste and bubbly texture.',
    N'Carbonated water, Artificial flavors, Artificial Sweeteners',
    N'Refreshment, Classic'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'vanilla-milkshake',
    N'Drew-Nilla Shake',
    7.50,
    N'drinks',
    N'Drew-nilla Shake.png',
    N'A creamy blend of vanilla ice cream and milk.',
    N'A creamy and indulgent milkshake made with rich ice cream and smooth milk for a classic treat.',
    N'Ice cream, Milk, Vanilla',
    N'Indulgent, Classic'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'chocolate-milkshake',
    N'Chocolate Shake',
    7.50,
    N'drinks',
    N'Chocolate Shake.png',
    N'A flavorful blend of chocolate ice cream and milk.',
    N'A rich and indulgent milkshake made with creamy chocolate ice cream and smooth milk for a delicious treat.',
    N'Chocolate ice cream, Milk, Chocolate syrup',
    N'Indulgent, Classic'
);

INSERT INTO menuItems (id, name, price, category, image, short_description, description, details, tags)
VALUES (
    N'mint-milkshake',
    N'Mint Shake',
    7.75,
    N'drinks',
    N'Mint Shake.png',
    N'A refreshing blend of mint and chocolate ice cream with milk.',
    N'A delightful milkshake made with creamy mint and chocolate ice cream and smooth milk for a refreshing treat.',
    N'Mint ice cream, Chocolate ice cream, Milk',
    N'Indulgent, House Favorite'
);
