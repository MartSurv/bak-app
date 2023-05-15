import { Path } from "@/interfaces";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default withPageAuthRequired(function Home() {
  const { push } = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      push(Path.ORDERS);
    } else {
      push(Path.API_AUTH_LOGIN);
    }
  }, [push, user]);

  return null;
});
