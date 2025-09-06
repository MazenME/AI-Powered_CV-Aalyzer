import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";

const Navbar = () => {
    const {auth, isLoading} = usePuterStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate("/auth?mode=login", {replace: true});
    };

    return (
        <nav
            className="navbar max-[350px]:flex max-[350px]:flex-col max-[350px]:items-center max-[350px]:justify-center max-[350px]:gap-y-1">
            <Link to="/">
                <p className="text-2xl font-semibold text-gradient">HireLens</p>
            </Link>

            <div className="flex items-center gap-3">
                <Link to="/upload" className="primary-button w-fit">
                    <p className="sm:text-lg text-[16px] font-semibold ">Upload CV</p>
                </Link>

            </div>
                {!isLoading && (
                    <>
                        {auth.isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="text-red-500 cursor-pointer w-fit"
                            >
                                <p className=" text-[20px] font-semibold text-gradientr">Logout</p>
                            </button>
                        ) : (
                            <Link to="/auth?mode=login" className="secondary-button w-fit">
                                <p className="sm:text-lg text-[16px] font-semibold">Login</p>
                            </Link>
                        )}
                    </>
                )}
        </nav>
    );
};

export default Navbar;
