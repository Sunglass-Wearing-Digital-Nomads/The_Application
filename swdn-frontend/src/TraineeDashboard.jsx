import React, { useState, useEffect } from 'react';
import List from './components/List';
import SkillOverview from './components/SkillOverview';
import NewSkill from './components/NewSkill';
import NewMeeting from './components/NewMeeting';
import Meetings from './components/Meetings';

export default function TraineeDashboard(props) {
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState(-1);

    const fetchSkills = async () => {
        const result = await fetch(
            `http://localhost:8082/api/skill/${props.person.id}/all`,
            {
                headers: {
                    Authorization:
                        'Basic ' + btoa(props.email + ':' + props.password),
                },
            }
        );
        if (!result.ok) {
            throw new Error('Data coud not be fetched!');
        } else {
            return result.json();
        }
    };

    useEffect(() => {
        fetchSkills()
            .then((result) => {
                setSkills(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, [props.person]);

    return (
        <div className="dashboard">
            <List
                content={skills}
                selected={skill}
                select={setSkill}
                title="Skills"
            />
            <SkillOverview
                skill={skills.find((x) => x.id === skill)}
                update={() => {
                    fetchSkills()
                        .then((result) => {
                            setSkills(result);
                        })
                        .catch((e) => {
                            console.log(e.message);
                        });
                }}
                editable={true}
                email={props.email}
                password={props.password}
            />
            <div className="sidebar">
                <NewSkill
                    person={props.person.id}
                    update={() => {
                        fetchSkills()
                            .then((result) => {
                                setSkills(result);
                            })
                            .catch((e) => {
                                console.log(e.message);
                            });
                    }}
                    email={props.email}
                    password={props.password}
                />
            </div>
        </div>
    );
}