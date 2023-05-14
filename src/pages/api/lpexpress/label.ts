import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { LpexpressToken } from "@/interfaces/lpexpress";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { data } = await axios.post<LpexpressToken>(
        `${process.env.LPEXPRESS_API_URL}/oauth/token?scope=read+write&grant_type=password&clientSystem=PUBLIC&username=${process.env.LPEXPRESS_USERNAME}&password=${process.env.LPEXPRESS_PASSWORD}`
      );
      const { data: labelData } = await axios.get(
        `${process.env.LPEXPRESS_API_URL}/api/v1/documents/item/sticker/?itemId=${req.query.id}&layout=LAYOUT_10x15`,
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );
      res.status(200).send(labelData);
    } catch (e) {
      const error = e as AxiosError;
      res.status(error.response?.status ?? 500).send(error.response?.data);
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
});
