import React, { useState, useEffect } from 'react';
import List from './components/List';
import SkillOverview from './components/SkillOverview';
import NawData from './components/NawData';
import ChangeRequested from './components/ChangeRequested';
import NewPerson from './components/NewPerson';

export default function HRDashboard(props) {
    const [people, setPeople] = useState([]);
    const [person, setPerson] = useState(1);
    const [skills, setSkills] = useState([]);
    const [skill, setSkill] = useState(-1);

    const fetchData = async () => {
        const result = await fetch(`${props.url}/api/person/all`, {
            headers: {
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
        });
        if (!result.ok) {
            throw new Error('Data coud not be fetched!');
        } else {
            return result.json();
        }
    };

    const fetchSkills = async () => {
        const result = await fetch(`${props.url}/api/skill/${person}/all`, {
            headers: {
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
        });
        if (!result.ok) {
            throw new Error('Data coud not be fetched!');
        } else {
            return result.json();
        }
    };

    function changeNAW(name, address, city) {
        const newNAW = JSON.stringify({
            name: name,
            address: address,
            city: city,
        });

        fetch(`${props.url}/api/person/update/${person}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    'Basic ' + btoa(props.email + ':' + props.password),
            },
            body: newNAW,
        }).then(() => {
            fetchData()
                .then((result) => {
                    setPeople(result);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        });
    }

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
    return (
        <div className="dashboard">
            <div className="two-lists">
                <List
                    content={people}
                    selected={person}
                    select={setPerson}
                    title="People"
                />
                <List
                    content={skills.sort((a, b) => a.completed - b.completed)}
                    selected={skill}
                    select={setSkill}
                    title="Skills"
                />
            </div>
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
                url={props.url}
            />
            <div className="sidebar">
                <NawData
                    person={people.find((x) => x.id === person)}
                    viewer={props.person}
                    people={people}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                    changeNAW={changeNAW}
                    update={() => {
                        fetchData()
                            .then((result) => {
                                setPeople(result);
                            })
                            .catch((e) => {
                                console.log(e.message);
                            });
                    }}
                />
                <ChangeRequested
                    personid={person}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                    changeNAW={changeNAW}
                />
                <NewPerson
                    update={() => {
                        fetchData()
                            .then((result) => {
                                setPeople(result);
                            })
                            .catch((e) => {
                                console.log(e.message);
                            });
                    }}
                    people={people}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                />
            </div>
        </div>
    );
}
