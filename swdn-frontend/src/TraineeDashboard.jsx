import React, { useState, useEffect } from 'react';
import List from './components/List';
import SkillOverview from './components/SkillOverview';
import NewSkill from './components/NewSkill';
import Meetings from './components/Meetings';
import FeedbackRequest from './components/FeedbackRequest';
import cat from './img/cat-long.avif';

export default function TraineeDashboard(props) {
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState(-1);
    const [traineeMeetings, setTraineeMeetings] = useState([]);

    const fetchTraineeMeetings = async () => {
        const result = await fetch(
            `${props.url}/api/evaluation/trainee/${props.person.id}/future`,
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

    const fetchSkills = async () => {
        const result = await fetch(
            `${props.url}/api/skill/${props.person.id}/all`,
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
        fetchTraineeMeetings()
            .then((result) => {
                setTraineeMeetings(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, [props.person]);

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
        <div className="dashboard one-list">
            <List
                content={skills.sort((a, b) => a.completed - b.completed)}
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
                url={props.url}
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
                    url={props.url}
                    skills={skills}
                    templates={props.templates}
                    template={props.template}
                    setTemplate={props.setTemplate}
                />
                <FeedbackRequest
                    person={props.person.id}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                />
                <Meetings
                    meetings={traineeMeetings}
                    isTrainee={true}
                />
            </div>
            <img
                src={cat}
                className="cat-long bordered"
            />
        </div>
    );
}
