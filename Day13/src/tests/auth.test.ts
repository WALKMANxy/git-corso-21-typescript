import request from 'supertest';
import {assert} from 'chai';
import {User} from '../models/User';
import app, { connection } from "../app";


describe('Auth Signup', () => {
    let userId: string;
    let userId2: string;
    let verificationToken: string;
    
    before(async() => {
        await connection;

    });

    after(async () => {
        await User.findByIdAndDelete(userId);
        await User.findByIdAndDelete(userId2);

    });

    it('GET /status should return 200', async () => {
        const {status} = await request(app)
        .get('/status');
        assert.equal(status, 200)

    });

    it('POST /auth/signup should return 400 for bad password', async () => {
        const {status} = await request(app)
        .post('/auth/signup')
        .send({
            name : 'John',
            email: 'john.does@mail.me',
            password: 'badpassword',
        })

        assert.equal(status, 400)
    })

    it('POST /auth/signup should return 400 for missing name', async () => {
        const {status} = await request(app)
        .post('/auth/signup')
        .send({
        
            email: 'john.doe@mail.me',
            password: 'BadPassword1!'
        })

        assert.equal(status, 400)
    });

    it('POST /auth/signup should return 400 for missing email', async () => {
        const {status} = await request(app)
        .post('/auth/signup')
        .send({
            name: 'John',
            password: 'BadPassword1!'
        })
    });

    it('POST /auth/signup should return 201 and create a new user', async () => {
        const {status, body} = await request(app)
        .post('/auth/signup')
        .send({
            name: 'John',
            email: 'john.doe@mail.me',
            password: 'BadPassword1!'
        })
        assert.equal(status, 201);
        userId = body.id;
    });

    
    it('POST /auth signup should return 201 for duplicate email since it was not authenticated', async () => {
        const params  = {
        
            name: 'John',
            mail: 'john.doe@mail.me',
            password: 'BadPassword1!'  
        };


        const {body} = await request(app).post("/auth/signup").send(params);
        userId2 = body.id;
        const {status} = await request(app).post("/auth/signup").send(params);
        
        userId2 = body.id
        verificationToken = body.verificationToken;


    });

    it('GET /auth/verify/:token should return 404 for an invalid verification token', async () => {
        const invalidToken = 'invalidToken';

        
        const {status} = await request(app)
        .get(`/auth/verify/${invalidToken}`);

        assert.equal(status, 404);
    });

    it('GET /auth/verify/:token should return 200 for a valid verification token', async () => {
        const {status} = await request(app)
        .get(`/auth/verify/${verificationToken}`);

        assert.equal(status, 200);
    });

    



    
})
