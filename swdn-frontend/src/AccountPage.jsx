import React, { useState, useEffect } from 'react';
import EmailChanger from './components/EmailChanger';
import PasswordChanger from './components/PasswordChanger';

export default function AccountPage(props) {
    const [edit, setEdit] = useState(false);
    const [person, setPerson] = useState(props.person);
    const [name, setName] = useState(props.person.name);
    const [address, setAddress] = useState(props.person.address);
    const [city, setCity] = useState(props.person.city);
    const [emailChange, setEmailChange] = useState(false);
    const [passwordChange, setPasswordChange] = useState(false);

    const fetchData = async () => {
        const result = await fetch(
            `${props.url}/api/person/${props.person.id}`,
            {
                headers: {
                    Authorization:
                        'Basic ' + btoa(props.email + ':' + props.password),
                },
            }
        );
        if (!result.ok) {
            throw new Error('Data coud not be fetched!');
        } else {
            return result.json();
        }
    };

    function addChangeRequest(name, address, city) {
        const newChangeRequest = JSON.stringify({
            name: name,
            address: address,
            city: city,
            // email: email,
        });
        setName('');
        fetch(`${props.url}/api/changerequest/new/${person.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newChangeRequest,
        });
    }

    useEffect(() => {
        fetchData()
            .then((result) => {
                setPerson(result);
                setName(result.name);
                setAddress(result.address);
                setCity(result.city);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    if (props.person.name != null) {
        if (edit) {
            return (
                <div className="accountPage">
                    <div className="account bordered">
                        <form
                            onSubmit={(e) => {
                                addChangeRequest(name, address, city);
                                setEdit(false);
                                e.preventDefault();
                            }}
                        >
                            <input
                                type="submit"
                                className="edit bordered"
                                value="✓"
                            />
                            <label htmlFor="name">Name: </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                            <br />
                            <label htmlFor="address">address: </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                onChange={(e) => setAddress(e.target.value)}
                                value={address}
                            />
                            <br />
                            <label htmlFor="city">city: </label>
                            <input
                                id="city"
                                name="city"
                                type="city"
                                onChange={(e) => setCity(e.target.value)}
                                value={city}
                            />
                            <br />
                            <p>{props.email}</p>
                            <br />
                        </form>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="accountPage">
                    <div className="account bordered">
                        <button
                            className="edit bordered"
                            onClick={() => setEdit(true)}
                        >
                            ✎
                        </button>

                        <h2>{props.person.name}</h2>
                        <br />
                        <p>{props.person.address}</p>
                        <br />
                        <p>{props.person.city}</p>
                        <br />
                        <p>{props.email}</p>
                        <br />
                        {emailChange ? (
                            <EmailChanger
                                setEmailChange={setEmailChange}
                                email={props.email}
                                password={props.password}
                                url={props.url}
                                setEmail={props.setEmail}
                            />
                        ) : (
                            <button onClick={() => setEmailChange(true)}>
                                Change Email
                            </button>
                        )}
                        {passwordChange ? (
                            <PasswordChanger
                                setPasswordChange={setPasswordChange}
                                email={props.email}
                                password={props.password}
                                url={props.url}
                                setPassword={props.setPassword}
                            />
                        ) : (
                            <button onClick={() => setPasswordChange(true)}>
                                Change Password
                            </button>
                        )}
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div className="accountPage">
                <div className="account">No account found</div>
            </div>
        );
    }
}
