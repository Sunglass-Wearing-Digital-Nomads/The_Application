import React, { useEffect, useState } from 'react';

export default function TemplateEditor(props) {
    const [name, setName] = useState(props.skill.name);
    const [hardSkill, setHardSkill] = useState(props.skill.hardSkill);
    const [description, setDescription] = useState(props.skill.description);

    async function sendChanges() {
        const newTemplate = JSON.stringify({
            name: name,
            hardSkill: hardSkill,
            description: description,
        });
        await fetch(`${props.url}/api/template/update/${props.skill.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newTemplate,
        });
        props.update();
    }

    useEffect(() => {
        setName(props.skill.name);
        setHardSkill(props.skill.hardSkill);
        setDescription(props.skill.description);
    }, [props.skill]);
    return (
        <form
            className="skillOverview bordered"
            onSubmit={(e) => {
                sendChanges();
                props.setEdit(false);
                e.preventDefault();
            }}
        >
            <input
                type="submit"
                className="edit bordered"
                value="✓"
            />
            <h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                />
                <div>
                    <input
                        type="radio"
                        name="skill-hardness"
                        id="hard"
                        value={true}
                        checked={hardSkill}
                        onChange={() => setHardSkill(true)}
                    />
                    <label
                        htmlFor="hard"
                        className="hardsoftskill"
                    >
                        Hard Skill
                    </label>
                    <br />
                    <input
                        type="radio"
                        name="skill-hardness"
                        id="soft"
                        value={false}
                        checked={!hardSkill}
                        onChange={() => setHardSkill(false)}
                    />
                    <label
                        htmlFor="soft"
                        className="hardsoftskill"
                    >
                        Soft Skill
                    </label>
                </div>
            </h2>
            <textarea
                name="description"
                id="description"
                cols="60"
                rows="10"
                value={description || ''}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={600}
            ></textarea>
        </form>
    );
}
