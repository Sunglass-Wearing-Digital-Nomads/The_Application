import React, { useState } from 'react';
import TemplateData from './TemplateData';
import TemplateEditor from './TemplateEditor';
function TemplateOverview(props) {
    if (props.skill) {
        const [edit, setEdit] = useState(false);

        if (edit) {
            return (
                <TemplateEditor
                    skill={props.skill}
                    setEdit={setEdit}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                    update={props.update}
                />
            );
        } else {
            return (
                <TemplateData
                    skill={props.skill}
                    setEdit={setEdit}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                    update={props.update}
                />
            );
        }
    } else {
        return <div className="skillOverview bordered">None selected</div>;
    }
}
export default TemplateOverview;
