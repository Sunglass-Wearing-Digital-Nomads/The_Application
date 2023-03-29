import React, { useState, useEffect } from 'react';
import FeedbackOverview from './components/FeedbackOverview';
import List from './components/List';

export default function CoachFeedbackPage(props) {
    const [allGiven, setAllGiven] = useState([]);
    const [given, setGiven] = useState(-1);

    const fetchFeedbackGiven = async () => {
        const result = await fetch(
            `${props.url}/api/invitation/givers/${props.trainee}`,
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
            const data = await result.json();
            return data;
        }
    };

    useEffect(() => {
        fetchFeedbackGiven()
            .then((result) => {
                result.map((item) => (item.name = item.feedbackGiver.name));
                setAllGiven(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, [props.trainee]);

    return (
        <div className="feedbackPage">
            <div className="two-lists">
                <List
                    content={props.trainees}
                    selected={props.trainee}
                    select={props.setTrainee}
                    title="Trainees"
                />
                <List
                    content={allGiven}
                    selected={given}
                    select={setGiven}
                    title="Received feedback"
                />
            </div>
            <FeedbackOverview
                feedback={allGiven.find((x) => x.id === given)}
                update={() => {
                    fetchFeedbackGiven()
                        .then((result) => {
                            setAllGiven(result);
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
        </div>
    );
}
