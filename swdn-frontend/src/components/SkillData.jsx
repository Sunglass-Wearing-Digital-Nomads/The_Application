import React from 'react';

export default function SkillData(props) {
    return (
        <div className="skillOverview bordered">
            {props.editable ? (
                <button
                    className="edit bordered"
                    onClick={() => props.setEdit(true)}
                >
                    ✎
                </button>
            ) : (
                <></>
            )}
            <h2>
                {props.skill.name}
                <i className="hardsoftskill">
                    {props.skill.hardSkill ? ' Hard skill' : ' Soft skill'}
                </i>
            </h2>
            <p className="text">{props.skill.description}</p>
            <h3>Learning goals:</h3>
            <p className="text">{props.skill.learningGoals}</p>
            <div className="info-flex">
                <span className="icon">
                    {props.skill.completed ? '✓' : '✘'}
                </span>
                <span>
                    {props.skill.completed ? 'Completed' : 'Not completed'}
                </span>
            </div>
            <div className="info-flex">
                <span className="icon">🗎</span>
                {props.skill.certificate ? (
                    <a
                        href={`${props.url}/api/skill/certificate/${props.skill.id}`}
                        download={props.skill.certificate.fileName}
                    >
                        {props.skill.certificate.fileName}
                    </a>
                ) : (
                    <span>No certificate</span>
                )}
            </div>
            <p className="text">{props.skill.report}</p>
            {props.editable ? (
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
                                `${props.url}/api/skill/delete/${props.skill.id}`,
                                {
                                    method: 'DELETE',
                                    headers: {
                                        Authorization:
                                            'Basic ' +
                                            btoa(
                                                props.email +
                                                    ':' +
                                                    props.password
                                            ),
                                    },
                                }
                            ).then(() => props.update());
                        }
                    }}
                >
                    ✘
                </button>
            ) : (
                <></>
            )}
        </div>
    );
}
