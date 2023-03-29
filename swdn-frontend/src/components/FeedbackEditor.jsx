import React, { useEffect, useState } from 'react';

export default function SkillEditor(props) {
    const [feedback, setFeedback] = useState(props.feedback.feedback);

    function sendChanges() {
        const newFeedback = JSON.stringify({
            feedback: feedback,
        });
        fetch(`${props.url}/api/invitation/update/${props.feedback.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newFeedback,
        }).then(() => props.update());
    }
    return (
        <div className="feedbackOverview bordered">
            <form
                onSubmit={(e) => {
                    sendChanges();
                    props.setEdit(false);
                    e.preventDefault();
                }}
            >
                <input
                    type="submit"
                    className="feedbackEditButton bordered"
                    value="✓"
                />
                <h2>{props.feedback.name}</h2>
                <p>{props.feedback.sendDate}</p>
                <textarea
                    className="feedbackInputBox"
                    value={feedback || ''}
                    onChange={(e) => setFeedback(e.target.value)}
                    maxLength={255}
                ></textarea>
            </form>
        </div>
    );
}
