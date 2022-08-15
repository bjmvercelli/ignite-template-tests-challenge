import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  });

  it("Should NOT get balance due to unexistent user", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "InvalidUserId" as string
      });
    }).rejects.toBeInstanceOf(GetBalanceError);

  });

  it("Should be able to get an user balance", async () => {
    const newUser = await usersRepositoryInMemory.create({
      email: "teste@teste.com",
      name: "Bruno test",
      password: "password"
    });

    await statementsRepositoryInMemory.create({
      user_id: newUser.id as string,
      amount: 150,
      description: "Test",
      type: "deposit" as OperationType
    });

    const balance = await getBalanceUseCase.execute({ user_id: newUser.id as string });

    expect(balance).toHaveProperty("balance");
    expect(balance.balance).toBe(150);

    expect(balance.statement)
    expect(balance.statement).toBeInstanceOf(Array);
    expect(balance.statement.length).toBe(1);
  });
});