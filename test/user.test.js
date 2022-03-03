let app = require('../src/app.js');
let supertest = require('supertest');
let request = supertest(app);

let mainUser = {
    name: "Alisson",
    email: "alisson@outlook.com",
    password: "123456"
}

beforeAll(() => {
    return request.post("/user")
        .send(mainUser)
        .then(res => {

        }).catch(err => {
            console.log(err);
        })
});

afterAll(() => {
    request.delete("/user/" + mainUser.email)
        .then(res => { })
        .catch(err => { console.log(err) });
});

describe('Cadastro de usuário', () => {
    test('Deve cadastrar um usuário com sucesso', () => {

        let time = Date.now();
        let email = `email${time}@email.com`;

        let user = {
            name: "Alisson",
            email,
            password: "123456"
        };

        return request.post("/user")
            .send(user)
            .then(res => {

                expect(res.statusCode).toEqual(200);
                expect(res.body.email).toEqual(email);

            }).catch(err => {
                fail(err);
            });
    });

    test('Deve impedir que um usuário se cadastre com os dados vazios', () => {

        let user = {
            name: "",
            email: "",
            password: ""
        };

        return request.post("/user")
            .send(user)
            .then(res => {

                expect(res.statusCode).toEqual(400);

            }).catch(err => {
                fail(err);
            });

    });

    test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {
        let time = Date.now();
        let email = `email${time}@email.com`;

        let user = {
            name: "Alisson",
            email,
            password: "123456"
        };

        return request.post("/user")
            .send(user)
            .then(res => {

                expect(res.statusCode).toEqual(200);
                expect(res.body.email).toEqual(email);

                return request.post("/user")
                    .send(user)
                    .then(res => {
                        expect(res.statusCode).toEqual(400);
                        expect(res.body.error).toEqual("E-mail já cadastrado");
                    }).catch(err => {
                        fail(err);
                    })
            }).catch(err => {
                fail(err);
            });
    });
})

describe("Autenticação", () => {
    test("Deve me retornar um token quando logar", () => {
        return request.post("/auth")
            .send({ email: mainUser.email, password: mainUser.password })
            .then(res => {
                expect(res.statusCode).toEqual(200);
                expect(res.body.token).toBeDefined();
            })
            .catch(err => {
                fail(err)
            })
    })

    test("Deve impedir que usuário não cadastrado se logue", () => {
        return request.post("/auth")
            .send({ email: "umemailqualquer@desenhoumsolamarelo.com", password: "toquinhoaquarela" })
            .then(res => {
                expect(res.statusCode).toEqual(403);
                expect(res.body.errors.email).toEqual("Email não cadastrado");
            })
            .catch(err => {
                fail(err)
            })
    })

    test("Deve impedir que usuário logue com senha errado", () => {
        return request.post("/auth")
            .send({ email: mainUser.email, password: "toquinhoaquarela" })
            .then(res => {
                expect(res.statusCode).toEqual(403);
                expect(res.body.errors.password).toEqual("Senha incorreta");
            })
            .catch(err => {
                fail(err)
            })
    })
})