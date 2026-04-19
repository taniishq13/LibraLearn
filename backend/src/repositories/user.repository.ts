import { UserModel, UserDocument } from "../models/User";
import { UserRole } from "../interfaces/auth";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

class UserRepository {
  createUser(data: CreateUserInput): Promise<UserDocument> {
    return UserModel.create(data);
  }

  findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email }).select("+password");
  }

  findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id).select("+password");
  }
}

export const userRepository = new UserRepository();
