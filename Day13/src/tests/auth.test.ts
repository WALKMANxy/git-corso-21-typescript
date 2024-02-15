import request from 'supertest';
import { User } from '../models/User';
import app, { connection } from '../app';
import { assert } from 'chai';


describe('Signup Endpoint', () => {
    let userId: string;

    before(async function () {
        this.timeout(15000); // Set the timeout to 15 seconds
        await connection;
        });

        after(async () => {
            // Cleanup: Delete the user created during the test
            if (userId) {
              await User.findByIdAndDelete(userId);
            }
          });


    it('should create a new user and return 201 with user details', async () => {
      // Define the user data for signup
      const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
      };
  
      // Send a POST request to the signup endpoint
      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201); // Expecting a 201 status code
  
      // Check the response body
      const { body } = response;
      assert.equal(body.message, 'User created successfully. Verification token stored.');
      assert.isDefined(body.user);
      assert.isDefined(body.user.id);
      assert.isDefined(body.user.verificationToken);
      
      console.log(body.user);
      console.log(body.user.verificationToken);
      console.log(body.user.id)


      // Check if the user is actually created in the database
      const createdUser = await User.findOne({ email: userData.email });
      assert.isDefined(createdUser);
      assert.equal(createdUser?.name, userData.name);
      assert.equal(createdUser?.email, userData.email);
      assert.isTrue(createdUser?.isVerified === false); // Assuming isVerified starts as false
      assert.equal(createdUser?.verificationToken, body.user.verificationToken);
    });
  
    // Add more test cases for handling errors, duplicate emails, etc., as needed
  });

describe('Auth Signup', () => {
  let userId: string;
  let userId2: string;

  before(async function () {
    this.timeout(15000); // Set the timeout to 15 seconds
    await connection;
    });


  after(async () => {
    // Use try-catch to handle any errors during deletion
    try {
      if (userId) {
        await User.findByIdAndDelete(userId);
      }
      if (userId2) {
        await User.findByIdAndDelete(userId2);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  });

  it('POST /auth/signup should return 400 for bad password', async () => {
    const { status } = await request(app)
      .post('/auth/signup')
      .send({
        name: 'John',
        email: 'john.does@mail.me',
        password: 'badpassword',
      })
      .expect(400);

    assert.equal(status, 400);
  });

  it('POST /auth/signup should return 400 for missing name', async () => {
    const { status } = await request(app)
      .post('/auth/signup')
      .send({
        email: 'john.doe@mail.me',
        password: 'BadPassword1!',
      });

    assert.equal(status, 400);
  });

  it('POST /auth/signup should return 400 for missing email', async () => {
    const { status } = await request(app)
      .post('/auth/signup')
      .send({
        name: 'John',
        password: 'BadPassword1!',
      });

    assert.equal(status, 400);
  });

  it('POST /auth/signup should return 201 and create a new user', async () => {
    const response = await request(app)
        .post('/auth/signup')
        .send({
            name: 'Timmy',
            email: 'timmy.doe@mail.me',
            password: 'BadPassword1!'
        })
        .expect(201);

    const { body } = response;

    assert.equal(typeof body.user.id, typeof "string");

    userId = body.user.id;

    console.log(userId);
});

it('POST /auth signup should return 201 for duplicate email since it was not authenticated', async () => {
    const params = {
        name: 'Timmy',
        email: 'timmy.doe@mail.me',
        password: 'BadPassword1!',
    };

    // First signup attempt
    const response = await request(app).post('/auth/signup').send(params).expect(201);

    // Check if the first signup was successful

    const {body} = response;

    assert.equal(typeof body.user.id, typeof "string"); // Ensure _id is defined
    userId2 = body.user.id;

    // Second signup attempt with the same email
    const response2 = await request(app).post('/auth/signup').send(params);

    // Check if the second signup is successful
    assert.equal(response2.status, 201);
    assert.isDefined(response2.body._id); // Ensure _id is defined

    // Additional checks or assertions if needed
});


  it('GET /auth/verify/:token should return 404 for an invalid verification token', async () => {
    const invalidToken = 'invalidToken';

    const { status } = await request(app).get(`/auth/verify/${invalidToken}`);

    assert.equal(status, 404);
  });
});
