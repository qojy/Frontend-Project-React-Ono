import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography, Container } from '@mui/material';

export default function ClassForm() {
    const [classNumber, setClassNumber] = useState('');
    const [classID, setClassID] = useState('');
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
        setClasses(storedClasses);
    }, []);

    const handleSave = () => {
        if (!classNumber || !classID) {
            alert("נא למלא את כל השדות");
            return;
        }

        const updatedClasses = [...classes, { classNumber, classID }];
        localStorage.setItem('classes', JSON.stringify(updatedClasses));
        setClasses(updatedClasses);
        setClassNumber('');
        setClassID('');
    };

    return (
        <Container maxWidth="sm" style={{ paddingTop: '20px' }}>
            <Typography variant="h4" gutterBottom>הוספת כיתה</Typography>
            <TextField
                fullWidth
                label="מספר כיתה"
                variant="outlined"
                value={classNumber}
                onChange={(e) => setClassNumber(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            <TextField
                fullWidth
                label="מזהה כיתה"
                variant="outlined"
                value={classID}
                onChange={(e) => setClassID(e.target.value)}
                style={{ marginBottom: '16px' }}
            />
            <Button 
                fullWidth 
                variant="contained" 
                color="primary" 
                onClick={handleSave}
            >
                שמור
            </Button>
            <br />
            <Link to="/manageclasses">
                <Button fullWidth variant="outlined" color="secondary" style={{ marginTop: '16px' }}>
                    מעבר לניהול כיתות
                </Button>
            </Link>
        </Container>
    );
}
