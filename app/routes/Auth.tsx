import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate, useNavigation} from "react-router";


export const meta = () => {
    [
        {title: "HireLens | auth"},
        {name: 'description', content: 'Log to your account'},

    ]
}

const Auth = () => {
    const {isLoading, auth} = usePuterStore();

    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const next = searchParams.get("next") || "/";


    useEffect(() => {
        if (auth.isAuthenticated) {
            navigate(next, {replace: true});
        }
    }, [auth.isAuthenticated, next, navigate]);


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white p-10 rounded-2xl">
                    <div className='flex flex-col items-center gap-2 text-center'>
                        <h1>
                            welcome
                        </h1>
                        <h2>
                            log in to continue
                        </h2>
                    </div>
                    {isLoading ? (
                        <button className='auth-button animate-pulse'><p>
                            signing you in...
                        </p></button>
                    ) : (
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}><p>Log out</p></button>
                            ) : (
                                <button className='auth-button' onClick={auth.signIn}><p>Log in</p></button>
                            )}
                        </>)}
                </section>
            </div>
        </main>
    );
};

export default Auth;
