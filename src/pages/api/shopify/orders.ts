import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import axios, { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import queryString from "query-string";

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { data } = await axios.get(
        `${
          process.env.SHOPIFY_API_URL
        }/admin/api/2023-04/orders.json?${queryString.stringify(
          {
            created_at_min: req.query.start,
            created_at_max: req.query.end,
            financial_status: req.query.financialStatus,
          },
          {
            skipEmptyString: true,
            skipNull: true,
          }
        )}`,
        {
          headers: {
            "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
          },
        }
      );
      res.status(200).json(data);
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
