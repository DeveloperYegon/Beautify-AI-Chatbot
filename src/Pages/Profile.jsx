import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, MenuItem, Card, CardContent, Typography } from "@mui/material";

const skinTypes = ["Oily", "Dry", "Combination", "Sensitive", "Normal"];
const concerns = ["Acne", "Hyperpigmentation", "Razor Bumps", "Aging", "Dull Skin"];

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", skinType: "", concerns: [] });

  useEffect(() => {
    axios.get("http://localhost:5000/api/user/1").then((response) => {
      setUser(response.data);
    });
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.put("http://localhost:5000/api/user/1", user);
    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Card className="p-6 w-full max-w-md shadow-lg">
        <CardContent>
          <Typography variant="h5" className="mb-4">Edit Profile</Typography>
          <TextField fullWidth label="Name" name="name" variant="outlined" value={user.name} onChange={handleChange} />
          <TextField fullWidth label="Email" name="email" variant="outlined" value={user.email} className="mt-4" onChange={handleChange} />
          <TextField select fullWidth label="Skin Type" name="skinType" variant="outlined" value={user.skinType} className="mt-4" onChange={handleChange}>
            {skinTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField select fullWidth label="Skin Concern" name="concerns" variant="outlined" value={user.concerns} className="mt-4" onChange={handleChange}>
            {concerns.map((concern) => (
              <MenuItem key={concern} value={concern}>{concern}</MenuItem>
            ))}
          </TextField>
          <Button className="mt-4" variant="contained" color="primary" onClick={handleSave}>
            Save Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
