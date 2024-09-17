import React, {useState, useEffect} from 'react';
import './addeventcomp/addevent.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Divider, Input, Button, Upload, message } from 'antd';
import { UploadOutlined} from '@ant-design/icons';
import { HiChevronDoubleDown } from "react-icons/hi";
import AddTour from './addtour';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function AddEvent(){
    const { data: tournaments, error, mutate } = useSWR('/api/tournaments/', fetcher);
    const {id} = useParams();
    const tournament = tournaments?.find(tour => tour.id === id);
    const Navigate = useNavigate();
    const [filename, setFileName] = useState('')
    const [fileData, setFileData] = useState(null) //to store file contents in a state

    const [eventName, setEventName] = useState('')
    const [selectedButton1, setSelectedButton1] = useState(false)
    const [selectedButton2, setSelectedButton2] = useState(false)
    const [selectedButton3, setSelectedButton3] = useState(false)

    const props = {
        name: 'file',
        accept: '.csv, .xls, .xlsx', //Accepts only CSV and Excel files
        showUploadList: false,       //Hides the list of uploaded files
        beforeUpload: (file) => {
          const isCSVorExcel =
            file.type === 'application/vnd.ms-excel' || //.xls
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || //.xlsx
            file.type === 'text/csv'; //.csv
    
          if (!isCSVorExcel) {
            message.error(`${file.name} is not a valid file type.`);
            return Upload.LIST_IGNORE; //Prevent upload process
          }
    
          //read the file contents here
          const reader = new FileReader();
          reader.onload = (e) => {
            const fileContents = e.target.result;
            setFileData(fileContents); //store file contents in state
            console.log(fileContents); //this is just to make sure it went through (delete later)
          };
    
          reader.readAsText(file); //For CSV files for now... Excel, we should figure out later
    
          //Return false to prevent automatic upload CHANGE depending on if we want to process first or not for bracket/pool play
          return false;
        },
        onChange(info) {
          setFileName(info.file.name);//display file name
        },
      };
    
    // Function for updating tabs (creating new tab)
    const createEvent = async (e) => {       
        e.preventDefault();
        const tab = tournament.tabs.find(tabs => tabs.label === eventName);
        //what do I want for the data of a new tab? depends on single, double, or pool
        const newTab = {label: eventName, key: tournament.tabs.length+1}; // type: , data: also need to be a part of a newTab
        
        //if tab is found (already exists)
        if(tab !== undefined || eventName == ''){
            Navigate(`/addtour/${id}/schedule`);
            return;
        }

        tournament.tabs.push(newTab);

        const response = await fetch(`/api/tournaments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tabs: tournament.tabs }),
          });

        if (!response.ok) {
            throw new Error('Failed to add new tab');
        }

        Navigate(`/addtour/${id}/schedule`);
        
        return (
            <AddTour tabName={eventName}/>
            //(eventName and eventtype, along with the data in the csv or excel file parsed onto bracket if single or double elim)
        );

    };

    if (error) return <div>Failed to load tournaments</div>;
    if (!tournaments) return <div>Loading...</div>;

    return(
        <div>
            <Form
                name="eventForm"
                initialValues={{ remember: true }}
                onFinish={createEvent}
                // onFinishFailed={submitFailed}
                autoComplete="off"
            >
                <Divider id = 'borderon'> Event Name</Divider>
                <Form.Item
                    name="eventName"
                    rules={[{ required: true, message: 'Event name cannot be empty!' }]}
                >
                    <Input
                    size="large"
                    placeholder="Event Name"
                    id = 'nameinput'
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    />
                </Form.Item>

                <Divider id = 'borderoff'>
                    <HiChevronDoubleDown id = 'downbutton' />
                </Divider>
                <Divider id = 'borderon'>Event Type</Divider>
                <Form.Item>
                    <Button.Group id = 'buttonGroup'>
                    <Button
                        id = 'eventtype'
                        onClick={() => {
                        setSelectedButton1(true);
                        setSelectedButton2(false);
                        setSelectedButton3(false);
                        }}
                        type={selectedButton1 ? 'primary' : 'default'}
                    >
                        Single Elimination
                    </Button>
                    <Button
                        id = 'eventtype'
                        onClick={() => {
                        setSelectedButton2(true);
                        setSelectedButton1(false);
                        setSelectedButton3(false);
                        }}
                        type={selectedButton2 ? 'primary' : 'default'}
                    >
                        Double Elimination
                    </Button>
                    <Button
                        id = 'eventtype'
                        onClick={() => {
                        setSelectedButton3(true);
                        setSelectedButton2(false);
                        setSelectedButton1(false);
                        }}
                        type={selectedButton3 ? 'primary' : 'default'}
                    >
                        Pool Play
                    </Button>
                    </Button.Group>
                </Form.Item>

                <Divider id = 'borderoff'>
                    <HiChevronDoubleDown id = 'downbutton' />
                </Divider>
                <Divider id = 'borderon'>
                    Players List (CSV/Excel): {filename || 'No file chosen'}
                </Divider>
                <Form.Item>
                    <Upload {...props} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>

                <Divider id = 'borderoff'>
                    <HiChevronDoubleDown id = 'downbutton' />
                </Divider>
                <Form.Item >
                    <Button id = 'submitbutton' type="primary" htmlType="submit" onClick={createEvent}>
                    Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddEvent;