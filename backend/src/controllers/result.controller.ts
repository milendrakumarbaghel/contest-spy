import { ResultService } from '../services/result.service';
import { Request, Response } from 'express';

interface CalculateResultsParams {
    contestId: string;
}

export const calculateResults = async (
    req: Request<CalculateResultsParams>,
    res: Response
): Promise<void> => {
    const { contestId } = req.params;
    const service = new ResultService();

    try {
        const results = await service.processContestResults(contestId);
        res.status(200).json({ results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to calculate results' });
    }
};
