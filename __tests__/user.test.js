const request = require("supertest");

const createServer = require("../index");

const app = createServer();


const darthVaderUser = {
    username: "darthvader88",
    password: "darthvader!",
    author_pseudonym: "Darth Vader"
  };


const userPayload = {
    username: "johndoe26",
    password: "password123",
    author_pseudonym: "JohnTheReader"
  }


const changePasswordPayload = {
    current_password:"password123",
    new_password:"JohnTheReader",
    confirm_password:"JohnTheReader",
}
  
  
  

describe("user", () => {

let authToken;
    // user registration
    describe("user registration", () => {
      describe("given the username and password are valid", () => {
        it("should return the user payload", async () => {
          await request(app)
            .post("/api/signup")
            .send(userPayload)
            .expect("Content-Type", /json/)
            .expect(201);
        });

        it("should return the status 200", async () => {
          await request(app)
            .post("/api/signup")
            .send(darthVaderUser)
            .expect("Content-Type", /json/)
            .expect(201);
        });
      });
    });


      describe("sign in", () => {
        // Login to get the authentication token
        beforeAll(async () => {
          const { body, statusCode } = await request(app)
            .post("/api/signin")
            .send({ username: "johndoe26", password: "password123" })
            .expect("Content-Type", /json/);
          authToken = body.results.access_token;
        });

        describe("Change Password", () => {
          it("should return the status 200", async () => {
            await request(app)
              .put("/api/change_password")
              .set("Authorization", `Bearer ${authToken}`)
              .send(changePasswordPayload)
              .expect(200);
          });
        });
        
        describe("Update Profile", () => {
            const update = { author_pseudonym:"AliceInBooks" }

            it("should return the status 200", async () => {
              await request(app)
                .put("/api/update_profile")
                .set("Authorization", `Bearer ${authToken}`)
                .send(update)
                .expect(200);
            });
          });
      });

  });




