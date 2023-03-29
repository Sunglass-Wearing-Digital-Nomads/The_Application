import React, { useState, useEffect } from 'react';
import FeedbackOverview from './components/FeedbackOverview';
import List from './components/List';

export default function FeedbackPage(props) {
    const [allGiven, setAllGiven] = useState([]);
    const [allRequested, setAllRequested] = useState([]);

    const [given, setGiven] = useState(-1);
    const [requested, setRequested] = useState(-1);

    const fetchFeedbackRequested = async () => {
        const result = await fetch(
            `${props.url}/api/invitation/requesters/${props.person.id}`,
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
    const fetchFeedbackGiven = async () => {
        const result = await fetch(
            `${props.url}/api/invitation/givers/${props.person.id}`,
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
    }, []);

    useEffect(() => {
        fetchFeedbackRequested()
            .then((result) => {
                result.map((item) => (item.name = item.feedbackAsker.name));
                setAllRequested(result);
            })
            .catch((e) => {
                console.log(e.message);
            });
    }, []);

    return (
        <div className="feedbackPage one-list">
            <List
                content={allRequested}
                selected={requested}
                select={setRequested}
                title="Requested feedback"
            />
            <FeedbackOverview
                feedback={allRequested.find((x) => x.id === requested)}
                update={() => {
                    fetchFeedbackRequested()
                        .then((result) => {
                            result.map(
                                (item) => (item.name = item.feedbackAsker.name)
                            );
                            setAllRequested(result);
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
            <List
                content={allGiven}
                selected={given}
                select={setGiven}
                title="Received feedback"
            />
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
