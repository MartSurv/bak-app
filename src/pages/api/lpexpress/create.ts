import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { LpexpressToken } from "@/interfaces/lpexpress";
import clientPromise from "@/lib/mongodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { data } = await axios.post<LpexpressToken>(
        `${process.env.LPEXPRESS_API_URL}/oauth/token?scope=read+write&grant_type=password&clientSystem=PUBLIC&username=${process.env.LPEXPRESS_USERNAME}&password=${process.env.LPEXPRESS_PASSWORD}`
      );
      const { data: createShipmentRes } = await axios.post(
        `${process.env.LPEXPRESS_API_URL}/api/v1/shipping`,
        req.body,
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );
      const client = await clientPromise;
      const db = client.db("post_tool");
      await db.collection("shipments").insertOne(createShipmentRes);

      res.status(200).send(createShipmentRes);
    } catch (e) {
      const error = e as AxiosError;
      res
        .status(error.response?.status ?? 500)
        .json({ error: error.response?.data });
    }
  } else {
    res.status(405).send("Method Not Allowed");
  }
});
