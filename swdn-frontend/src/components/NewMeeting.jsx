import React, { useState } from 'react';

function NewMeeting(props) {
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [duration, setDuration] = useState();

    function addMeeting(date, time, duration) {
        if (props.trainee == -1) {
            alert('No trainee selected!');
        } else if (
            isDoubleBooked(props.traineeMeetings) ||
            isDoubleBooked(props.evaluatorMeetings)
        ) {
            alert('Overlapping times!');
        } else {
            const newMeeting = JSON.stringify({
                date: date,
                time: time,
                duration: duration,
            });
            setDate();
            setTime();
            setDuration();
            fetch(
                `http://localhost:8082/api/evaluation/new/${props.evaluator}/${props.trainee}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: newMeeting,
                }
            ).then(() => props.update());
        }
    }

    function isDoubleBooked(meetings) {
        const newDate = date;
        const newStartTime = time;
        const newEndTime = addTimes(time, duration);

        for (let index = 0; index < meetings.length; index++) {
            const oldMeeting = meetings[index];
            const oldDate = oldMeeting.date;
            const oldStartTime = oldMeeting.time;
            const oldEndTime = addTimes(oldMeeting.time, oldMeeting.duration);
            if (oldDate === newDate) {
                if (
                    (oldStartTime >= newStartTime &&
                        oldStartTime <= newEndTime) ||
                    (oldEndTime >= newStartTime && oldEndTime <= newEndTime) ||
                    (oldStartTime >= newStartTime &&
                        oldEndTime <= newEndTime) ||
                    (newEndTime >= oldStartTime && newEndTime <= oldEndTime) ||
                    (newStartTime >= oldStartTime && newStartTime <= oldEndTime)
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    function timeToMins(time) {
        var timePart = time.split(':');
        return timePart[0] * 60 + +timePart[1];
    }

    function timeFromMins(mins) {
        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }
        var hours = ((mins / 60) | 0) % 24;
        var minutes = mins % 60;
        return z(hours) + ':' + z(minutes);
    }

    function addTimes(t0, t1) {
        return timeFromMins(timeToMins(t0) + timeToMins(t1));
    }

    return (
        <div className="newMeeting bordered">
            <h2>Plan evaluation meeting</h2>
            <form
                onSubmit={(e) => {
                    addMeeting(date, time, duration);
                    e.preventDefault();
                }}
            >
                <label htmlFor="date">Date: </label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    onChange={(e) => setDate(e.target.value)}
                />
                <br />
                <label htmlFor="time">Time: </label>
                <input
                    type="time"
                    name="time"
                    id="time"
                    required
                    onChange={(e) => setTime(e.target.value)}
                />
                <br />
                <label htmlFor="duration">Duration: </label>
                <input
                    type="time"
                    name="duration"
                    id="duration"
                    required
                    onChange={(e) => setDuration(e.target.value)}
                />
                <br />
                <input
                    type="submit"
                    value="Plan meeting"
                />
            </form>
        </div>
    );
}

export default NewMeeting;