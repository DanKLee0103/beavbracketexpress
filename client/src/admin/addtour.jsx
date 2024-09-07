import React, {useState} from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import { Dropdown, Space, Segmented, Flex } from 'antd';
import { DownOutlined } from '@ant-design/icons';


const fetcher = (url) => fetch(url).then((res) => res.json());

function AddTour(){
    const [options, setOptions] = useState(['hello', 'hi'])
    const { error, mutate } = useSWR('/api/tournaments', fetcher);
    const {tournamentName} = useParams(); //gets the last part of endpoint

    const items = [
        {
            key: '1',
            label: (
            <a href={`/addevent/${tournamentName}`}>
                Add Event
            </a>
            ),

        },
        {
            key: '2',
            label: (
            <a href={`/removeEvent/${tournamentName}`}>
                Remove Event
            </a>
            ),

        },
        {
            key: '3',
            label: (
            <a href={`/verifytime/${tournamentName}`}>
                Verify Time
            </a>
            ),

        },
    ];
    //list of current tournaments listed here
    
    //need to add event, remove event, time verify between all events
    return (
        <div>
            <h1 style = {{textAlign: 'left', paddingLeft: '100px'}}>{tournamentName}</h1>
            <a style={{position: 'absolute', top: 40, right: 200}}>
                <Dropdown placement="bottom" menu={{items}}>  
                    <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        Edit
                        <DownOutlined />
                    </Space>
                    </a>
                </Dropdown>
            </a>
            <Segmented
                style={{position: 'absolute', bottom: 120, left: 100, controlHeightLG: 60}}
                size = "large"
                controlHeightLG = '60'
                options={options}
            />
        </div>
    )
}

export default AddTour;