import React from 'react';
import { NavLink } from 'react-router-dom';

function NavBar(props) {
    return (
        <div className="navBar bordered">
            <h2 className="nav-centering-left">{props.person.name || ''}</h2>
            <nav>
                {props.person.role.name === 'Not Logged In' ? (
                    <NavLink
                        to="/login"
                        className="navButton"
                    >
                        {/* Door */}
                        &#128682;&#xFE0E;
                    </NavLink>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className="navButton"
                        >
                            {/* Door */}
                            &#128682;&#xFE0E;
                        </NavLink>
                        <NavLink
                            to="/account"
                            className="navButton"
                        >
                            {/* Bust */}
                            &#128100;&#xFE0E;
                        </NavLink>
                    </>
                )}

                {props.person.role.name === 'HR' ? (
                    <NavLink
                        to="/hr"
                        className="navButton"
                    >
                        {/* Bar graph */}
                        📊&#xFE0E;
                    </NavLink>
                ) : (
                    ''
                )}
                {props.person.role.name === 'COACH' ? (
                    <>
                        <NavLink
                            to="/coach"
                            className="navButton"
                        >
                            {/* Bar graph */}
                            📊&#xFE0E;
                        </NavLink>
                        <NavLink
                            to="/coachfeedback"
                            className="navButton"
                        >
                            {/* Mail */}
                            &#128233;&#xFE0E;
                        </NavLink>
                        <NavLink
                            to="/templates"
                            className="navButton"
                        >
                            {/* Clipboard */}
                            &#128203;&#xFE0E;
                        </NavLink>
                    </>
                ) : (
                    ''
                )}
                {props.person.role.name === 'MANAGER' ? (
                    <NavLink
                        to="/manager"
                        className="navButton"
                    >
                        {/* Bar graph */}
                        📊&#xFE0E;
                    </NavLink>
                ) : (
                    ''
                )}
                {props.person.role.name === 'TRAINEE' ? (
                    <>
                        <NavLink
                            to="/trainee"
                            className="navButton"
                        >
                            {/* Bar graph */}
                            📊&#xFE0E;
                        </NavLink>
                        <NavLink
                            to="/feedback"
                            className="navButton"
                        >
                            {/* Mail */}
                            &#128233;&#xFE0E;
                        </NavLink>
                    </>
                ) : (
                    ''
                )}
            </nav>
            <h2 className="nav-centering-right">😎</h2>
        </div>
    );
}

export default NavBar;
