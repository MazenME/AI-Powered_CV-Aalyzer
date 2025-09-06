import type {Route} from "./+types/home";
import Navbar from "~/components/Navbar";
import {resumes} from "~/data";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate, useNavigation} from "react-router";


export function meta({}: Route.MetaArgs) {
    return [
        {title: "HireLens"},
        {
            name: "description",
            content: "HireLens helps you instantly analyze your CV and get smart, personalized feedback to improve your chances of landing a job."
        },
    ];
}

export default function Home() {
    const {auth} = usePuterStore()
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (!auth.isAuthenticated) {
            const next = location.pathname + location.search;
            navigate(`/auth?next=${encodeURIComponent(next)}`, {replace: true});
        }
    }, [auth.isAuthenticated, location, navigate]);
    return <main className="bg-[url('/images/bg-main.svg')] bg-cover">

        <Navbar/>
        <section className="main-section">
            <div className="page-heading">
                <h1>
                    Track Your Applications & Resume Ratings
                </h1>
                <h2 className='mx-10'>
                    Review your submissions and check AI-Powered feedback.
                </h2>
            </div>
            {resumes.length > 0 && (
                <div className="resumes-section">
                    {
                        resumes.map((resume) => (
                            <ResumeCard key={resume.id} resume={resume}/>
                        ))
                    }
                </div>

            )}
        </section>
    </main>;
}
