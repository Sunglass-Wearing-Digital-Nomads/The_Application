import React, { useState } from 'react';

export default function RestoreAccount(props) {
    const [email, setEmail] = useState('');

    function restorePerson() {
        if (!emailExists(email)) {
            fetch(`http://localhost:8082/api/user/restore`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        'Basic ' + btoa(props.email + ':' + props.password),
                },
                body: email,
            }).then((response) => {
                if (response.ok) {
                    props.update();
                } else {
                    alert(
                        'No such user has existed, or the user has not been deleted'
                    );
                }
            });
            setEmail('');
        } else {
            alert('This email is already linked to an active account');
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
            className="restoreAccount bordered"
            onSubmit={(e) => {
                restorePerson(email);
                e.preventDefault();
            }}
        >
            Restore Account &nbsp;
            <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            ></input>
            &nbsp;
            <input
                type="submit"
                value={'Restore'}
            ></input>
        </form>
    );
}
