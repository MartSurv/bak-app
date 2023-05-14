import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AppProps } from "next/app";
import AppLayout from "@/components/AppLayout/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextNProgress from "nextjs-progressbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();

  return (
    <UserProvider>
      <AppLayout>
        <QueryClientProvider client={queryClient}>
          <NextNProgress />
          <Component {...pageProps} />
        </QueryClientProvider>
      </AppLayout>
    </UserProvider>
  );
}
