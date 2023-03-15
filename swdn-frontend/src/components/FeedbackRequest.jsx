import React, { useState } from 'react';

function FeedbackRequest(props) {
    const [email, setEmail] = useState('');

    function addInvitation(name, hardness) {
        const newInvitation = JSON.stringify({ email: email });
        fetch(`http://localhost:8082/api/invitation/new/${props.person}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newInvitation,
        }).then(() => props.update());
    }

    return (
        <div className="feedbackRequest bordered">
            <h2>Ask for 360 feedback</h2>
            <form
                onSubmit={(e) => {
                    addInvitation(email);
                    e.preventDefault();
                }}
            >
                <label htmlFor="email">email: </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    required
                    maxLength={100}
                    onChange={(e) => setEmail(e.target.value)}
                ></input>
                <input type="submit"></input>
            </form>
        </div>
    );
}

export default FeedbackRequest;
