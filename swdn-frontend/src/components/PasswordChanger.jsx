import React, { useState } from 'react';

export default function PasswordChanger(props) {
    const [checkPassword, setCheckPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function updatePassword() {
        if (props.password != checkPassword) {
            alert('Incorrect password');
            return;
        }
        if (newPassword != confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        const passwordUpdate = {
            email: props.email,
            oldPassword: checkPassword,
            newPassword: newPassword,
        };
        fetch(`${props.url}/api/user/changepassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: JSON.stringify(passwordUpdate),
        }).then((response) => {
            if (response.ok) {
                props.setPassword(newPassword);
                props.setPasswordChange(false);
            } else {
                alert('Something went wrong. Please try again later.');
            }
        });
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                updatePassword();
            }}
        >
            <label htmlFor="check">Current password: </label>
            <input
                type="password"
                name="check"
                id="check"
                required
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
            />
            <br />
            <label htmlFor="new">New password: </label>
            <input
                type="password"
                name="new"
                id="new"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            <label htmlFor="confirm">Confirm password: </label>
            <input
                type="password"
                name="confirm"
                id="confirm"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <br />
            <input
                type="submit"
                value="Confirm"
            />
        </form>
    );
}
