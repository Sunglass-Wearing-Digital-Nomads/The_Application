import React, { useEffect, useState } from 'react';

export default function NawData(props) {
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [coaches, setCoaches] = useState([]);
    const [coach, setCoach] = useState(0);
    const [managers, setManagers] = useState([]);
    const [manager, setManager] = useState(0);

    function sendPeople() {
        fetch(
            `${props.url}/api/person/setpeople/${props.person.id}/coach/${coach}/manager/${manager}`,
            {
                method: 'PUT',
                headers: {
                    Authorization:
                        'Basic ' + btoa(props.email + ':' + props.password),
                },
            }
        );
    }

    useEffect(() => {
        if (props.person) {
            setName(props.person.name);
            setAddress(props.person.address);
            setCity(props.person.city);
            if (props.person.coach) {
                setCoach(props.person.coach.id);
            } else {
                setCoach(0);
            }
            if (props.person.manager) {
                setManager(props.person.manager.id);
            } else {
                setManager(0);
            }
        } else {
            setName('');
            setAddress('');
            setCity('');
        }
    }, [props.person]);

    useEffect(() => {
        fetch(`${props.url}/api/role/coach/all`, {
            headers: {
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
        })
            .then((result) => result.json())
            .then((data) => setCoaches(data));
        fetch(`${props.url}/api/role/manager/all`, {
            headers: {
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
        })
            .then((result) => result.json())
            .then((data) => setManagers(data));
    }, [props.people]);
    if (edit) {
        return (
            <form
                className="naw bordered"
                onSubmit={(e) => {
                    sendPeople();
                    props.changeNAW(name, address, city);
                    setEdit(false);
                    e.preventDefault();
                }}
            >
                <input
                    type="submit"
                    className="edit bordered"
                    value="✓"
                />
                <span>
                    <label htmlFor="name">Name </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                </span>
                <span>
                    <label htmlFor="address">Address </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                    />
                </span>
                <span>
                    <label htmlFor="city">City </label>
                    <input
                        id="city"
                        name="city"
                        type="city"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                    />
                </span>
                {props.person && props.person.role.name === 'TRAINEE' ? (
                    <>
                        <span>
                            <label htmlFor="coach">Coach </label>
                            <select
                                name="coach"
                                id="coach"
                                value={coach}
                                onChange={(e) => setCoach(e.target.value)}
                            >
                                <option value={0}>Select coach</option>
                                {coaches.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </span>
                        <span>
                            <label htmlFor="manager">Manager </label>
                            <select
                                name="manager"
                                id="Manager"
                                value={manager}
                                onChange={(e) => setManager(e.target.value)}
                            >
                                <option value={0}>Select manager</option>
                                {managers.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </span>
                    </>
                ) : (
                    <></>
                )}
            </form>
        );
    } else {
        return (
            <div className="naw bordered">
                <button
                    className="edit bordered"
                    onClick={() => setEdit(true)}
                >
                    ✎
                </button>
                <h3>
                    {name}, {props.person ? props.person.role.name : ''}
                </h3>
                <span>{address}</span>
                <span>{city}</span>
                {props.person && props.person.role.name === 'TRAINEE' ? (
                    <>
                        <span>
                            <b>Coach:</b>{' '}
                            {props.person.coach
                                ? props.person.coach.name
                                : 'No coach'}
                        </span>
                        <span>
                            <b>Manager:</b>{' '}
                            {props.person.manager
                                ? props.person.manager.name
                                : 'No manager'}
                        </span>
                    </>
                ) : (
                    <></>
                )}
                {props.person != null &&
                typeof props.person != undefined &&
                props.viewer != null &&
                typeof props.viewer != undefined &&
                props.person.id != props.viewer.id ? (
                    <button
                        onClick={() => {
                            if (
                                confirm(
                                    'Are you sure you want to delete ' +
                                        props.person.name +
                                        '?'
                                )
                            ) {
                                fetch(
                                    `${props.url}/api/user/delete/${props.person.id}`,
                                    {
                                        method: 'DELETE',
                                        headers: {
                                            Authorization:
                                                'Basic ' +
                                                btoa(
                                                    props.email +
                                                        ':' +
                                                        props.password
                                                ),
                                        },
                                    }
                                ).then(() => props.update());
                            }
                        }}
                    >
                        ✘
                    </button>
                ) : (
                    <></>
                )}
            </div>
        );
    }
}
