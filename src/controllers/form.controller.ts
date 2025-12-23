import { Request, Response } from 'express';

// Mock database for form submissions
const submissions: any[] = [];

export const submitForm = async (req: Request, res: Response) => {
    try {
        const { formId, data } = req.body;
        const newSubmission = {
            id: Date.now().toString(),
            formId,
            data,
            submittedAt: new Date()
        };
        submissions.push(newSubmission);

        console.log('New Lead Received:', newSubmission);

        res.status(201).json({
            message: 'Submission successful',
            submissionId: newSubmission.id
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting form', error });
    }
};

export const getSubmissions = async (req: Request, res: Response) => {
    try {
        // In a real app, filter by tenantId
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
};
