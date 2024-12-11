import React, {useEffect, useState} from 'react';
import Form from "react-bootstrap/Form";

const Profile = (contact = {}) => {
  if (!contact) return null;

  const [material, setMaterial] = useState(null);
  const [engravingType, setEngravingType] = useState(null);

  useEffect(() => {
  }, [material]);

  const handleSelect = (e) => {
    console.log('selected: ', e.target.value);
    setMaterial(e.target.value);
  }

  return (
    <Form>
      <Form.Group controlId="formMaterialSelect">
        <Form.Label>Materials</Form.Label>
        <Form.Select onSelect={handleSelect}>
          ['Stainless Steel', 'Wood', 'Plastic', 'Metal', 'Other'].map(material => {
            <option>{material}</option>
          })
        </Form.Select>

      </Form.Group>

    </Form>
  );
};

export default Profile;