const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const bcrypt   = require('bcryptjs');
dotenv.config({ path: './config.env' });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/E-commerenceDatebase';

// ── Inline schemas matching the real models exactly ───────────────────────────
const categorySchema = new mongoose.Schema({ name: String, slug: String, image: String });
const subCatSchema   = new mongoose.Schema({ name: String, slug: String, category: mongoose.Schema.Types.ObjectId });
const brandSchema    = new mongoose.Schema({ name: String, slug: String, image: String });

const productSchema  = new mongoose.Schema({
  title:                { type: String, required: true, unique: true },
  description:          { type: String, required: true },
  price:                { type: Number, required: true },
  discountPrice:        Number,
  quantity:             { type: Number, required: true },
  quantityOfSoldProduct:{ type: Number, default: 0 },
  coverPhoto:           { type: String, required: true, unique: true },
  photo:                String,
  rating:               { type: Number, required: true, min: 1, max: 5 },
  ratingAverage:        Number,
  ratingQuantity:       { type: Number, default: 0 },
  color:                { type: String, required: true },
  category:             { type: mongoose.Schema.Types.ObjectId, required: true },
  brand:                { type: mongoose.Schema.Types.ObjectId, required: true },
  subCategory:          [{ type: mongoose.Schema.Types.ObjectId }],
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: String, role: { type: String, default: 'user' },
  wishList: [], addresses: [],
});

const Category = mongoose.model('Category',   categorySchema);
const SubCat   = mongoose.model('subCategory', subCatSchema);
const Brand    = mongoose.model('Brand',       brandSchema);
const Product  = mongoose.model('product',     productSchema);
const User     = mongoose.model('User',        userSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Drop all collections cleanly to avoid index conflicts
  const collections = await mongoose.connection.db.collections();
  for (const col of collections) {
    await col.drop().catch(() => {});
  }
  console.log('🗑️  Cleared all collections');

  // ── Categories ──────────────────────────────────────────────────────────────
  const [electronics, clothing, home, accessories] = await Category.insertMany([
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Clothing',    slug: 'clothing'    },
    { name: 'Home',        slug: 'home'        },
    { name: 'Accessories', slug: 'accessories' },
  ]);

  // ── SubCategories ───────────────────────────────────────────────────────────
  const [phones, laptops, shirts, jackets, decor, bags, watches] = await SubCat.insertMany([
    { name: 'Phones',   slug: 'phones',   category: electronics._id },
    { name: 'Laptops',  slug: 'laptops',  category: electronics._id },
    { name: 'Shirts',   slug: 'shirts',   category: clothing._id    },
    { name: 'Jackets',  slug: 'jackets',  category: clothing._id    },
    { name: 'Decor',    slug: 'decor',    category: home._id        },
    { name: 'Bags',     slug: 'bags',     category: accessories._id },
    { name: 'Watches',  slug: 'watches',  category: accessories._id },
  ]);

  // ── Brands ──────────────────────────────────────────────────────────────────
  const [apple, samsung, nike, adidas, ikea, sony, zara, lg] = await Brand.insertMany([
    { name: 'Apple',   slug: 'apple'   },
    { name: 'Samsung', slug: 'samsung' },
    { name: 'Nike',    slug: 'nike'    },
    { name: 'Adidas',  slug: 'adidas'  },
    { name: 'IKEA',    slug: 'ikea'    },
    { name: 'Sony',    slug: 'sony'    },
    { name: 'Zara',    slug: 'zara'    },
    { name: 'LG',      slug: 'lg'      },
  ]);

  // ── Products (every field required by the real schema) ──────────────────────
  await Product.insertMany([
    {
      title: 'iPhone 15 Pro',
      description: 'The latest iPhone with A17 Pro chip, titanium design, and an amazing camera system with 48MP main sensor.',
      price: 999, discountPrice: 949, quantity: 25, color: 'black',
      rating: 5, ratingAverage: 4.8, ratingQuantity: 142,
      coverPhoto: 'iphone-15-pro.jpg',
      category: electronics._id, subCategory: [phones._id], brand: apple._id,
    },
    {
      title: 'Samsung Galaxy S24 Ultra',
      description: 'Flagship Android phone with built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor.',
      price: 1199, quantity: 18, color: 'titanium gray',
      rating: 5, ratingAverage: 4.7, ratingQuantity: 98,
      coverPhoto: 'samsung-s24-ultra.jpg',
      category: electronics._id, subCategory: [phones._id], brand: samsung._id,
    },
    {
      title: 'MacBook Pro 14 inch',
      description: 'Powered by M3 Pro chip with up to 18 hours battery life and a stunning Liquid Retina XDR display.',
      price: 1999, discountPrice: 1799, quantity: 12, color: 'silver',
      rating: 5, ratingAverage: 4.9, ratingQuantity: 203,
      coverPhoto: 'macbook-pro-14.jpg',
      category: electronics._id, subCategory: [laptops._id], brand: apple._id,
    },
    {
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise cancelling headphones with 30-hour battery and crystal clear hands-free calling.',
      price: 349, discountPrice: 279, quantity: 40, color: 'black',
      rating: 5, ratingAverage: 4.8, ratingQuantity: 317,
      coverPhoto: 'sony-xm5.jpg',
      category: electronics._id, subCategory: [phones._id], brand: sony._id,
    },
    {
      title: 'Nike Air Max 270',
      description: 'Lifestyle shoe featuring Nike biggest heel Air unit yet for an incredibly light comfortable ride.',
      price: 150, quantity: 60, color: 'orange',
      rating: 4, ratingAverage: 4.5, ratingQuantity: 89,
      coverPhoto: 'nike-air-max-270.jpg',
      category: clothing._id, subCategory: [shirts._id], brand: nike._id,
    },
    {
      title: 'Adidas Ultraboost 22',
      description: 'Responsive running shoes with BOOST midsole technology for incredible energy return every step.',
      price: 190, discountPrice: 149, quantity: 35, color: 'white',
      rating: 5, ratingAverage: 4.6, ratingQuantity: 74,
      coverPhoto: 'adidas-ultraboost-22.jpg',
      category: clothing._id, subCategory: [shirts._id], brand: adidas._id,
    },
    {
      title: 'Zara Merino Wool Jacket',
      description: 'Premium merino wool blend jacket with a timeless silhouette. Perfect for any occasion year round.',
      price: 185, quantity: 20, color: 'brown',
      rating: 4, ratingAverage: 4.4, ratingQuantity: 31,
      coverPhoto: 'zara-merino-jacket.jpg',
      category: clothing._id, subCategory: [jackets._id], brand: zara._id,
    },
    {
      title: 'IKEA KALLAX Shelf Unit',
      description: 'Versatile shelf unit that can be used as a room divider with 4 compartments and a clean modern look.',
      price: 79, quantity: 15, color: 'white',
      rating: 4, ratingAverage: 4.3, ratingQuantity: 156,
      coverPhoto: 'ikea-kallax.jpg',
      category: home._id, subCategory: [decor._id], brand: ikea._id,
    },
    {
      title: 'LG Smart TV 55 inch',
      description: '4K UHD Smart TV with webOS, Dolby Vision IQ, and built-in Google Assistant and Alexa support.',
      price: 699, discountPrice: 599, quantity: 8, color: 'black',
      rating: 5, ratingAverage: 4.6, ratingQuantity: 88,
      coverPhoto: 'lg-smart-tv-55.jpg',
      category: electronics._id, subCategory: [laptops._id], brand: lg._id,
    },
    {
      title: 'Nike Dri-FIT Training Shirt',
      description: 'Sweat-wicking fabric moves sweat away from your skin to keep you dry and comfortable during workouts.',
      price: 35, quantity: 100, color: 'blue',
      rating: 4, ratingAverage: 4.4, ratingQuantity: 62,
      coverPhoto: 'nike-dri-fit-shirt.jpg',
      category: clothing._id, subCategory: [shirts._id], brand: nike._id,
    },
    {
      title: 'Samsung 65 inch QLED TV',
      description: 'Quantum Dot technology delivers brilliant color and stunning contrast for an immersive viewing experience.',
      price: 1299, discountPrice: 999, quantity: 6, color: 'black',
      rating: 5, ratingAverage: 4.7, ratingQuantity: 45,
      coverPhoto: 'samsung-qled-65.jpg',
      category: electronics._id, subCategory: [laptops._id], brand: samsung._id,
    },
    {
      title: 'IKEA POANG Armchair',
      description: 'Layer-glued bent birch frame gives this armchair a comfortable resilience. A timeless classic design.',
      price: 129, quantity: 22, color: 'beige',
      rating: 4, ratingAverage: 4.5, ratingQuantity: 203,
      coverPhoto: 'ikea-poang-chair.jpg',
      category: home._id, subCategory: [decor._id], brand: ikea._id,
    },
  ]);

  console.log('✅ Seeded: 4 categories, 7 subcategories, 8 brands, 12 products');

  // ── Users ───────────────────────────────────────────────────────────────────
  const adminPass = await bcrypt.hash('admin1234', 12);
  const userPass  = await bcrypt.hash('user1234',  12);

  await User.insertMany([
    { name: 'Admin',     email: 'admin@cloudkitchen.com', password: adminPass, role: 'admin' },
    { name: 'Test User', email: 'user@cloudkitchen.com',  password: userPass,  role: 'user'  },
  ]);

  console.log('✅ Created accounts:');
  console.log('   Admin →  admin@cloudkitchen.com  /  admin1234');
  console.log('   User  →  user@cloudkitchen.com   /  user1234');
  console.log('\n🚀 Done! Refresh http://localhost:5173');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
