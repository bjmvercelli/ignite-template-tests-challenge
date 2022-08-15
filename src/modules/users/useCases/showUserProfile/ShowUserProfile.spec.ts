import { config } from "dotenv";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";

config();

import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should NOT show user profile due to unexistent user", () => {
    expect(async () => {
      await showUserProfileUseCase.execute("idNãoExistente");

    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  it("Should show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Teste",
      email: "teste@teste.com",
      password: "123"
    });

    const userProfile = await showUserProfileUseCase.execute(`${user.id}`);

    expect(userProfile).toHaveProperty("id");
  });

});