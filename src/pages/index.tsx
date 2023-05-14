import { WithPageAuthRequiredProps } from "@/interfaces";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default withPageAuthRequired(function Home(props: WithPageAuthRequiredProps) {
  const { push } = useRouter();

  useEffect(() => {
    push("/orders");
  }, [push]);

  return null;
});
