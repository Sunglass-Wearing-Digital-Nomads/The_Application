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

    function sendChanges() {
        const newSkill = JSON.stringify({
            name: name,
            hardSkill: hardSkill,
            completed: completed,
            learningGoals: learningGoals,
            report: report,
        });
        fetch(`http://localhost:8082/api/skill/update/${props.skill.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newSkill,
        }).then(() => props.update());

        let formData = new FormData();
        formData.append('file', certificate);

        fetch(
            `http://localhost:8082/api/skill/add/certificate/${props.skill.id}`,
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

    useEffect(() => {
        setName(props.skill.name);
        setHardSkill(props.skill.hardSkill);
        setCompleted(props.skill.completed);
        setReport(props.skill.report);
        setLearningGoals(props.skill.learningGoals);
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
            <h3>Learning goals:</h3>
            <textarea
                name="learninggoals"
                id="learninggoals"
                cols="60"
                rows="5"
                value={learningGoals || ''}
                onChange={(e) => setLearningGoals(e.target.value)}
                maxLength={255}
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
                    files={[certificate]}
                    onChange={(e) => {
                        setCertificate(e.target.files[0]);
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
