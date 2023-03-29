import React, { useState } from 'react';
import FeedbackData from './FeedbackData';
import FeedbackEditor from './FeedbackEditor';
function FeedbackOverview(props) {
    if (props.feedback) {
        const [edit, setEdit] = useState(false);

        if (edit) {
            return (
                <FeedbackEditor
                    feedback={props.feedback}
                    setEdit={setEdit}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                    update={props.update}
                />
            );
        } else {
            return (
                <FeedbackData
                    editable={props.editable}
                    feedback={props.feedback}
                    setEdit={setEdit}
                />
            );
        }
    } else {
        return <div className="feedbackOverview bordered">None selected</div>;
    }
}
export default FeedbackOverview;
