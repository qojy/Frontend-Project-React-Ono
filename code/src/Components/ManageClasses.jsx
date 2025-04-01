import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function ManageClasses() {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const storedClasses = JSON.parse(localStorage.getItem('classes')) || [];
        setClasses(storedClasses);
    }, []);

    const handleUpdate = (index) => {
        const newClassID = prompt("הכנס מזהה כיתה חדש:", classes[index]?.classID);
        if (newClassID) {
            const updatedClasses = [...classes];
            updatedClasses[index].classID = newClassID;
            localStorage.setItem('classes', JSON.stringify(updatedClasses));
            setClasses(updatedClasses);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>ניהול כיתות</Typography>
            {classes.length === 0 ? (
                <Typography variant="h6">אין כיתות במערכת</Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>מספר כיתה</TableCell>
                                <TableCell>מזהה כיתה</TableCell>
                                <TableCell>פעולות</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classes.map((cls, index) => (
                                <TableRow key={index}>
                                    <TableCell>{cls.classNumber}</TableCell>
                                    <TableCell>{cls.classID}</TableCell>
                                    <TableCell>
                                        <Button variant="outlined" color="primary" onClick={() => handleUpdate(index)}>
                                            עדכן
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <br />
            <Link to="/classform">
                <Button variant="contained" color="primary">הוספת כיתה חדשה</Button>
            </Link>
        </div>
    );
}
