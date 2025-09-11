import { useState } from "react";
import { cn } from "~/utils/utiles";

const Section = ({
    title,
    data,
}: {
    title: string;
    data: { score: number; tips: { type: "good" | "improve"; tip: string; explanation: string; example?: { bad: string; better: string } }[] };
}) => {
    const [expanded, setExpanded] = useState(true);

    const pct = typeof data.score === 'number' ? Math.max(0, Math.min(100, data.score)) : 0;
    const color = pct >= 80 ? 'text-emerald-600' : pct >= 60 ? 'text-amber-600' : 'text-rose-600';
    const barColor = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <div
            className={cn(
                "rounded-2xl shadow-md w-full bg-gradient-to-b to-light-white",
                data.score > 79 ? "from-green-200" : data.score > 49 ? "from-orange-200" : "from-rose-200"
            )}
        >
            <button
                type="button"
                className="flex items-center w-full gap-3 text-left p-4 sm:p-6 md:p-8"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
            >
                <p className="text-xl sm:text-2xl font-semibold flex-1">
                    {title} - <span className={cn("font-bold", color)}>{pct}</span>/100
                </p>
                <img
                    src="/icons/down-arrow-5-svgrepo-com.svg"
                    alt="Toggle details"
                    className={cn(
                        "w-7 h-7 transition-transform duration-200 cursor-pointer",
                        expanded ? "rotate-180" : "rotate-0"
                    )}
                />
            </button>
            {expanded && (
                <div className="flex flex-col gap-3 p-4 pt-0 sm:px-6 md:px-8 pb-6">
                    {data.tips.map((tip, index) => (
                        <div className="flex flex-col gap-2 p-3 rounded-xl border border-gray-100 bg-white" key={index}>
                            <div className="flex items-center gap-2">
                                <img
                                    src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                                    alt={tip.type}
                                    className="w-4 h-4"
                                />
                                <span className="text-base font-medium text-gray-800">{tip.tip}</span>
                                <span
                                    className={cn(
                                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                                        tip.type === "good"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-amber-100 text-amber-700"
                                    )}
                                >
                                    {tip.type === "good" ? "Good" : "Improve"}
                                </span>
                            </div>
                            {tip.explanation && (
                                <p className="text-sm text-gray-600 leading-relaxed">{tip.explanation}</p>
                            )}
                            {tip.type === "improve" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-100">
                                        <p className="text-xs font-semibold text-rose-700 mb-1">Bad</p>
                                        <pre className="text-xs text-rose-800 whitespace-pre-wrap">{tip.example?.bad ?? "(example missing)"}</pre>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                                        <p className="text-xs font-semibold text-emerald-700 mb-1">Better</p>
                                        <pre className="text-xs text-emerald-800 whitespace-pre-wrap">{tip.example?.better ?? "(example missing)"}</pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="flex flex-col gap-4">
            <Section title="Tone & Style" data={feedback.toneAndStyle} />
            <Section title="Content" data={feedback.content} />
            <Section title="Structure" data={feedback.structure} />
            <Section title="Skills" data={feedback.skills} />
            {feedback.relevance && (
                <Section title="JD Relevance" data={feedback.relevance as any} />
            )}
        </div>
    );
};

export default Details;
