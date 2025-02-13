import { useState } from "react";
import axios from "axios";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";


function Dashboard() {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");


  const handleSubmit = async (e) => {

    if (!question) {
      return;
    }

    try{
      e.preventDefault()
      const response = await axios.post("http://localhost:5000/api/query", {query:question});

      setAnswer(response.data.answer);
    }catch(error){
      console.error("Error fetching response:", error);
      setAnswer("Error retrieving response. Please try again.");
    }
  }



  return (
    <main className="h-screen">
      
      <Card>
     <CardContent>

      <Typography variant="h5" component="h2">
        Ask your question
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Question"
          variant="outlined"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Button type="submit" variant="contained" className="bg-[#1E2938]">
          Submit
        </Button> 
      </form>
     

      {answer && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              Answer
            </Typography>
            <Typography variant="body2" component="p">
              {answer}
            </Typography>
          </CardContent>
        </Card>
      )}
     </CardContent>

      </Card>


    </main>
  )
}

export default Dashboard