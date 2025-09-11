import ScoreHalfCircle from "~/components/ScoreHalfCircle";

type CategoryKey = keyof Pick<Feedback, "ATS" | "toneAndStyle" | "content" | "structure" | "skills" | "relevance">;

const CategoryItem = ({ title, score }: { title: string; score: number | undefined }) => {
    const pct = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : 0;
    const color = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600';
    const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
    return (
        <div className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{title}</span>
                <span className={`text-sm font-semibold ${color}`}>{pct}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`${barColor} h-2`} style={{ width: `${pct}%` }} />
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const categories: { key: CategoryKey; title: string; score?: number }[] = [
        { key: 'ATS', title: 'ATS Compatibility', score: feedback?.ATS?.score },
        { key: 'toneAndStyle', title: 'Tone & Style', score: feedback?.toneAndStyle?.score },
        { key: 'content', title: 'Content Quality', score: feedback?.content?.score },
        { key: 'structure', title: 'Structure & Format', score: feedback?.structure?.score },
        { key: 'skills', title: 'Skills Match', score: feedback?.skills?.score },
        { key: 'relevance', title: 'JD Relevance', score: feedback?.relevance?.score },
    ];

    return (
        <div className='bg-white rounded-2xl shadow-md w-full'>
            <div className='flex flex-row max-sm:flex-col items-center gap-4 p-4'>
                <ScoreHalfCircle score={feedback?.overallScore} />
                <div className='flex flex-col gap-1'>
                    <h2 className='text-xl font-semibold '>Your Resume Score</h2>
                    <p className='text-sm text-gray-500'>
                        This score calculated based on variables listed below.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-4 pt-0">
                {categories.map((c) => (
                    <CategoryItem key={c.key} title={c.title} score={c.score} />
                ))}
            </div>
        </div>
    );
};

export default Summary;
