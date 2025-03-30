import { useState } from 'react'
import axios from "axios";


function Admin() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleUrlChange = (e) => setUrl(e.target.value);
   


    /** Handle URL indexing submission **/
    const handleUrlSubmit = async (e) => {
        e.preventDefault();
        if (!url.trim()) return;

        setLoading(true);
        try {
            await axios.post("http://localhost:5001/load-url", { url });
            alert(" Website URL indexed successfully!");
        } catch (error) {
            console.error(" Error indexing URL:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <main className="h-full md:w-1/2 p-8">
            <h3 className='text-center py-5 text-[#F13934] text-2xl font-bold'>URL Indexing</h3>
            <hr className='w-[80%] m-auto h-1 bg-black' />

            {/* URL Indexing Form */}
            <form noValidate onSubmit={handleUrlSubmit} className="flex  mt-5 flex-col border-2 rounded-lg p-3 justify-center">
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
                    className="bg-[#F0BA30] my-3 m-auto w-1/2 text-black font-bold px-4 py-2 rounded-lg cursor-pointer"
                    value={loading ? "Indexing..." : "Index"}
                    disabled={loading}
                />
            </form>

            

         
        </main>
    );
}

export default Admin;
