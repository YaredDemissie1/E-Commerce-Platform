const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Product = require('../models/Product');

describe('Product API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it('GET /api/products - should return all products', async () => {
    const testProduct = new Product({
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      image: 'test.jpg',
      category: 'Electronics',
      countInStock: 10
    });
    await testProduct.save();

    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Test Product');
  });

  it('POST /api/products - should create a new product', async () => {
    const token = 'valid-admin-token'; // You'll need to implement token generation
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
        image: 'new.jpg',
        category: 'Electronics',
        countInStock: 5
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Product');
  });
}); 