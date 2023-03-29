import React, { useState } from 'react';

function NewSkill(props) {
    const [name, setName] = useState('');
    const [hardSkill, setHardSkill] = useState(true);

    function addSkill(name, hardness) {
        if (props.template == 0) {
            if (props.skills.map((skill) => skill.name).includes(name)) {
                alert('You already have a skill with that name.');
                return;
            }
            const newSkill = JSON.stringify({
                name: name,
                hardSkill: hardness,
            });
            if (!name.replace(/\s/g, '').length) {
            } else {
                fetch(`${props.url}/api/skill/new/${props.person}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                            'Basic ' + btoa(props.email + ':' + props.password),
                    },
                    body: newSkill,
                }).then(() => props.update());
            }
            setName('');
            setHardSkill(true);
        } else {
            if (props.template > 0) {
                fetch(
                    `${props.url}/api/template/assign/${props.template}/to/${props.person}`,
                    {
                        method: 'PUT',
                        headers: {
                            Authorization:
                                'Basic ' +
                                btoa(props.email + ':' + props.password),
                        },
                    }
                ).then(() => props.update());
            }
        }
    }

    return (
        <div className="newSkill bordered">
            <h2>Add new Skill</h2>
            <form
                onSubmit={(e) => {
                    addSkill(name, hardSkill);
                    e.preventDefault();
                }}
            >
                <select
                    name="template"
                    id="template"
                    value={props.template}
                    onChange={(e) => props.setTemplate(e.target.value)}
                >
                    <option value={-1}>Select Template</option>
                    {props.templates.map((item) => (
                        <option
                            key={item.id}
                            value={item.id}
                        >
                            {item.name}
                        </option>
                    ))}
                    <option value={0}>Custom Skill</option>
                </select>
                <br />
                {props.template == 0 ? (
                    <>
                        <input
                            type="text"
                            name="skillname"
                            id="skillname"
                            required
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <br />
                        <input
                            type="radio"
                            name="skill-hardness"
                            id="hard"
                            value={true}
                            checked={hardSkill}
                            onChange={(e) => setHardSkill(true)}
                        />
                        <label htmlFor="hard">Hard Skill</label>
                        <br />
                        <input
                            type="radio"
                            name="skill-hardness"
                            id="soft"
                            value={false}
                            checked={!hardSkill}
                            onChange={(e) => setHardSkill(false)}
                        />
                        <label htmlFor="soft">Soft Skill</label>
                        <br />
                    </>
                ) : (
                    <></>
                )}
                <input
                    type="submit"
                    value="Add Skill"
                />
            </form>
        </div>
    );
}

export default NewSkill;
