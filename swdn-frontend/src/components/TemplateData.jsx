import React from 'react';

export default function TemplateData(props) {
    return (
        <div className="skillOverview bordered">
            <button
                className="edit bordered"
                onClick={() => props.setEdit(true)}
            >
                ✎
            </button>

            <h2>
                {props.skill.name}
                <i className="hardsoftskill">
                    {props.skill.hardSkill ? ' Hard skill' : ' Soft skill'}
                </i>
            </h2>

            <button
                onClick={() => {
                    if (
                        confirm(
                            'Are you sure you want to delete ' +
                                props.skill.name +
                                '?'
                        )
                    ) {
                        fetch(
                            `http://localhost:8082/api/template/delete/${props.skill.id}`,
                            {
                                method: 'DELETE',
                                headers: {
                                    Authorization:
                                        'Basic ' +
                                        btoa(
                                            props.email + ':' + props.password
                                        ),
                                },
                            }
                        ).then(() => props.update());
                    }
                }}
            >
                ✘
            </button>
        </div>
    );
}
