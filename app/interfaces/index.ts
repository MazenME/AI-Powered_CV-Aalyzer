interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}

interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number,
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
            example?: { bad: string; better: string };
        }[];
    },
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
            example?: { bad: string; better: string };
        }[];
    },
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
            example?: { bad: string; better: string };
        }[];
    },
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
            example?: { bad: string; better: string };
        }[];
    },
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
            example?: { bad: string; better: string };
        }[];
    },
    relevance: { // match with JD
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
            example?: { bad: string; better: string; };
        }[];
    };
}