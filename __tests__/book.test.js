const request = require("supertest");

const createServer = require("../index");

const app = createServer();

const bookPayload =  {
  "title": "The Great Gatsby",
  "description": "The story of the enigmatic Jay Gatsby and his love for the beautiful Daisy Buchanan.",
  "price": 15.99,
  "cover_image": "https://example.com/covers/great_gatsby.jpg"
}


describe("books", () => {
  describe("No authentication", () => {
    describe("Get Book List", () => {
      it("GET /api/books", async () => {
        const response = await request(app).get("/api/books").expect(200);
      });
    });

    describe("Get Book Details", () => {
      describe("GET /api/book/:bookId", () => {
        describe("given the book does not exist", () => {
          it("should return a 404", async () => {
            const bookId = 0;
            await request(app).get(`/api/book/${bookId}`).expect(404);
          });
        });

        describe("given the book does exist", () => {
          it("should return a 200", async () => {
            const bookId = "4";
            await request(app).get(`/api/book/${bookId}`).expect(200);
          });
        });
      });
    });

    describe("GET /api/authors/books", () => {
      it("Unauthorized", async () => {
         await request(app)
          .get("/api/authors/books")
          .expect(401);
      });
    });

    describe("GET /api/authors/books/:id", () => {
      describe("Unauthorized", () => {
        describe("given the book does exist", () => {
          const bookId = 3;
          it("Get specific book by id", async () => {
            await request(app)
              .get(`/api/authors/book/${bookId}`)
              .expect(401);
          });
        });
      });
    });

    describe("POST /api/authors/publish", () => {
      describe("Unauthorized", () => {
        it("Publish own book", async () => {
          await request(app)
            .post("/api/authors/publish")
            .send(bookPayload)
            .expect(401);
        });
      });
    });

    describe("Unauthorized", () => {
      it("Edit own book", async () => {
        const bookId = 5;
        await request(app)
          .put(`/api/authors/book/${bookId}`)
          .send(bookPayload)
          .expect(401);
      });
    });


    describe("Unauthorized", () => {
      it("Unpublish own book", async () => {
        const bookId = 1000;
        await request(app)
          .delete(`/api/authors/unpublish/${bookId}`)
          .expect(401);
      });
    });
});

  describe("With authentication", () => {
    let authToken; // Store JWT token for authenticated requests
    let bookId;
    let randomId;

    // Login to get the authentication token
    beforeAll(async () => {
      const { body, statusCode } = await request(app)
        .post("/api/signin")
        .send({ username: "johndoe26", password: "password123" })
        .expect("Content-Type", /json/);

      authToken = body.results.access_token;
    });


    describe("POST /api/authors/publish", () => {
      it("Publish own book", async () => {
           const { body } = await request(app)
          .post("/api/authors/publish")
          .set("Authorization", `Bearer ${authToken}`)
          .expect("Content-Type", /json/)
          .send(bookPayload)
          .expect(201);

          bookId = body.results.id || 1
      });
    });

    describe("GET /api/authors/books", () => {
      it("should get a list of books", async () => {
         await request(app)
          .get("/api/authors/books")
          .set("Authorization", `Bearer ${authToken}`)
          .expect(200);
      });
    });

    describe("GET /api/authors/books/:id", () => {
      describe("Get a list of books for logged-in user", () => {
        describe("given the book does exist", () => {
          it("Get specific book by id", async () => {
            await request(app)
              .get(`/api/authors/book/${bookId}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect(200);
          });
        });

        describe("given the book does not exist", () => {

          it("Get specific book by id", async () => {
            await request(app)
              .get(`/api/authors/book/${randomId}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect(404);
          });
        });


        

        describe("PUT /api/authors/book/:id", () => {
          it("Edit own book", async () => {
               await request(app)
              .put(`/api/authors/book/${bookId}`)
              .set("Authorization", `Bearer ${authToken}`)
              .expect("Content-Type", /json/)
              .send(bookPayload)
              .expect(201);
          });


          it("Edit others book", async () => {
            await request(app)
           .put(`/api/authors/book/${randomId}`)
           .set("Authorization", `Bearer ${authToken}`)
           .send(bookPayload)
           .expect(400);
       });
      });


      describe("DELETE /api/authors/unpublish/:id", () => {
        it("Unpublish own book", async () => {
             await request(app)
            .delete(`/api/authors/unpublish/${bookId}`)
            .set("Authorization", `Bearer ${authToken}`)
            .expect(201);
        });


        it("Unpublish others book", async () => {
          await request(app)
         .delete(`/api/authors/unpublish/${randomId}`)
         .set("Authorization", `Bearer ${authToken}`)
         .expect(400);
     });
    });


    describe("Route Restriction", () => {
      let authToken; // Store JWT token for authenticated requests
  
      // Login to get the authentication token
      beforeAll(async () => {
        const { body } = await request(app)
          .post("/api/signin")
          .send({ username: "darthvader88", password: "darthvader!" })
          .expect("Content-Type", /json/);
  
        authToken = body.results.access_token;
      });



      describe("POST /api/authors/publish", () => {
        it("Darth Vader cant publish own book", async () => {
             await request(app)
            .post("/api/authors/publish")
            .set("Authorization", `Bearer ${authToken}`)
            .expect("Content-Type", /json/)
            .send(bookPayload)
            .expect(403);
        });
      });
    })  


      });
    });
  });
});
