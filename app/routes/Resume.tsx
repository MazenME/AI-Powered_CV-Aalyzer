import {Link, useLocation, useNavigate, useParams} from "react-router";
import {usePuterStore} from "~/lib/puter";
import {useEffect, useState} from "react";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta = () => {
    return [
        {title: "HireLens | Review"},
        {name: 'description', content: 'Detailed overview of your resume'},
    ];
};

const Resume = () => {
    const {id} = useParams();
    const {fs, kv, auth, isLoading} = usePuterStore();
    const location = useLocation();
    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback|null>(null);
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            const next = location.pathname + location.search;
            navigate(`/auth?next=${encodeURIComponent(next)}`, {replace: true});
        }
    }, [auth.isAuthenticated, location, navigate, isLoading]);

    useEffect(() => {
        const loadCV = async () => {
            try {
                console.log('[Resume] loading id', id);
                const resume = await kv.get(`resume:${id}`);
                if (!resume) {
                    console.warn('[Resume] No resume data found for id', id);
                    return;
                }
                let data: any = null;
                try {
                    data = JSON.parse(resume);
                } catch (e) {
                    console.error('[Resume] Failed to parse resume data', e);
                    return;
                }

                const resumeBlob = await fs.read(data.resumePath);
                if (!resumeBlob) {
                    console.warn('[Resume] Could not read resume file at', data.resumePath);
                    return;
                }
                const pdfBlob = new Blob([resumeBlob], {type: 'application/pdf'});
                const resumeURL = URL.createObjectURL(pdfBlob);
                setResumeUrl(resumeURL);

                const imageBlob = await fs.read(data.imagePath);
                if (!imageBlob) {
                    console.warn('[Resume] Could not read image file at', data.imagePath);
                    return;
                }
                // imageBlob should already be a Blob; ensure proper object URL
                const imageURL = URL.createObjectURL(imageBlob);
                setImageUrl(imageURL);

                setFeedback(data.feedback);
                console.log('[Resume] Loaded', {resumeURL, imageURL, feedback: data.feedback});
            } catch (err) {
                console.error('[Resume] loadCV error', err);
            }
        };
        loadCV();
    }, [id, fs, kv]);
    return (
        <main className='!pt-0 '>
            <nav className='resume-nav'>
                <Link to='/' className='back-button'>
                    <img src='/icons/back.svg' alt='Back' className='w-2.5 h-2.5'/>
                    <span className='font-semibold text-sm text-gray-800'>Home</span>
                </Link>
            </nav>

            <div className='flex flex-row max-lg:flex-col-reverse w-full'>
                <section
                    className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center px-4 xl:px-8 ">
                    {imageUrl && resumeUrl && (
                        <div
                            className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%]  w-fit'>
                            <a className='cursor-pointer' href={resumeUrl} target='_blank' rel='noopener noreferrer'>
                                <img title='resume' src={imageUrl} alt='Resume'
                                     className='w-full h-full object-contain rounded-2xl shadow-md'/>
                            </a>
                        </div>
                    )}
                </section>
                <section className='feedback-section'>
                    <h2 className='!text-black font-semibold text-4xl '>Resume Review</h2>

                    {feedback ? (
                            <div className='flex flex-col gap-4 animate-in fade-in duration-1000 '>
                                <Summary feedback={feedback}/>
                                <ATS feedback={feedback.ATS}/>
                                <Details feedback={feedback}/>
                            </div>
                        ) :
                        <img className='w-full' src="/images/resume-scan-2.gif" alt="resume scan"/>
                    }
                </section>
            </div>
        </main>
    );
};

export default Resume;
