import React, { useState } from 'react';

function NewTemplate(props) {
    const [name, setName] = useState('');
    const [hardSkill, setHardSkill] = useState(true);

    function addTemplate(name, hardness) {
        if (props.skills.map((skill) => skill.name).includes(name)) {
            alert('You already have a template with that name.');
            return;
        }
        const newTemplate = JSON.stringify({ name: name, hardSkill: hardness });
        if (!name.replace(/\s/g, '').length) {
        } else {
            fetch(`${props.url}/api/template/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization:
                        'Basic ' + btoa(props.email + ':' + props.password),
                },
                body: newTemplate,
            }).then(() => props.update());
        }
        setName('');
        setHardSkill(true);
    }

    return (
        <div className="newSkill bordered">
            <h2>Add new Template</h2>
            <form
                onSubmit={(e) => {
                    addTemplate(name, hardSkill);
                    e.preventDefault();
                }}
            >
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
                <input
                    type="submit"
                    value="Add Template"
                />
            </form>
        </div>
    );
}

export default NewTemplate;
