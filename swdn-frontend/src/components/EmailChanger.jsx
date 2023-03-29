import React, { useState } from 'react';

export default function EmailChanger(props) {
    const [newEmail, setNewEmail] = useState('');

    function updateEmail() {
        const emailUpdate = {
            oldEmail: props.email,
            password: props.password,
            newEmail: newEmail,
        };
        fetch(`${props.url}/api/user/changeemail`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: JSON.stringify(emailUpdate),
        }).then((response) => {
            if (response.ok) {
                props.setEmail(newEmail);
                props.setEmailChange(false);
            } else {
                alert('Something went wrong. Please try again later.');
            }
        });
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                updateEmail();
            }}
        >
            <label htmlFor="newemail">New E-mail address: </label>
            <input
                type="email"
                name="newemail"
                id="newemail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
            />
            <br />
            <input
                type="submit"
                value="Confirm"
            />
        </form>
    );
}
