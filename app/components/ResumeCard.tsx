import {Link} from "react-router";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard = ({resume: {id, companyName, imagePath, jobTitle, feedback}}: { resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className="resume-card max-[376px]:w-[340px] animate-in fade-in duration-1000">
           <div className='flex items-center justify-between min-h-[110px]'>
               <div className="flex flex-col gap-2">
                   <h2 className='text-black font-semibold break-words'>
                       {companyName}
                   </h2>
                   <h3 className="text-lg break-words text-gray-500">
                       {jobTitle}
                   </h3>

               </div>
               <div className='flex-shrink-0'>
                   <ScoreCircle score={feedback.overallScore}/>
               </div>
           </div>
            <div className='gradient-border animate-in fade-in duration-1000'>
                <div className='w-full hfull '>
                    <img src={imagePath} className='w-full h-[350px] object-cover object-top' alt={`resume of ${jobTitle}`} />
                </div>
            </div>
        </Link>
    );
};

export default ResumeCard;
