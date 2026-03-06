/* Seed script for initial products */
const Product = require('./models/Product');

const productsData = [
  { name: 'Amethyst Hoop Earrings', price: 28000, category: 'Earrings', image: '/images/Amethyst Hoop Earrings.jpg' },
  { name: 'Diamond Infinity Necklace', price: 85000, category: 'Necklace', image: '/images/Diamond Infinity Necklace.jpg' },
  { name: 'Diamond Ring Elite', price: 45000, category: 'Ring', image: '/images/Diamond Ring Elite.jpg' },
  { name: 'Diamond Stud Earrings', price: 45000, category: 'Earrings', image: '/images/Diamond Stud Earrings.jpg' },
  { name: 'Diamond Tennis Bracelet', price: 90000, category: 'Bracelet', image: '/images/Diamond Tennis Bracelet.jpg' },
  { name: 'Emerald Bangle Bracelet', price: 48000, category: 'Bracelet', image: '/images/Emerald Bangle Bracelet.jpg' },
  { name: 'Emerald Crown Ring', price: 60000, category: 'Ring', image: '/images/Emerald Crown Ring.jpg' },
  { name: 'Emerald Earrings', price: 35000, category: 'Earrings', image: '/images/Emerald Earrings.avif' },
  { name: 'Emerald Harmony Necklace', price: 72000, category: 'Necklace', image: '/images/Emerald Harmony Necklace.jpg' },
  { name: 'Gold Cuff Bracelet', price: 65000, category: 'Bracelet', image: '/images/Gold Cuff Bracelet.jpg' },
  { name: 'Luxury Bracelet', price: 52000, category: 'Bracelet', image: '/images/Luxury Bracelet.jpg' },
  { name: 'Opal Glow Earrings', price: 27000, category: 'Earrings', image: '/images/Opal Glow Earrings.jpg' },
  { name: 'Opal Radiance Necklace', price: 64000, category: 'Necklace', image: '/images/Opal Radiance Necklace.jpg' },
  { name: 'Opal Radiant Bracelet', price: 42000, category: 'Bracelet', image: '/images/Opal Radiant Bracelet.jpg' },
  { name: 'Opal Vintage Ring', price: 37000, category: 'Ring', image: '/images/Opal Vintage Ring.jpg' },
  { name: 'Pearl Choker Necklace', price: 30000, category: 'Necklace', image: '/images/Pearl Choker Necklace.jpg' },
  { name: 'Pearl Drop Earrings', price: 25000, category: 'Earrings', image: '/images/Pearl Drop Earrings.jpg' },
  { name: 'Pearl Elegance Bracelet', price: 38000, category: 'Bracelet', image: '/images/Pearl Elegance Bracelet.jpg' },
  { name: 'Platinum Solitaire Ring', price: 55000, category: 'Ring', image: '/images/Platinum Solitaire Ring.jpg' },
  { name: 'Rose Gold Halo Ring', price: 40000, category: 'Ring', image: '/images/Rose Gold Halo Ring.jpg' },
  { name: 'Royal Gold Necklace', price: 75000, category: 'Necklace', image: '/images/Royal Gold Necklace.jpg' },
  { name: 'Ruby Cascade Necklace', price: 68000, category: 'Necklace', image: '/images/Ruby Cascade Necklace.jpg' },
  { name: 'Ruby Heart Ring', price: 48000, category: 'Ring', image: '/images/Ruby Heart Ring.jpg' },
  { name: 'Ruby Link Bracelet', price: 47000, category: 'Bracelet', image: '/images/Ruby Link Bracelet.jpg' },
  { name: 'Ruby Spark Earrings', price: 36000, category: 'Earrings', image: '/images/Ruby Spark Earrings.jpg' },
  { name: 'Sapphire Eternity Ring', price: 70000, category: 'Ring', image: '/images/Sapphire Eternity Ring.jpg' },
  { name: 'Sapphire Luxe Bracelet', price: 54000, category: 'Bracelet', image: '/images/Sapphire Luxe Bracelet.jpg' },
  { name: 'Sapphire Pendant Necklace', price: 62000, category: 'Necklace', image: '/images/Sapphire Pendant Necklace.jpg' },
  { name: 'Sapphire Wave Earrings', price: 33000, category: 'Earrings', image: '/images/Sapphire Wave Earrings.jpg' },
  { name: 'Silver Charm Bracelet', price: 31000, category: 'Bracelet', image: '/images/Silver Charm Bracelet.jpg' }
];

const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedProductsIfNeeded = async () => {
  try {
    const count = await Product.countDocuments();
    if (count !== productsData.length) {
      // Replace existing data to ensure full set
      await Product.deleteMany({});
      await Product.insertMany(productsData);
      console.log('Seeded products into database (replaced existing data)');
    } else {
      console.log('Products already seeded and up-to-date');
    }
  } catch (err) {
    console.error('Error seeding products:', err.message);
  }
};

// ensure an admin user exists
const ensureAdminUser = async () => {
  try {
    const existing = await User.findOne({ isAdmin: true });
    if (existing) {
      console.log('Admin user already exists:', existing.email);
      return;
    }
    // fallback creds
    const email = process.env.ADMIN_EMAIL || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'VRx@J21055';
    const phone = process.env.ADMIN_PHONE || '0000000000';
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: 'admin', email, password: hashed, phone, isAdmin: true });
    console.log('Created default admin user:', email);
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
};

module.exports = { seedProductsIfNeeded, ensureAdminUser };
