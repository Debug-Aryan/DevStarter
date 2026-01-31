import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        message: 'Server is healthy',
        timestamp: new Date()
    });
});

export default router;
