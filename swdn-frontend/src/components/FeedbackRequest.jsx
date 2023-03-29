import React, { useEffect, useState } from 'react';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';

function FeedbackRequest(props) {
    const [email, setEmail] = useState('');
    const [query, setQuery] = useState('');
    const [people, setPeople] = useState([
        { id: 1, name: 'Harry', user: { email: 'harry@example.com' } },
        { id: 2, name: 'Peter Bot', user: { email: 'peter@example.com' } },
    ]);

    function addInvitation(email) {
        const currentDate = new Date();
        const newInvitation = JSON.stringify({
            email: email,
            sendDate: currentDate,
        });
        setEmail('');
        setQuery('');
        fetch(`${props.url}/api/invitation/new/${props.person}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newInvitation,
        }).then((response) => {
            if (!response.ok) {
                alert('Email not found');
            }
        });
    }

    useEffect(() => {
        fetch(`${props.url}/api/role/trainee/all`, {
            headers: {
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((data) =>
                setPeople(data.filter((item) => item.id != props.person))
            );
    }, [props.person]);

    const handleOnSelect = (item) => {
        // the item selected
        console.log(item);
        setEmail(item.user.email);
    };

    const formatResult = (item) => {
        return (
            <span style={{ display: 'block', textAlign: 'left' }}>
                {item.user.email} <i>{item.name}</i>
            </span>
        );
    };

    return (
        <div className="feedbackRequest bordered">
            <h2>Ask for 360 feedback</h2>
            <form
                onSubmit={(e) => {
                    addInvitation(email);
                    e.preventDefault();
                }}
            >
                <ReactSearchAutocomplete
                    items={people}
                    fuseOptions={{ keys: ['name', 'user.email'] }}
                    onSelect={handleOnSelect}
                    onSearch={(keyword) => setQuery(keyword)}
                    inputSearchString={query}
                    formatResult={formatResult}
                    showIcon={false}
                    styling={{
                        backgroundColor: '#333',
                        color: 'white',
                        hoverBackgroundColor: '#555',
                    }}
                />
                <input type="submit"></input>
            </form>
        </div>
    );
}

export default FeedbackRequest;
