import { MongoClient } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  message: string;
};

export default async function ProductCategory(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "PUT") {
    const data = req.body;

   const client = await MongoClient.connect(process.env.DB_CONNECTION_STRING!);

    const db = client.db();
    const cartClt = db.collection("cart");
    await cartClt.updateOne(
      {},
      {
        $set: {
          items: data.items,
          totalQuantity: data.totalQuantity,
          totalAmount: data.totalAmount,
        },
      },
      {
        upsert: true,
      }
    );

    client.close();

    res.status(201).json({ message: "Send cart to database successfully" });
  }
}
