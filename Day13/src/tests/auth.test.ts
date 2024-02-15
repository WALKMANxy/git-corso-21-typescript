import request from 'supertest';
import { User } from '../models/User';
import app, { connection } from '../app';
import { assert } from 'chai';


describe('Testing signup process and that all data is valid.', () => {
    let userId: string;

    before(async function () {
        this.timeout(15000); // Set the timeout to 15 seconds
        await connection;
        });

        after(async function () {
          this.timeout(15000); 
      
          try {
              if (userId) {
                  console.log("Attempting to delete User with id:", userId);
      
                  // Delete the user created during the test
                  const deletionResult = await User.findByIdAndDelete(userId);
      
                   console.log("Deletion result:", deletionResult);
                }
              console.log("Cleanup Successful");
          } catch (err) {
              console.error("Error during cleanup:", err);
          }
      });
      
      


    it('Should create a new user and return 201 with user details', async () => {
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
      const verificationLink = `http://localhost:3000/auth/verify/${body.user.verificationToken}`;
      assert.equal(body.message, `User created successfully. Verify your account using the following link: ${verificationLink}`);
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
      assert.isTrue(createdUser?.isVerified === false); // isVerified starts as false
      assert.equal(createdUser?.verificationToken, body.user.verificationToken);

      userId = body.user.id;

      console.log(userId);

    });
  
    
  });

describe('Testing error cases for the signup process.', () => {
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
        
        await User.findByIdAndDelete(userId);
        }
        if (userId2) {
        
        await User.findByIdAndDelete(userId2);
        }
        console.log("Cleanup Successful");
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
  });
});


describe('Account Verification', () => {
  let userId: string;
  let verificationToken: string;

  before(async function () {
    this.timeout(15000); // Set the timeout to 15 seconds
    await connection;
  });

  after(async () => {
    // Cleanup: Delete the user created during the test
    try {
      if (userId) {
        console.log("User id to delete:", userId);
        await User.findByIdAndDelete(userId);
      }
      console.log("Cleanup Successful");
    } catch (err) {
      console.log("Couldn't cleanup users", err);
    }
  });

  it('Should successfully verify the user account, expect 201', async () => {
    // Create a user and get the verification token
    const userData = {
      name: 'Samuel Doe',
      email: 'samuel.doe@example.com',
      password: 'StrongPassword123!',
    };

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send(userData)
      .expect(201);

    const { body } = signupResponse;
    userId = body.user.id;
    verificationToken = body.user.verificationToken;

    // Send a request to the verification endpoint
    const verificationResponse = await request(app)
      .get(`/auth/verify/${verificationToken}`)
      .expect(200); 

    
    assert.equal(verificationResponse.body.message, 'Verification successful. You can now log in.');
   
  });

  it('Should handle invalid verification tokens, expect 404', async () => {
    const invalidToken = 'invalidToken';

    const { status } = await request(app)
      .get(`/auth/verify/${invalidToken}`)
      .expect(404);

    assert.equal(status, 404);
  });
});

describe('Account Verification and Login, use cases, expect 201, 200 ', () => {
  let userId: string;
  let verificationToken: string;

  before(async function () {
    this.timeout(15000); // Set the timeout to 15 seconds
    await connection;
  });

  after(async () => {
    // Cleanup: Delete the user created during the test
    try {
      if (userId) {
        console.log("User id to delete:", userId);
        await User.findByIdAndDelete(userId);
      }
      console.log("Cleanup Successful");
    } catch (err) {
      console.log("Couldn't cleanup users", err);
    }
  });

  it('should successfully verify the user account', async () => {
    // Create a user and get the verification token
    const userData = {
      name: 'Samuel Doe',
      email: 'samuel.doe@example.com',
      password: 'StrongPassword123!',
    };

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send(userData)
      .expect(201);

    const { body } = signupResponse;
    userId = body.user.id;
    verificationToken = body.user.verificationToken;

    // Send a request to the verification endpoint
    const verificationResponse = await request(app)
      .get(`/auth/verify/${verificationToken}`)
      .expect(200); 

    
    assert.equal(verificationResponse.body.message, 'Verification successful. You can now log in.');
    
  });

  it('Should successfully log in with valid credentials, expect 200', async () => {
    const loginData = {
      email: 'samuel.doe@example.com',
      password: 'StrongPassword123!',
    };

    const { body } = await request(app)
      .post('/auth/login')
      .send(loginData)
      .expect(200);

    assert.equal(body.message, 'Login successful');
    assert.isDefined(body.token);
  });

  it('Should handle invalid credentials during login, expect 401', async () => {
    const invalidLoginData = {
      email: 'samuel.doe@example.com',
      password: 'InvalidPassword',
    };

    const { status, body } = await request(app)
      .post('/auth/login')
      .send(invalidLoginData)
      .expect(401);


    
    assert.equal(body.message, 'Invalid credentials');
  });
});

describe('Account Verification and Login, /me endpoint', () => {
  let userId: string;
  let verificationToken: string;
  let authToken: string;


  before(async function () {
    this.timeout(15000); // Set the timeout to 15 seconds
    await connection;
  });

  after(async () => {
    // Cleanup: Delete the user created during the test
    try {
      if (userId) {
        
        await User.findByIdAndDelete(userId);
      }
        console.log("Cleanup Successful");
  } catch (err) {
        console.log("Couldn't cleanup users", err);
    }
  });

  it('Should successfully verify the user account, expect 201, 200', async () => {
    // Create a user and get the verification token
    const userData = {
      name: 'Samuel Doe',
      email: 'samuel.doe@example.com',
      password: 'StrongPassword123!',
    };

    const signupResponse = await request(app)
      .post('/auth/signup')
      .send(userData)
      .expect(201);

    const { body } = signupResponse;
    userId = body.user.id;
    verificationToken = body.user.verificationToken;

    // Send a request to the verification endpoint
    const verificationResponse = await request(app)
      .get(`/auth/verify/${verificationToken}`)
      .expect(200); 

    
    assert.equal(verificationResponse.body.message, 'Verification successful. You can now log in.');
  });

  it('Should successfully log in with valid credentials, expect 200', async () => {
    const loginData = {
      email: 'samuel.doe@example.com',
      password: 'StrongPassword123!',
    };

    const { body } = await request(app)
      .post('/auth/login')
      .send(loginData)
      .expect(200);

    authToken = body.token; 
    assert.equal(body.message, 'Login successful');
    assert.isDefined(body.token);
  });

  it('Should return the user profile for an authenticated user, expect 200', async () => {
    const response = await request(app)
      .get('/auth/users/me') 
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    assert.isDefined(response.body.user);
});

it('Should update the user profile for an authenticated user, expect 200', async () => {
    const updatedUserData = {
        name: 'Timothy Doe',
        email: 'timothy.doe@example.com',
        password: 'NewPassword123!',
    };

    const response = await request(app)
      .put('/auth/users/me') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUserData)
      .expect(200);

    assert.equal(response.body.message, 'Profile updated successfully');
});

it('Should handle validation errors, expect 400', async () => {
    // Send an invalid request body 
    const invalidUserData = {};

    const response = await request(app)
      .put('/auth/users/me') 
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidUserData)
      .expect(400);

    assert.isDefined(response.body.errors);
  });

it('Should handle unauthorized access, expect 401', async () => {

  const updatedUserData = {
    name: 'Timothy Doe',
    email: 'timothy.doe@example.com',
    password: 'NewPassword123!',
};  

  const invalidToken = 'invalidToken';

    // Make a request without setting the Authorization header
    const response = await request(app)
      .put('/auth/users/me') // Corrected path
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(updatedUserData)
      .expect(401);

    assert.equal(response.body.message, 'Unauthorized');
    });


});