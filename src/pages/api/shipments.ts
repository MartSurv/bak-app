import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { NextApiRequest, NextApiResponse } from "next";

import clientPromise from "@/lib/mongodb";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("post_tool");

      const shipments = await db
        .collection("shipments")
        .find({
          createdOn: {
            $gte: req.query.start,
            $lt: dayjs(req.query.end as string)
              .add(1, "day")
              .format("YYYY-MM-DD"),
          },
        })
        .limit(Number(req?.query.pageSize) ?? 10)
        .sort({ _id: -1 })
        .toArray();

      res.status(200).json(shipments);
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
