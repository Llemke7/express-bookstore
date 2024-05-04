const request = require('supertest');
const app = require('../app'); 

process.env.NODE_ENV = 'test';

describe('Books API', () => {
  it('should get all books', async () => {
    const res = await request(app).get('/books');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ books: expect.any(Array) }));
  });

  it('should create a new book', async () => {
    const newBook = {
      isbn: '1234567890',
      amazon_url: 'https://example.com',
      author: 'John Doe',
      language: 'English',
      pages: 200,
      publisher: 'Publisher',
      title: 'New Book',
      year: 2022
    };
    const res = await request(app).post('/books').send(newBook);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(expect.objectContaining({ book: expect.objectContaining(newBook) }));
  });

  it('should not create a book with invalid data', async () => {
    const invalidBook = {
      isbn: 'invalid',
      amazon_url: 'invalid_url',
      author: 123, // invalid type
      language: 'English',
      pages: -1, // invalid value
      publisher: 'Publisher',
      title: '',
      year: '2022' // invalid type
    };
    const res = await request(app).post('/books').send(invalidBook);
    expect(res.status).toBe(400);
    expect(res.body).toEqual(expect.objectContaining({ errors: expect.any(Array) }));
  });

});
