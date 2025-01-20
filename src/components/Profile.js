import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Container, FormControl, InputLabel, MenuItem, Select} from '@mui/material';
import Materials from "../utils/Materials";
const {useLocation} = require("react-router-dom");

const Profile = () => {
  const {userid} = useParams();
  const location = useLocation();
  const c = location.state?.contact;
  if (!c) {
    console.log('no contact found');
    return null;
  }
  const [profileContact, setProfileContact] = useState(contact);
  const [emailSent, setEmailSent] = useState(null);
  const [material, setMaterial] = useState(null);
  const [contact, setContact] = useState(c);

  useEffect(() => {
  }, [material]);

  const handleSelect = (e) => {
    console.log('selected: ', e.target.value);
    setMaterial(e.target.value);
  }

  function InfoText({ title, text }) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-2">
        {title && (
          <h4 className="text-blue-800 font-medium mb-1">{title}</h4>
        )}
        <p className="text-blue-700">{text}</p>
      </div>
    );
  }

  function getMaterials() {
    const mapped = Materials.map((material) => {
        return (
          <MenuItem key={material} value={material}>
            {material}
          </MenuItem>)
      }
    );
    return mapped;
  }

  return (
    <Container maxWidth="sm" cLassName={'container w-full h-full m-20 p-2'}>
      <Box sx={{p: 4, borderRadius: 2, boxShadow: 3, backgroundColor: 'white', textAlign: 'center'}}>
        <InfoText title={'Contact Information'} text={'test'}/>
        <FormControl fullWidth variant="outlined" style={{marginBottom: '1em'}}>
          <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={material}
            onChange={handleSelect}
            label="Select Option"
          >
            {getMaterials()}
          </Select>
        </FormControl>
      </Box>
    </Container>

  );
  /* <Form>
     <Form.Group controlId="formMaterialSelect">
       <Form.Label>Materials</Form.Label>
       <Form.Select onSelect={handleSelect}>
         ['Stainless Steel', 'Wood', 'Plastic', 'Metal', 'Other'].map(material => {
           <option>{material}</option>
         })
       </Form.Select>

     </Form.Group>

   </Form>
  );*/
}

export default Profile;