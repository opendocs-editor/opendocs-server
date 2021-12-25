import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string
};

export default function handler( req: NextApiRequest, res: NextApiResponse<Data> ) {
  if(req.query && req.query.name) {
    res.status(200).json({ name: `Hello, ${req.query.name}.` });
  } else {
    res.status(400).json({ name: "Missing required query parameters: [ name ]" });
  }
};
