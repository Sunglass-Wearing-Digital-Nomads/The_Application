import React, { useState } from 'react';

export default function NewPerson(props) {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [role, setRole] = useState(1);

    const roles = ['NONE', 'TRAINEE', 'COACH', 'MANAGER', 'HR'];

    function sendPersonData() {
        if (!emailExists(email)) {
            const newUser = JSON.stringify({
                email: email,
                password: 'password',
                roles: 'ROLE_' + roles[role],
                person: {
                    name: name,
                    address: address,
                    city: city,
                },
            });
            setEmail('');
            setName('');
            setAddress('');
            setCity('');
            setRole(1);

            fetch(`${props.url}/api/user/new/${role}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        'Basic ' + btoa(props.email + ':' + props.password),
                },
                body: newUser,
            }).then(() => props.update());
        } else {
            alert('A user with this email account already exists!');
            props.update();
        }
    }

    function emailExists(email) {
        const people = props.people;
        for (let index = 0; index < people.length; index++) {
            const person = people[index];
            if (email === person.user.email) {
                return true;
            }
        }
        return false;
    }

    return (
        <form
            className="newperson bordered"
            onSubmit={(e) => {
                sendPersonData();
                e.preventDefault();
            }}
        >
            <h2>Create new person</h2>
            <label htmlFor="email">E-mail </label>
            <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <label htmlFor="name">Name </label>
            <input
                type="text"
                name="name"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <br />
            <label htmlFor="address">Address </label>
            <input
                type="text"
                name="address"
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <br />
            <label htmlFor="city">City </label>
            <input
                type="text"
                name="city"
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <br />
            <label htmlFor="role">Role </label>
            <select
                name="role"
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
                <option value={1}>Trainee</option>
                <option value={2}>Coach</option>
                <option value={3}>Manager</option>
                <option value={4}>HR</option>
            </select>
            <br />
            <br />
            <input
                type="submit"
                value="Create Person"
            />
        </form>
    );
}
