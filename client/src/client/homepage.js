//For the homepage
import { ConfigProvider, Button, Flex } from "antd";
import Navigation from '../components/navigation';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../App.css';
import React, {useState, useEffect} from 'react';
import { Modal } from 'antd';
import AddTour from '../admin/addtour';
import { useNavigate } from 'react-router-dom';

function Homepage(){

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

    const createTour = () => {
        Navigate(`/addtour/${tournamentName}`);
        setCreateModalOpen(false);
    }

    return (
        <div>
            <header>
                <h1>Welcome to Beaver Brackets!</h1>
                <p>Oregon State University Tennis Club's Official Website</p>
            </header>
            
            {/* <Flex justify='center' align='center'> */}
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