//For the homepage
import { ConfigProvider, Button, Flex, Spin } from "antd";
import Navigation from '../components/navigation';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../App.css';
import React, {useState, useEffect} from 'react';
import { Modal } from 'antd';
import {SyncOutlined} from '@ant-design/icons';
import AddTour from '../admin/addtour';
import { useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
// import ReactDOM from 'react-dom';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const fetcher = (url) => fetch(url).then((res) => res.json());

function Homepage(){
    const { data: tournaments, error, mutate } = useSWR('/api/tournaments', fetcher);
    const [joinButtonType, setJoinButtonType] = useState('default');
    const [addButtonType, setAddButtonType] = useState('default');

    //For the modals
    const [clickCreate, setClickCreate] = useState(false)
    const [login, checkLogin] = useState(false) 
    const [username, checkUser] = useState()
    const [password, checkPassword] = useState()
    const [createModalOpen, setCreateModalOpen] = useState(true)
    const [tournamentName, setTournamentName] = useState()

    const Navigate = useNavigate();

    const setCreateTrue = () => {
        setClickCreate(true);
    }

    const createOk = () => {
        // setModalOpen(false);
        setCreateModalOpen(false);
        setClickCreate(false);
        checkUser("")
        checkPassword("")
    }

    const loginForm = () => {
        if (username === "admin" && password === "tennis"){
            setClickCreate(false);
            setCreateModalOpen(true);
            checkLogin(true);
        }
        else
            setClickCreate(false);
        checkUser("")
        checkPassword("")
    }

    //For button hover styling
    useEffect(() => {
        $('#createTourButton').on('mouseenter',function() {
           setJoinButtonType('primary')
        });
        
        $('#createTourButton').on('mouseleave',function() {
            setJoinButtonType('default')
        });

        $('#joinTourButton').on('mouseenter',function() {
            setAddButtonType('primary')
         });
         
         $('#joinTourButton').on('mouseleave',function() {
            setAddButtonType('default')
         });
        

    }, []);

    // Function for submitting the tournament creation
    const createTour = async (e) => {       
        e.preventDefault();
    
        const newTournament = {
            id: uuidv4(),
            name: tournamentName,
            tabs: [{label: "Schedule", key: '1'}]};
      
        //Reval the SWR cache
        setCreateModalOpen(false);

     //Dynamically create a mountNode for the spinner
     const mountNode = document.createElement('div');
     document.body.appendChild(mountNode); //Append it to the body
     const root = createRoot(mountNode); 
 
     //Show the spinner while the request is in progress (the request needs some time before navigation)
     root.render(
        <Spin indicator = {<SyncOutlined spin/>} style = {{position: 'fixed', right: '51%', top: '44%', left: '49%', bottom: '56%' }} size="large"></Spin>,
        mountNode
     );
     
     try {
         // Submit the new tournament
         const response = await fetch('/api/tournaments', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(newTournament),
         });
 
         if (!response.ok) {
             throw new Error('Failed to add tournament');
         }
     } 
     catch (error) {
         console.error(error);
     } 
     finally{
        //set a short delay before navigating to ensure spinner is shown
        setTimeout(() => {
            //remove the spinner
            root.unmount();
            document.body.removeChild(mountNode); //clean dom
            Navigate(`/addtour/${newTournament.id}/Schedule`);
        }, 2000); //2 seconds to show the spinner

    }}

    return (
        <div> 
            <label style={{fontSize: 1}}>joseph kim</label>
            <header>
                <h1>Welcome to Beaver Brackets!</h1>
                <p>Oregon State University Tennis Club's Official Website</p>
            </header>
            
            <div class = 'container'>
            <ul className='button'>
                <Button className='custom-button' id = 'createTourButton' type = {joinButtonType} onClick = {setCreateTrue} shape = 'round'>Create a tournament</Button>
                <Button className='custom-button' id = 'joinTourButton' type = {addButtonType} href = "/jointour" shape = 'round'>Join a tournament</Button>
            </ul>
            </div>

            <Modal title = "Login" open = {clickCreate} centered = {true} onOk = {loginForm} onCancel={createOk} okText = "Login">
                <input type = "text" placeholder = "Username" value = {username} onChange={(e) => checkUser(e.target.value)}/>
                <br></br>
                <input type = "text" placeholder = "Password" value = {password} onChange={(e) => checkPassword(e.target.value)}/>
            </Modal>
            {/* open or not depending on login - if login is True, it will open */}
            <Modal open={login && createModalOpen} onCancel={createOk} okText = "Create Tournament" onOk={createTour} centered = {true}><h1>Enter Tournament Name Below</h1>
                <input required = {true} type = "text" placeholder = "Tournament Name" value = {tournamentName} onChange={(e) => setTournamentName(e.target.value)}/>
            </Modal>
        </div>     
    )
}

export default Homepage;