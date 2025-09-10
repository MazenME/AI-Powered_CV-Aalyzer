import Navbar from "~/components/Navbar";
import { type FormEvent, useState } from "react";
import FileUploader from "~/routes/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {convertPdfToImage, generateUUID, safeParseJSON} from "~/utils/utiles";
import {prepareInstructions} from "~/data";
import {useNavigate} from "react-router";

const Upload = () => {
    const navigate = useNavigate();
    const {fs,ai,kv,error: storeError, clearError} = usePuterStore()
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);
            setStatusText("Uploading resume...");

            const uploadFile = await fs.upload([file]);
            if (!uploadFile) throw new Error("Failed to upload file.");

            setStatusText("Converting PDF to Image...");
            const imageFile = await convertPdfToImage(file);
            if (!imageFile || imageFile.error || !imageFile.file) {
                setStatusText(imageFile?.error ?? "Failed to convert PDF to Image.");
                setIsProcessing(false);
                return;
            }

            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) throw new Error("Failed to upload image.");

            setStatusText("Preparing data...");
            const uuid = generateUUID();
            const data = {
                id: uuid,
                companyName,
                jobTitle,
                jobDescription,
                resumePath: uploadFile.path,
                imagePath: uploadedImage.path,
                feedback: "",
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analyzing resume...");
            const feedback = await ai.feedback(
                uploadedImage.path,
                prepareInstructions({ jobTitle, jobDescription })
            );

            if (!feedback) throw new Error("AI feedback failed.");

            const rawContent =
                typeof feedback?.message.content === "string"
                    ? feedback.message.content
                    : feedback?.message.content?.[0]?.text;

            if (!rawContent) throw new Error("Empty feedback response.");

            let parsedFeedback = safeParseJSON(rawContent);
            if (!parsedFeedback) {
                console.error("JSON Parse Error: Could not parse AI feedback", rawContent);
                throw new Error("Failed to parse feedback JSON.");
            }

            data.feedback = parsedFeedback;
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setStatusText("Analysis completed successfully, Redirecting...");
            navigate(`/resume/${uuid}`);
        } catch (error: any) {
            console.error(error);
            setStatusText(`Error: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest("form");
        if (!form) return;

        if (!file) {
            setError("You must upload a resume before submitting.");
            return;
        }

        setError("");

        const formData = new FormData(form);
        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;
        handleAnalyze({companyName, jobTitle, jobDescription, file})

    };

    const handleFileUpload = (file: File | null) => {
        setFile(file);
        if (file) setError("");
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />
            <section className="main-section px-3">
                <div className="page-heading pb-5">
                    <h1>smart feedback for your dream job</h1>
                    {(isProcessing || statusText || storeError) ? (
                        <>
                            {storeError && (
                                <p className="text-red-600 text-sm mb-2">{storeError}</p>
                            )}
                            <h2>{statusText || (isProcessing ? "Processing..." : "")}</h2>
                            {isProcessing && (
                                <img src="/images/resume-scan.gif" alt={statusText || 'processing'} />
                            )}
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}

                    {!(isProcessing) && !statusText && !storeError && (
                        <form
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 items-center justify-center mt-8"
                        >
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input
                                    required
                                    name="job-title"
                                    id="job-title"
                                    type="text"
                                    placeholder="Job Title"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input
                                    name="company-name"
                                    id="company-name"
                                    type="text"
                                    placeholder="company name"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea
                                    name="job-description"
                                    id="job-description"
                                    rows={3}
                                    placeholder="Job Description"
                                />
                            </div>
                            <div className="form-div">
                                <label htmlFor="upload-resume">Upload Resume</label>
                                <FileUploader onFileUpload={handleFileUpload} />
                                {error && (
                                    <p className="text-red-500 text-sm mt-2">{error}</p>
                                )}
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;
