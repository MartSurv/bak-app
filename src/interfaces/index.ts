import { UserProfile } from "@auth0/nextjs-auth0/client";

export interface WithPageAuthRequiredProps {
  user: UserProfile;
}

export enum Path {
  ORDERS = "/orders",
  SHIPMENTS = "/shipments",
}
