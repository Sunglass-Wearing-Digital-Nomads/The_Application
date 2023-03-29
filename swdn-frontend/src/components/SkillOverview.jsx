import React, { useState } from 'react';
import SkillData from './SkillData';
import SkillEditor from './SkillEditor';
function SkillOverview(props) {
    if (props.skill) {
        const [edit, setEdit] = useState(false);

        if (edit) {
            return (
                <SkillEditor
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
                <SkillData
                    editable={props.editable}
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
        return <div className="skillOverview bordered">No skill selected</div>;
    }
}
export default SkillOverview;
