import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";




export function formatSize(bytes:number):string {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const size = bytes / Math.pow(1024, i);

    return `${parseFloat(size.toFixed(2))} ${units[i]}`;
}

// Types used by PDF conversion
export type PdfConversionResult = {
    imageUrl: string;
    file: File | null;
    error?: string;
};

// Lazy-load pdfjs-dist and configure its worker to use the bundled file in /public
async function loadPdfJs() {
    const mod = await import('pdfjs-dist');
    const ns: any = (mod as any).default ?? mod;

    // Prefer named exports if present (v5 provides getDocument as a named export)
    const getDocument = ns.getDocument ?? (ns.PDFJS ? ns.PDFJS.getDocument : undefined);
    const GlobalWorkerOptions = ns.GlobalWorkerOptions ?? (ns.PDFJS ? ns.PDFJS.GlobalWorkerOptions : undefined);

    if (!getDocument) {
        throw new Error('pdfjs-dist getDocument not found.');
    }

    if (GlobalWorkerOptions) {
        try {
            // Ensure the worker version matches the library version by importing from the same package version
            const workerMod: any = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
            const workerUrl: string = (workerMod as any).default ?? workerMod;
            if (typeof workerUrl === 'string' && workerUrl.length > 0) {
                GlobalWorkerOptions.workerSrc = workerUrl;
            } else {
                // Fallback to public worker path if import fails (may cause version mismatch if outdated)
                GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
            }
        } catch {
            // Fallback to public worker path if the bundler doesn't support ?url imports
            GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        }
    }

    return { getDocument } as { getDocument: (params: any) => any };
}

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
    if (typeof window === "undefined") {
        // SSR - skip execution
        return {
            imageUrl: "",
            file: null,
            error: "PDF conversion must run on the client side",
        };
    }

    if (!(file instanceof File) || !file.type.toLowerCase().includes('pdf')) {
        return {
            imageUrl: '',
            file: null,
            error: 'Provided file is not a PDF',
        };
    }

    try {
        const { getDocument } = await loadPdfJs();

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        if (!context) {
            return { imageUrl: '', file: null, error: 'Failed to get 2D context' };
        }

        context.imageSmoothingEnabled = true;
        // @ts-ignore - quality may not exist in older lib.dom versions
        context.imageSmoothingQuality = "high";

        await page.render({ canvasContext: context, viewport }).promise;

        // Use toBlob when available for smaller memory footprint; fallback to toDataURL
        const blob: Blob | null = await new Promise((resolve) => {
            try {
                canvas.toBlob((b) => resolve(b), 'image/png', 0.92);
            } catch {
                resolve(null);
            }
        });

        if (blob) {
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, { type: 'image/png' });
            return { imageUrl: URL.createObjectURL(blob), file: imageFile };
        }

        // Fallback using data URL
        const dataUrl = canvas.toDataURL('image/png', 0.92);
        const res = await fetch(dataUrl);
        const fallbackBlob = await res.blob();
        const originalName = file.name.replace(/\.pdf$/i, "");
        const imageFile = new File([fallbackBlob], `${originalName}.png`, { type: 'image/png' });
        return { imageUrl: dataUrl, file: imageFile };
    } catch (err) {
        return {
            imageUrl: "",
            file: null,
            error: `Failed to convert PDF: ${err instanceof Error ? err.message : String(err)}`,
        };
    }
}

export const generateUUID = ()=> crypto.randomUUID()

// Tries to parse AI JSON responses that may include extra text or code fences
export function safeParseJSON(raw: string): any {
    if (!raw || typeof raw !== 'string') return null;
    // Trim and remove code fences
    let s = raw.trim();
    s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');

    // Quick direct parse
    try { return JSON.parse(s); } catch {}

    // Attempt to extract the first top-level JSON object or array
    const startIdx = s.search(/[\[{]/);
    if (startIdx !== -1) {
        // Walk to find matching closing bracket
        const opening = s[startIdx];
        const closing = opening === '{' ? '}' : ']';
        let depth = 0;
        let inStr: false | '"' | "'" = false;
        let escape = false;
        for (let i = startIdx; i < s.length; i++) {
            const ch = s[i];
            if (escape) { escape = false; continue; }
            if (inStr) {
                if (ch === '\\') { escape = true; }
                else if (ch === inStr) { inStr = false; }
                continue;
            }
            if (ch === '"' || ch === "'") { inStr = ch as '"' | "'"; continue; }
            if (ch === opening) depth++;
            else if (ch === closing) {
                depth--;
                if (depth === 0) {
                    const candidate = s.slice(startIdx, i + 1);
                    try { return JSON.parse(candidate); } catch {}
                    break;
                }
            }
        }
    }

    // Last resort: remove trailing commas and try again
    const noTrailingCommas = s.replace(/,\s*(\]|\})/g, '$1');
    try { return JSON.parse(noTrailingCommas); } catch {}

    return null;
}


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}