// In this test file, we use the supertest library to make HTTP requests to our Express app and test the authentication endpoints.
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

describe('Authentication API', () => {
    // Test cases for the registration endpoint
    it('should return validation errors for registration with invalid data', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ email: 'test@example.com' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('errors');
    });
    // Test cases for the login endpoint
    it('should register a new user with valid input', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser10',
                email: 'test10@example.com',
                password: 'secret12345'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });
    // Test cases for the login and returnig a token
    it('should login a user and return a token', async () => {
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'secret123'
            });
        
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'secret123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });
});

