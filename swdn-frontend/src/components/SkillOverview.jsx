import React from 'react';
function SkillOverview(props) {
    if (props.skill) {
        return (
            <div className="skillOverview bordered">
                <button className="edit bordered">✎</button>
                <h2>
                    {props.skill.name}
                    <i className="hardsoftskill">
                        {props.skill.hardSkill ? ' Hard skill' : ' Soft skill'}
                    </i>
                </h2>
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
                    <span>
                        {props.skill.certificate
                            ? props.skill.certificate.name
                            : 'No certificate'}
                    </span>
                </div>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                    Earum, maiores quisquam aliquid minus incidunt architecto,
                    nobis nihil consequatur praesentium vitae pariatur in,
                    officia provident similique asperiores beatae reprehenderit
                    unde consectetur?
                </p>
            </div>
        );
    } else {
        return <div className="skillOverview bordered">None selected</div>;
    }
}
export default SkillOverview;
