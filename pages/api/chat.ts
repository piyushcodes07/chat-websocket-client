import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.IO";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  return res.json({'hello':'world'})

}
