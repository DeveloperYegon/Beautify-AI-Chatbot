import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Card, CardContent, Typography, Chip, Select, InputLabel, FormControl } from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", selectedTopics: [] });
  const [availableTopics, setAvailableTopics] = useState([]);

  useEffect(() => {
    // Fetch user details
    axios.get("http://localhost:5000/api/user/1").then((response) => {
      setUser(response.data);
    });

    // Fetch available topics
    axios.get("http://localhost:5000/api/user/topics").then((response) => {
      setAvailableTopics(response.data);
    });
  }, []);

  const handleTopicChange = (event) => {
    const { value } = event.target;
    setUser({ ...user, selectedTopics: typeof value === 'string' ? value.split(',') : value });
  };

  const handleSave = async () => {
    await axios.put(`http://localhost:5000/api/user/${user._id}/preferences`, { selectedTopics: user.selectedTopics });
    alert("Preferences updated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Card className="p-6 w-full max-w-md shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">Edit Preferences</Typography>

          <FormControl fullWidth className="mt-4">
            <InputLabel>Select Topics</InputLabel>
            <Select
              multiple
              value={user.selectedTopics}
              onChange={handleTopicChange}
              renderValue={(selected) => (
                <div className="flex flex-wrap gap-1">
                  {selected.map((topic) => (
                    <Chip key={topic} label={topic} />
                  ))}
                </div>
              )}
            >
              {availableTopics.map((topic) => (
                <MenuItem key={topic} value={topic}>
                  {topic}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button className="mt-4" variant="contained" color="primary" onClick={handleSave}>
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
