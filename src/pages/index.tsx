import { Path } from "@/interfaces";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default withPageAuthRequired(function Home() {
  const { push } = useRouter();

  useEffect(() => {
    push(Path.ORDERS);
  }, [push]);

  return null;
});
