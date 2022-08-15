import { config } from "dotenv";

config();

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should NOT authenticate an user due to invalid email", () => {
    expect(async () => {

      const user = {
        email: "teste@teste.com",
        password: "password"
      };
  
      await createUserUseCase.execute({ ...user, name: "Bruno Teste" });
  
      await authenticateUserUseCase.execute({
        email: "teste@blablabla.com",
        password: "password"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should NOT authenticate an user due to invalid password", () => {
    expect(async () => {

      const user = {
        email: "teste@teste.com",
        password: "password"
      };
  
      await createUserUseCase.execute({ ...user, name: "Bruno Teste" });
  
      await authenticateUserUseCase.execute({
        email: "teste@teste.com",
        password: "123"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should authenticate an user", async () => {
    const user = {
      email: "teste@teste.com",
      password: "password"
    };

    await createUserUseCase.execute({ ...user, name: "Bruno Teste" });

    const authenticated = await authenticateUserUseCase.execute({ ...user });

    expect(authenticated).toHaveProperty("token");
  });

});