import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Person from './components/Person';

export default function CoachDashboard() {
    const [people, setPeople] = useState([]);

    const fetchData = async () => {
        const result = await fetch('http://localhost:8082/api/person/all');
        if (!result.ok) {
            throw new Error('Data coud not be fetched!');
        } else {
            return result.json();
        }
    };

    useEffect(() => {
        fetchData()
            .then((result) => {
                setPeople(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);
    return (
        <div className="peopleList">
            {people.map((person, index) => (
                <Person
                    name={person.name}
                    id={person.id}
                    key={index.toString()}
                />
            ))}
        </div>
    );
}