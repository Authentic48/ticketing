import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/orders/:orderId', async (req: Request, res: Response) => {
  return res.send('Its working!!!');
});

export { router as showOrderRouter };
