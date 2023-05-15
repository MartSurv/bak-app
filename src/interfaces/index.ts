import { UserProfile } from "@auth0/nextjs-auth0/client";
import { NotificationInstance } from "antd/es/notification/interface";

export interface WithPageAuthRequiredProps {
  user: UserProfile;
}

export enum Path {
  API_AUTH_LOGIN = "/api/auth/login",
  API_AUTH_LOGOUT = "/api/auth/logout",
  ORDERS = "/orders",
  SHIPMENTS = "/shipments",
}

export enum QueryKeys {
  ORDERS = "orders",
  SHIPMENTS = "shipments",
  STICKER = "sticker",
}

export interface PageProps {
  notificationApi: NotificationInstance;
}
