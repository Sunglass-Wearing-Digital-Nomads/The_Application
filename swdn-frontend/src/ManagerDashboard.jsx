import React, { useState, useEffect } from 'react';
import List from './components/List';
import SkillOverview from './components/SkillOverview';
import NewMeeting from './components/NewMeeting';
import Meetings from './components/Meetings';
import cat from './img/cat.jpg';

export default function ManagerDashboard(props) {
    const [viewer, setViewer] = useState(-1);
    const [people, setPeople] = useState([]);
    const [person, setPerson] = useState(-1);
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState(-1);
    const [viewerMeetings, setViewerMeetings] = useState([]);
    const [traineeMeetings, setTraineeMeetings] = useState([]);

    const fetchViewer = async () => {
        const result = await fetch(
            `http://localhost:8082/api/person/${props.person.id}`,
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

    const fetchData = async () => {
        const result = await fetch(
            'http://localhost:8082/api/role/trainee/all',
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
            `http://localhost:8082/api/skill/${person}/all`,
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

    const fetchTraineeMeetings = async () => {
        const result = await fetch(
            `http://localhost:8082/api/evaluation/trainee/${person}/all`,
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

    const fetchViewerMeetings = async () => {
        const result = await fetch(
            `http://localhost:8082/api/evaluation/evaluator/${viewer.id}/all`,
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
        fetchViewer()
            .then((result) => {
                setViewer(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    useEffect(() => {
        fetchData()
            .then((result) => {
                setPeople(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    useEffect(() => {
        if (person > 0) {
            fetchSkills()
                .then((result) => {
                    setSkills(result);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }
    }, [person]);

    useEffect(() => {
        if (person > 0) {
            fetchViewerMeetings()
                .then((result) => {
                    setViewerMeetings(result);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }
    }, [person]);

    useEffect(() => {
        if (person > 0) {
            fetchTraineeMeetings()
                .then((result) => {
                    setTraineeMeetings(result);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }
    }, [person]);

    return (
        <div className="dashboard">
            <List
                content={people}
                selected={person}
                select={setPerson}
                title="Trainees"
            />
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
                editable={false}
                email={props.email}
                password={props.password}
            />
            <div className="sidebar">
                <div className="importantImage bordered">
                    <img
                        src={cat}
                        className="cat"
                    />
                </div>
                <NewMeeting
                    evaluator={viewer.id}
                    trainee={person}
                    evaluatorMeetings={viewerMeetings}
                    traineeMeetings={traineeMeetings}
                    update={() => {
                        fetchTraineeMeetings()
                            .then((result) => {
                                setTraineeMeetings(result);
                            })
                            .catch((e) => {
                                console.log(e.message);
                            });
                        fetchViewerMeetings()
                            .then((result) => {
                                setViewerMeetings(result);
                            })
                            .catch((e) => {
                                console.log(e.message);
                            });
                    }}
                    email={props.email}
                    password={props.password}
                />
                <Meetings meetings={viewerMeetings} />
            </div>
        </div>
    );
}