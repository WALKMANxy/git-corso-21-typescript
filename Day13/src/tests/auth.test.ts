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

        after(async function () {
          this.timeout(15000); // Set the timeout to 15 seconds
      
          try {
              if (userId) {
                  console.log("Attempting to delete User with id:", userId);
      
                  // Delete the user created during the test
                  const deletionResult = await User.findByIdAndDelete(userId);
      
                  console.log("Deletion result:", deletionResult);
              }
          } catch (err) {
              console.error("Error during cleanup:", err);
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

      userId = body.user.id;

      console.log(userId);

    });
  
    
  });

describe('Auth Signup', () => {
  let userId: string;
  let userId2: string;

  before(async function () {
    this.timeout(15000); // Set the timeout to 15 seconds
    await connection;
    });


    afterEach(async () => {
      
      // Cleanup: Delete the user created during the test
      try{
        if (userId) {
        console.log("User id 1", userId);
        await User.findByIdAndDelete(userId);
        }
        if (userId2) {
        console.log("User id 2", userId2);
        await User.findByIdAndDelete(userId2);
        }
      }catch(err){
        console.log("Couldn't cleanup users", err);
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
      })
      .expect(400);

    assert.equal(status, 400);
  });

  it('POST /auth/signup should return 400 for missing email', async () => {
    const { status } = await request(app)
      .post('/auth/signup')
      .send({
        name: 'John',
        password: 'BadPassword1!',
      })
      .expect(400);

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

it('POST /auth signup should return 409 for duplicate email', async () => {
    const params = {
        name: 'Timmy',
        email: 'timmy.doe@mail.me',
        password: 'BadPassword1!',
    };

    
    // First signup attempt
    const response = await request(app)
    .post('/auth/signup')
    .send(params)
    .expect(201);

    // Check if the first signup was successful

    const {body} = response;

    assert.equal(typeof body.user.id, typeof "string"); // Ensure _id is defined
    userId2 = body.user.id;

    // Second signup attempt with the same email
    const response2 = await request(app)
    .post('/auth/signup')
    .send(params)
    .expect(409);

    // Check if the second signup is successful

    
    assert.equal(response2.status, 409);
    assert.isDefined(body.user.id); // Ensure _id is defined

    // Additional checks or assertions if needed
});


  it('GET /auth/verify/:token should return 404 for an invalid verification token', async () => {
    const invalidToken = 'invalidToken';

    const { status } = await request(app)
    .get(`/auth/verify/${invalidToken}`)
    .expect(404);

    assert.equal(status, 404);
  });
});
