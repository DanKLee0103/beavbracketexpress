// pages/Tournament.js
import React from 'react';
import { NavLink, Route, Router, useParams } from 'react-router-dom';
import Schedule from '../admin/schedule';
import PoolPlay from '../admin/poolplay';
import BronzeBracket from '../admin/editbronzebracket';
import SilverBracket from '../admin/editsilverbracket';
import GoldBracket from '../admin/editgoldbracket';
import './tab.css'; // For styling
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Tourtabs() {
    const { id } = useParams();
    const { data: tournament, error, mutate } = useSWR(`/api/tournaments/${id}`, fetcher);
    // const { path, url } = useRouteMatch();

    return (
        <div className="Tournament">
        <nav>
            <ul className="tabs">
            <li>
                <NavLink exact to={`/edittournament/schedule/${id}`} activeClassName="active-tab">
                Schedule
                </NavLink>
            </li>
            <li>
                <NavLink to={`/edittournament/pool-play/${id}`} activeClassName="active-tab">
                Pool Play
                </NavLink>
            </li>
            <li>
                <NavLink to={`/edittournament/bronze/${id}`} activeClassName="active-tab">
                Bronze Bracket
                </NavLink>
            </li>
            <li>
                <NavLink to={`/edittournament/silver/${id}`} activeClassName="active-tab">
                Silver Bracket
                </NavLink>
            </li>
            <li>
                <NavLink to={`/edittournament/gold/${id}`} activeClassName="active-tab">
                Gold Bracket
                </NavLink>
            </li>
            </ul>
        </nav>
        {/* <Router>
            <Route exact path={`/edittournament/schedule/${id}`} component={Schedule} />
            <Route path={`/edittournament/pool-play/${id}`} component={PoolPlay} />
            <Route path={`/edittournament/bronze/${id}`} component={BronzeBracket} />
            <Route path={`/edittournament/silver/${id}`} component={SilverBracket} />
            <Route path={`/edittournament/gold/${id}`} component={GoldBracket} />
        </Router> */}
        </div>
    );
}

export default Tourtabs;
