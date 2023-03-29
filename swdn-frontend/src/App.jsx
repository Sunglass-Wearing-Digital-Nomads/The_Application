import { useState, useEffect } from 'react';
import './App.css';
import CoachDashboard from './CoachDashboard';
import ManagerDashboard from './ManagerDashboard';

import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import HRDashboard from './HRDashboard';
import LoginPage from './LoginPage';
import AccountPage from './AccountPage';
import FeedbackPage from './FeedbackPage';
import TraineeDashboard from './TraineeDashboard';
import CoachFeedbackPage from './CoachFeedbackPage';
import TemplatesPage from './TemplatesPage';

function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [person, setPerson] = useState({
        role: {
            name: 'Not Logged In',
        },
    });
    const [trainees, setTrainees] = useState([]);
    const [trainee, setTrainee] = useState(-1);
    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState(-1);

    const url =
        import.meta.env.VITE_REACT_STATUS === 'production'
            ? import.meta.env.VITE_REACT_PROD_URL
            : import.meta.env.VITE_REACT_DEV_URL;

    const fetchTemplates = async () => {
        const result = await fetch(`${url}/api/template/all`, {
            headers: {
                Authorization: 'Basic ' + btoa(email + ':' + password),
            },
        });
        if (!result.ok) {
            throw new Error('Data coud not be fetched!');
        } else {
            return result.json();
        }
    };

    useEffect(() => {
        if (
            email &&
            (person.role.name === 'COACH' || person.role.name === 'TRAINEE')
        ) {
            fetchTemplates()
                .then((result) => {
                    setTemplates(result);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        }
    }, [person]);

    return (
        <div className="App">
            <NavBar person={person} />
            <Routes>
                <Route
                    path="/coach"
                    element={
                        <CoachDashboard
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                            trainees={trainees}
                            setTrainees={setTrainees}
                            trainee={trainee}
                            setTrainee={setTrainee}
                            templates={templates}
                            template={template}
                            setTemplate={setTemplate}
                        />
                    }
                />
                <Route
                    path="/manager"
                    element={
                        <ManagerDashboard
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                        />
                    }
                />
                <Route
                    path="/trainee"
                    element={
                        <TraineeDashboard
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                            templates={templates}
                            template={template}
                            setTemplate={setTemplate}
                        />
                    }
                />
                <Route
                    path="/hr"
                    element={
                        <HRDashboard
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                        />
                    }
                />
                <Route
                    path="/login"
                    element={
                        <LoginPage
                            setEmail={setEmail}
                            setPassword={setPassword}
                            url={url}
                            setPerson={setPerson}
                        />
                    }
                />
                <Route
                    path="/account"
                    element={
                        <AccountPage
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                            setEmail={setEmail}
                            setPassword={setPassword}
                        />
                    }
                />
                <Route
                    path="/feedback"
                    element={
                        <FeedbackPage
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                        />
                    }
                />
                <Route
                    path="/coachfeedback"
                    element={
                        <CoachFeedbackPage
                            email={email}
                            password={password}
                            url={url}
                            person={person}
                            trainees={trainees}
                            trainee={trainee}
                            setTrainee={setTrainee}
                        />
                    }
                />
                <Route
                    path="/templates"
                    element={
                        <TemplatesPage
                            email={email}
                            password={password}
                            url={url}
                            templates={templates}
                            update={() => {
                                fetchTemplates()
                                    .then((result) => {
                                        setTemplates(result);
                                    })
                                    .catch((e) => {
                                        console.log(e.message);
                                    });
                            }}
                            template={template}
                            setTemplate={setTemplate}
                        />
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
