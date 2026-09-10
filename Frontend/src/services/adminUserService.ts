import { API_ROUTES } from "../shared/apiRoutes";
import api from "./api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface UserListResponse {
  users: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

export const adminUserService = {
  async getUsers(
    page: number,
    limit: number,
    search?: string,
  ): Promise<UserListResponse> {
    const response = await api.get(API_ROUTES.SUPER_ADMIN.GET_USERS, {
      params: { page, limit, search: search || undefined },
    });
    return response.data.data;
  },

  async getUser(id: string): Promise<AdminUser> {
    const response = await api.get(API_ROUTES.SUPER_ADMIN.GET_USER(id));
    return response.data.data.user;
  },

  async updateStatus(id: string, isActive: boolean): Promise<AdminUser> {
    const response = await api.patch(API_ROUTES.SUPER_ADMIN.UPDATE_STATUS(id), {
      isActive,
    });
    return response.data.data.user;
  },
};
