import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "~/utils/utiles";

interface IFileUploadProps {
    onFileUpload?: (file: File | null) => void;
}

const FileUploader = ({ onFileUpload }: IFileUploadProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFile = acceptedFiles[0] || null;
            setFile(newFile);
            onFileUpload?.(newFile);
        },
        [onFileUpload]
    );

    const maxFileSize = 20 * 1024 * 1024;
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: maxFileSize,
    });

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFile(null);
        onFileUpload?.(null);
    };

    return (
        <div className="gradient-border w-full cursor-pointer">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">
                    {file ? (
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center">
                                <img
                                    className="size-20"
                                    src="/images/pdf.png"
                                    alt="pdf uploaded"
                                />
                            </div>
                            <div className="flex items-center justify-center space-x-3 mt-3">
                                <p className="text-lg text-gray-700 font-medium truncate">
                                    {file.name}
                                </p>
                                <p className="text-sm text-gray-500 ">
                                    {formatSize(file.size)}
                                </p>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="p-2 cursor-pointer"
                                >
                                    <img
                                        src="/icons/cross.svg"
                                        alt="remove"
                                        className="w-4 h-4"
                                    />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center ">
                                <img
                                    className="size-20"
                                    src="/icons/info.svg"
                                    alt="upload here"
                                />
                            </div>
                            <div>
                                <p className="text-lg text-gray-500">
                                    <span className="font-semibold">click to upload</span> or drag
                                    and drop
                                </p>
                                <p className="text-lg text-gray-500">
                                    PDF (max {formatSize(maxFileSize)})
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
