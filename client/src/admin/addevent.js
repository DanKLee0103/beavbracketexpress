import React, {useState, useEffect} from 'react';
import './addeventcomp/addevent.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Divider, Input, Button, Upload, message } from 'antd';
import { UploadOutlined} from '@ant-design/icons';
import { HiChevronDoubleDown } from "react-icons/hi";
import AddTour from './addtour';
import useSWR from 'swr';
import MakeBracket from '../components/bracket';
import Controller from './addeventcomp/controller';

const fetcher = (url) => fetch(url).then((res) => res.json());

function AddEvent(){
    const { data: tournaments, error, mutate } = useSWR('/api/tournaments/', fetcher);
    const {id} = useParams();
    const tournament = tournaments?.find(tour => tour.id === id);
    const Navigate = useNavigate();
    const [filename, setFileName] = useState('')
    const [fileData, setFileData] = useState(null) //to store file contents in a state

    const [eventName, setEventName] = useState('');
    const [eventType, setEventType] = useState('');
    const [fileRead, setFileRead] = useState(false);
    // const [selectSingle, setSingle] = useState(false)
    // const [selectDouble, setDouble] = useState(false)
    // const [selectPool, setPool] = useState(false)

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
            console.log(fileContents)
            setFileData(fileContents); //store file contents in state
            setFileRead(true);
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
        const data = <MakeBracket/>
        //what do I want for the data of a new tab? depends on single, double, or pool
        const newTab = {label: eventName, key: (tournament.tabs.length + 1).toString(), type: eventType, data: data}; //type: , data: also need to be a part of a newTab
        
        //if tab is found (already exists)
        if(tab !== undefined){
            message.error("Error! Tab already exists!");
            Navigate(`/addtour/${id}/Schedule`);
            return;
        }

        if(eventName === '' || eventType === '' || fileRead === false){
            message.error("Error! Event Name, Type, or File Not Selected!");
            Navigate(`/addtour/${id}/Schedule`);
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

        Navigate(`/addtour/${id}/Schedule`);
        
        return (
            <div>
                <AddTour tabName={eventName} />
                <Controller eventType={eventType} data={}/>
            </div>
            //(eventName and eventtype, along with the data in the csv or excel file parsed onto bracket if single or double elim)
        );

    };

    if (error) return <div>Failed to load events</div>;
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
                            setEventType('single');
                        }}
                        type={eventType === 'single' ? 'primary' : 'default'}
                    >
                        Single Elimination
                    </Button>
                    <Button
                        id = 'eventtype'
                        onClick={() => {
                            setEventType('double');
                        }}
                        type={eventType === 'double' ? 'primary' : 'default'}
                    >
                        Double Elimination
                    </Button>
                    <Button
                        id = 'eventtype'
                        onClick={() => {
                            setEventType('pool');
                        }}
                        type={eventType === 'pool' ? 'primary' : 'default'}
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