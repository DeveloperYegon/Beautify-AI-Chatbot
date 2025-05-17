// src/Pages/Pdf.jsx
import { useState } from 'react'
import axios from "axios";


function Pdf() {
    const [pdf, setPdf] = useState(null);
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handlePdfChange = (e) => setPdf(e.target.files[0]);
   
    const apiUrl = import.meta.env.VITE_API_KEY;


   

    /**  Handle PDF upload submission **/
    const handlePdfSubmit = async (e) => {
        e.preventDefault();
        if (!pdf) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("pdf", pdf);

        try {
            await axios.post(`${apiUrl}:5001/api/documents/upload-pdf`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert(" PDF indexed successfully!");
        } catch (error) {
            // console.error(" Error uploading PDF:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-full md:w-1/2 p-8">
            <h3 className='text-center py-5 text-[#F13934] text-2xl font-bold'>PDF Indexing</h3>
            <hr className='w-[80%] m-auto h-1 bg-black' />

           

            {/* PDF Upload Form */}
            <form noValidate onSubmit={handlePdfSubmit} className="flex mt-5 flex-col border-2 rounded-lg p-3 justify-center">
                <label className="font-bold py-3" htmlFor="web">Upload PDF:</label>
                <input
                    type="file"
                    className="bg-white p-4 rounded-2xl border-2 text-black"
                    onChange={handlePdfChange}
                />
                <input
                    type="submit"
                    className="bg-[#F0BA30] my-3 m-auto w-1/2 text-black font-bold px-4 py-2 rounded-lg cursor-pointer"
                    value={loading ? "Uploading..." : "Index"}
                    disabled={loading}
                />
            </form>
        </main>
    );
}

export default Pdf;
