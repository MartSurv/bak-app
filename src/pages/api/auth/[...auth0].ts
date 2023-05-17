import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

import { Path } from "@/interfaces";

export default handleAuth({
  async login(request, response) {
    await handleLogin(request, response, {
      returnTo: Path.ORDERS,
    });
  },
});
