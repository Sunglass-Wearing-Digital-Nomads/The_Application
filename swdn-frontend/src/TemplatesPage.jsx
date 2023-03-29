import React from 'react';
import List from './components/List';
import cat from './img/cat-long.avif';
import TemplateOverview from './components/TemplateOverview';
import NewTemplate from './components/NewTemplate';

export default function TemplatesPage(props) {
    return (
        <div className="dashboard one-list">
            <List
                content={props.templates}
                selected={props.template}
                select={props.setTemplate}
                title="Skill Templates"
            />
            <TemplateOverview
                skill={props.templates.find((x) => x.id === props.template)}
                update={props.update}
                email={props.email}
                password={props.password}
                url={props.url}
            />
            <div className="sidebar">
                <NewTemplate
                    update={props.update}
                    email={props.email}
                    password={props.password}
                    url={props.url}
                    skills={props.templates}
                />
            </div>
            <img
                src={cat}
                className="cat-long bordered"
            />
        </div>
    );
}
