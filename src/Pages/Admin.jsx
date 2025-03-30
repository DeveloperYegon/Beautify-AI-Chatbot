import React,{useEffect,useState} from 'react'
import Url from './Url'
import Pdf from './Pdf'
import axios from 'axios';
import { useSelector } from 'react-redux';

function Admin() {
    const [users, setUsers] = useState([]);
    const [indexedDocs, setIndexedDocs] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingDocs, setLoadingDocs] = useState(true);

    // Get authToken from Redux global state
    const authToken = useSelector((state) => state.auth.token);

    console.log("authToken:", authToken);


 // Fetch users (Protected Route)
    useEffect(() => {
        // Stop execution if no authToken
        if (!authToken) return; 

        async function fetchUsers() {
            try {
                const response = await axios.get("http://localhost:5001/api/users",  {
                    headers: {
                        Authorization: `Bearer ${authToken}`, 
                        "Content-Type": "application/json"
                    }
            });
                setUsers(response.data);
                console.log("Users:", response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoadingUsers(false);
            }
        }

        fetchUsers();
    }, [authToken]); // Re-run when authToken changes


 // Fetch indexed documents (Protected Route)
 useEffect(() => {
    if (!authToken) return; // Stop execution if no authToken

    async function fetchIndexedDocuments() {
        try {
            const response = await axios.get("http://127.0.0.1:5001/fetch-all" );
            setIndexedDocs(response.data.indexedDocs || []);
            console.log("Indexed documents:", response.data);
        } catch (error) {
            console.error("Error fetching indexed documents:", error);
        } finally {
            setLoadingDocs(false);
        }
    }

    fetchIndexedDocuments();
}, [authToken]); // Re-run when authToken changes

    
  return (
    <main className=' w-full h-full overflow-y-auto'>
    <div className="flex border rounded m-3 justify-center md:flex-row flex-col">
        <Url />
        <Pdf />
    </div>

    {/* Users Section */}
    <div className="flex flex-col border rounded m-3  justify-center items-center">

        <h1 className="text-2xl font-bold my-3">Users</h1>
        <hr className='w-[80%] m-auto h-1 bg-black' />


        {loadingUsers ? (
  <p>Loading users...</p>
) : users.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="table-auto m-5 rounded-lg border-collapse border border-gray-300 w-full shadow-lg">
      {/* Table Head */}
      <thead className="border border-gray-300 bg-[#F0BA30] text-black font-bold text-lg">
        <tr>
          <th className="px-4 py-2 border border-gray-300">Name</th>
          <th className="px-4 py-2 border border-gray-300">Email</th>
          <th className="px-4 py-2 border border-gray-300">Role</th>
          <th className="px-4 py-2 border border-gray-300">Premium</th>
          <th className="px-4 py-2 border border-gray-300">Joined On</th>
          <th className="px-4 py-2 border border-gray-300">Updated On</th>
        </tr>
      </thead>

      {/* Table Body */}
      <tbody key={users.id}>
        {users.map((user) => (
          <tr key={user.id} className="border border-gray-300 hover:bg-gray-100">
            <td className="px-4 py-2 border border-gray-300">{user.name}</td>
            <td className="px-4 py-2 border border-gray-300">{user.email}</td>
            <td className="px-4 py-2 border border-gray-300">{user.role}</td>
            <td className="px-4 py-2 border border-gray-300">
              {user.isPremium ? "✅ Yes" : "❌ No"}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td className="px-4 py-2 border border-gray-300">
              {new Date(user.updatedAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p>No users found.</p>
)}

    </div>

    {/* Indexed Documents Section */}
    <div className="flex mb-20 py-3 border rounded m-3 flex-col justify-center items-center mt-5">
        <h1 className="text-2xl font-bold">Indexed Documents</h1>
        <hr className='w-[80%] m-auto h-1 bg-black' />

       {loadingDocs ? (
    <p>Loading documents...</p>
) : indexedDocs && indexedDocs.length > 0 ? (
    <table>
      <thead>
        <th>
          file name
        </th>
        <th>
          total pages
        </th>
      </thead>
      <tbody>

        {indexedDocs.map((doc) => {
            // Ensure metadata and source exist
            const fileName = doc.metadata?.source?.split("/").pop() || "Unknown File";
            const totalPages = doc.metadata?.pdf?.totalPages || "N/A";
            return (
              <tr>
               <td>{fileName} </td>
              <td>{totalPages}</td>
              </tr>
                );
              
        })}
      </tbody>
        </table>

) : (
    <p>No indexed documents found.</p>
)}



    </div>
</main>
  )
}

export default Admin