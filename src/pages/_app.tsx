import { UserProvider } from "@auth0/nextjs-auth0/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { notification } from "antd";
import { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import "antd/dist/reset.css";
import "./app.css";

import AppLayout from "@/components/AppLayout/AppLayout";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  const [api, contextHolder] = notification.useNotification();

  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <AppLayout>
          {contextHolder}
          <NextNProgress />
          <Component notificationApi={api} {...pageProps} />
        </AppLayout>
      </QueryClientProvider>
    </UserProvider>
  );
}
