import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";



let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement operation", () => {

  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
  });

  it("Should NOT get statement operation due to unexistent user", () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        email: "test@teste.com",
        name: "test",
        password: "password"
      });

      const statement = await statementsRepositoryInMemory.create({
        user_id: user.id as string,
        amount: 100,
        description: "test",
        type: "deposit" as OperationType
      });

      await getStatementOperationUseCase.execute({
        user_id: "InvalidUserId",
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should NOT get statement operation due to unexistent statement", () => {
    expect(async () => {
      const user = await usersRepositoryInMemory.create({
        email: "test@teste.com",
        name: "test",
        password: "password"
      });

      const statement = await statementsRepositoryInMemory.create({
        user_id: user.id as string,
        amount: 100,
        description: "test",
        type: "deposit" as OperationType
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "InvalidStatementId"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("Should get a statement operation", async () => {
    const user = await usersRepositoryInMemory.create({
      email: "test@teste.com",
      name: "test",
      password: "password"
    });

    const statement = await statementsRepositoryInMemory.create({
      user_id: user.id as string,
      amount: 100,
      description: "test",
      type: "deposit" as OperationType
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toEqual(expect.objectContaining(statement));
  });

});