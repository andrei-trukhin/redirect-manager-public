import { HttpService } from './http.service';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  role?: UserRole;
}

export class UsersService {
  private static readonly BASE_PATH = '/v1/users';

  /**
   * Get all users
   */
  static async getUsers(): Promise<User[]> {
    return HttpService.get<User[]>(this.BASE_PATH);
  }

  /**
   * Create a new user
   */
  static async createUser(data: CreateUserRequest): Promise<User> {
    return HttpService.post<User>(this.BASE_PATH, data);
  }

  /**
   * Delete a user by ID
   */
  static async deleteUser(id: string): Promise<void> {
    return HttpService.delete<void>(`${this.BASE_PATH}/${id}`);
  }

  /**
   * Change password for the current user
   */
  static async changePassword(password: string, newPassword: string): Promise<void> {
    return HttpService.patch<void>(`${this.BASE_PATH}/password`, {
      password,
      newPassword,
    });
  }

  /**
   * Update user role
   */
  static async updateUserRole(id: string, role: UserRole): Promise<User> {
    return HttpService.patch<User>(`${this.BASE_PATH}/${id}/role`, { role });
  }
}

