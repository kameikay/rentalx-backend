import { inject, injectable } from "tsyringe";
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

import { IUsersRepository } from "../../repositories/IUserRepository";
import { AppError } from "../../../../errors/AppError";

interface IRequest {
  email: string;
  password: string
}

interface IResponse {
  user: {
    name: string,
    email: string
  };
  token: string
}
@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new AppError("E-mail or passaword incorrect!", 401)

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) throw new AppError("E-mail or passaword incorrect!", 401)

    const token = sign({}, "7083a6846675a573c235ad24c3b6d7ca", {
      subject: user.id,
      expiresIn: "1d"
    })

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email
      }
    }

    return tokenReturn

  }
}

export { AuthenticateUserUseCase }