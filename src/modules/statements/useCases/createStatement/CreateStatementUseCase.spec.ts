import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should NOT create a statement due to unexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "InvalidUserId",
        amount: 100,
        description: "Test description",
        type: "withdraw" as OperationType
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  
  it("Should NOT be able to create a statement due to insufficient funds", () => {
    expect(async () => {
      const newUser = await usersRepositoryInMemory.create({
        name: "Test",
        email: "teste123@teste.com",
        password: "123"
      });

      await createStatementUseCase.execute({
        user_id: newUser.id as string,
        amount: 1000,
        description: "testee",
        type: "withdraw" as OperationType
      });

    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("Should create a statement", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "Test",
      email: "teste@teste.com",
      password: "123"
    });

    const statementObject = {
      user_id: createdUser.id as string,
      amount: 100,
      description: "Teste",
      type: "deposit" as OperationType
    };

    const createdStatement = await createStatementUseCase.execute({ ...statementObject });

    expect(createdStatement).toHaveProperty("id");
    expect(createdStatement).toEqual(expect.objectContaining({ ...statementObject }));
  });

});