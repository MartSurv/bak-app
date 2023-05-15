import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AppProps } from "next/app";
import AppLayout from "@/components/AppLayout/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextNProgress from "nextjs-progressbar";
import "antd/dist/reset.css";
import { notification } from "antd";

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
