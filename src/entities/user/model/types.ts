export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  countryCode: string;
  phoneVerified: boolean;
  birthDate: string;
  gender: "MALE" | "FEMALE";
  exerciseLevel: "LOW" | "MIDDLE" | "HIGH";
  profileImage: string;
  userType: "TRAINER" | "NORMAL"; // TODO: 실제 타입 확인 필요
  status: "ACTIVE" | "INACTIVE"; // TODO: 실제 타입 확인 필요
  createdAt: string;
  modifiedAt: string;
  lastLoginAt: string;
  lastLoginIp: string;
  loginAttemptCount: number;
  accountLockedUntil: string;
}

export interface BodyMetric {
  id: number;
  measuredDate: string;
  height: number;
  weight: number;
  skeletalMuscleMass: number;
  bodyFatPercentage: number;
}
