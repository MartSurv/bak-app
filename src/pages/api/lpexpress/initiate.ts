import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { LpexpressToken } from "@/interfaces/lpexpress";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { data } = await axios.post<LpexpressToken>(
        `${process.env.LPEXPRESS_API_URL}/oauth/token?scope=read+write&grant_type=password&clientSystem=PUBLIC&username=${process.env.LPEXPRESS_USERNAME}&password=${process.env.LPEXPRESS_PASSWORD}`
      );
      const { data: initiateData } = await axios.post(
        `${process.env.LPEXPRESS_API_URL}/api/v1/shipping/initiate`,
        req.body,
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );
      res.status(200).send(initiateData);
    } catch (e) {
      const error = e as AxiosError;
      res.status(error.response?.status ?? 500).send(error.response?.data);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
});
