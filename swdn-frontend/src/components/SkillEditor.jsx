import React, { useEffect, useState } from 'react';

export default function SkillEditor(props) {
    let file = null;
    if (props.skill.certificate) {
        file = new File(
            [props.skill.certificate.data],
            props.skill.certificate.fileName,
            { type: props.skill.certificate.fileType }
        );
    }
    const [name, setName] = useState(props.skill.name);
    const [hardSkill, setHardSkill] = useState(props.skill.hardSkill);
    const [completed, setCompleted] = useState(props.skill.completed);
    const [certificate, setCertificate] = useState(file);
    const [report, setReport] = useState(props.skill.report);
    const [learningGoals, setLearningGoals] = useState(
        props.skill.learningGoals
    );
    const [description, setDescription] = useState(props.skill.description);
    const [fileChanged, setFileChanged] = useState(false);

    async function sendChanges() {
        const newSkill = JSON.stringify({
            name: name,
            hardSkill: hardSkill,
            completed: completed,
            learningGoals: learningGoals,
            report: report,
            description: description,
        });
        await fetch(`${props.url}/api/skill/update/${props.skill.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newSkill,
        });

        if (fileChanged) {
            let formData = new FormData();
            formData.append('file', certificate);
            await fetch(
                `${props.url}/api/skill/add/certificate/${props.skill.id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization:
                            'Basic ' + btoa(props.email + ':' + props.password),
                    },
                    body: formData,
                }
            );
        }
        props.update();
    }

    useEffect(() => {
        setName(props.skill.name);
        setHardSkill(props.skill.hardSkill);
        setCompleted(props.skill.completed);
        setReport(props.skill.report);
        setLearningGoals(props.skill.learningGoals);
        setDescription(props.skill.description);
        if (props.skill.certificate) {
            file = new File(
                [props.skill.certificate.data],
                props.skill.certificate.fileName,
                { type: props.skill.certificate.fileType }
            );
        }
        setCertificate(file);
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
            <h3>Learning goals:</h3>
            <textarea
                name="learninggoals"
                id="learninggoals"
                cols="60"
                rows="5"
                value={learningGoals || ''}
                onChange={(e) => setLearningGoals(e.target.value)}
                maxLength={600}
            ></textarea>
            <div className="info-flex">
                <button
                    className="icon"
                    onClick={(e) => {
                        setCompleted(!completed);
                        e.preventDefault();
                    }}
                >
                    {completed ? '✓' : '✘'}
                </button>
                <span>{completed ? 'Completed' : 'Not completed'}</span>
            </div>
            <div className="info-flex">
                <span className="icon">🗎</span>
                <label htmlFor="certificate">
                    {certificate ? certificate.name : ''}
                </label>
                <input
                    type="file"
                    name="certificate"
                    id="certificate"
                    onChange={(e) => {
                        setCertificate(e.target.files[0]);
                        setFileChanged(true);
                    }}
                />
            </div>
            <textarea
                name="report"
                id="report"
                cols="60"
                rows="10"
                value={report || ''}
                onChange={(e) => setReport(e.target.value)}
                maxLength={600}
            ></textarea>
        </form>
    );
}
