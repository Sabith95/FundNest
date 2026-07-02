import api from './api';
import { setAccessToken } from './api';
import type {
  IAddressDto,
  IAddressFormValues,
  IChangePasswordRequest,
  IChangePasswordResponse,
  IUpdateProfileRequest,
  IUpdateProfileResponse,
  IUserProfile,
  IUserProfileApiDto,
} from '../types/profile.types';

interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export const mapAddressFromApi = (address?: IAddressDto): IAddressFormValues => ({
  line1: address?.line1 ?? '',
  line2: address?.line2 ?? '',
  city: address?.city ?? '',
  state: address?.state ?? '',
  pincode: address?.pincode ?? '',
  country: address?.country ?? 'India',
});

export const mapAddressToRequest = (address: IAddressFormValues): IAddressDto => ({
  line1: address.line1.trim(),
  line2: address.line2.trim() || undefined,
  city: address.city.trim(),
  state: address.state.trim(),
  pincode: address.pincode.trim(),
  country: address.country.trim() || 'India',
});

const formatLastUpdated = (value?: string): string => {
  if (!value) return 'Not updated yet';

  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const mapProfileDto = (user: IUserProfileApiDto): IUserProfile => ({
  id: user.id,
  fullName: user.name,
  email: user.email,
  phone: user.phone ?? '',
  address: mapAddressFromApi(user.profile.address),
  role: user.role === 'USER' ? 'Member' : user.role,
  isVerified: user.isEmailVerified,
  avatarUrl: user.profile.avatarUrl,
  lastUpdated: formatLastUpdated(user.updatedAt),
  kycStatus: user.profile.kycStatus,
  authProvider: user.authProvider,
});

class UserProfileService {
  async getProfile(): Promise<IUserProfile> {
    const response = await api.get<IApiResponse<IUserProfileApiDto>>('/users/me');
    return mapProfileDto(response.data.data);
  }

  async updateProfile(data: IUpdateProfileRequest): Promise<IUpdateProfileResponse> {
    const response = await api.patch<IApiResponse<IUpdateProfileResponse>>(
      '/users/me/profile',
      data
    );

    if (response.data.data.tokens?.accessToken) {
      setAccessToken(response.data.data.tokens.accessToken, 'USER');
    }

    return response.data.data;
  }

  async updateProfilePhoto(file: File): Promise<IUserProfile> {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    const response = await api.patch<IApiResponse<IUserProfileApiDto>>(
      '/users/me/photo',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return mapProfileDto(response.data.data);
  }

  async changePassword(data: IChangePasswordRequest): Promise<IChangePasswordResponse> {
    const response = await api.patch<IApiResponse<IChangePasswordResponse>>(
      '/users/me/password',
      data
    );

    return response.data.data;
  }
}

export const userProfileService = new UserProfileService();
