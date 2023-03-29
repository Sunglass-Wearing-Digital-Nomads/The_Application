import React from 'react';
import ListItem from './ListItem';

function List(props) {
    return (
        <div className="listWrapper bordered">
            <h3>{props.title}</h3>

            <div className="list bordered">
                {props.content.map((item) => (
                    <ListItem
                        name={item.name}
                        id={item.id}
                        key={item.id}
                        selected={props.selected}
                        select={props.select}
                        completed={item.completed}
                    />
                ))}
            </div>
        </div>
    );
}

export default List;
