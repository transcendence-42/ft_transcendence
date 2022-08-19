import React from "react";
import {Routes, Route} from 'react-router-dom';
import './Home.css';
import EmailAuth from './emailAuth';
import SchoolAuth from './schoolAuth';

export default function Home () {
    return (
        <div>
            <EmailAuth />
            <SchoolAuth />
        </div>
    )
}