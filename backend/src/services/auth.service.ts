import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { AppError } from "../utils/AppError";
import {
  SafeUser,
  UserRole
} from "../interfaces/auth";
import { userRepository } from "../repositories/user.repository";
import { UserDocument } from "../models/User";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

type LoginInput = {
  email: string;
  password: string;
};

class AuthService {
  async register(input: RegisterInput): Promise<{ user: SafeUser; token: string }> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const role = input.role ?? "student";

    const user = await userRepository.createUser({
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role
    });

    return {
      user: this.toSafeUser(user),
      token: this.createToken(user)
    };
  }

  async login(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    return {
      user: this.toSafeUser(user),
      token: this.createToken(user)
    };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return this.toSafeUser(user);
  }

  private toSafeUser(user: UserDocument): SafeUser {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  private createToken(user: UserDocument): string {
    return jwt.sign(
      { userId: user._id.toString(), role: user.role },
      config.jwtSecret,
      { expiresIn: "7d" }
    );
  }
}

export const authService = new AuthService();
