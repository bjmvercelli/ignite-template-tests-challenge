import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create an user", async () => {
    const createdUser = await createUserUseCase.execute({
      email: "teste@teste.com",
      name: "Teste Bruno",
      password: "123"
    });

    expect(createdUser).toHaveProperty("id");
  });

  it("Should NOT be able to create an user with existent email", () => {
    expect(async () => {
      const user = {
        email: "teste@teste.com",
        name: "Teste Bruno",
        password: "123"
      };
  
      await createUserUseCase.execute({ ...user });
  
      await createUserUseCase.execute({ ...user });

    }).rejects.toBeInstanceOf(AppError);
  });
});