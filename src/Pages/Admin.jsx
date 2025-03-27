import { useState } from 'react'
import axios from "axios";


function Admin() {
    const [url, setUrl] = useState('');
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleUrlChange = (e) => setUrl(e.target.value);
    const handlePdfChange = (e) => setPdf(e.target.files[0]);
   


    /** ✅ Handle URL indexing submission **/
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        setLoading(true);
        try {
            await axios.post("http://localhost:5001/load-url", { url });
            alert("✅ Website URL indexed successfully!");
        } catch (error) {
            console.error("🔥 Error indexing URL:", error);
        } finally {
            setLoading(false);
        }
    };

    /**  Handle PDF upload submission **/
    const handlePdfSubmit = async (e) => {
        e.preventDefault();
        if (!pdf) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("pdf", pdf);

        try {
            await axios.post("http://localhost:5001/upload-pdf", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(" PDF indexed successfully!");
        } catch (error) {
            console.error(" Error uploading PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-full p-8">
            <h3 className="text-center text-4xl font-bold m-5">Resource Indexing</h3>

            {/* URL Indexing Form */}
            <form noValidate onSubmit={handleUrlSubmit} className="flex flex-col border-2 rounded-lg p-3 justify-center">
            {loading && <p className="text-center text-red-500">Processing...</p>}

                <label className="font-bold py-3" htmlFor="web">Website URL:</label>
                <input
                    type="text"
                    className="bg-white p-4 rounded-2xl border-2 text-black"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Enter website URL"
                />
                <input
                    type="submit"
                    className="bg-[#000] font-bold my-3 m-auto w-1/2 text-white px-4 py-2 rounded-lg cursor-pointer"
                    value={loading ? "Indexing..." : "Index"}
                    disabled={loading}
                />
            </form>

            <p className="text-center font-bold text-4xl m-10">or</p>

            {/* PDF Upload Form */}
            <form noValidate onSubmit={handlePdfSubmit} className="flex flex-col border-2 rounded-lg p-3 justify-center">
                <label className="font-bold py-3" htmlFor="web">Upload PDF:</label>
                <input
                    type="file"
                    className="bg-white p-4 rounded-2xl border-2 text-black"
                    onChange={handlePdfChange}
                />
                <input
                    type="submit"
                    className="bg-[#000] my-3 m-auto w-1/2 text-white px-4 py-2 rounded-lg cursor-pointer"
                    value={loading ? "Uploading..." : "Index"}
                    disabled={loading}
                />
            </form>
        </main>
    );
}

export default Admin;
