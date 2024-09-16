import React, { useState, useEffect} from 'react';
import useSWR from 'swr';
import { useParams, useNavigate  } from 'react-router-dom';
import { Dropdown, Space, Tabs, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import RemoveEvent from './removeEvent';

const fetcher = (url) => fetch(url).then((res) => res.json());

function AddTour({tabName}) {
//   const tournamentId = useParams(); //Gets the tournamentId from the URL
  const { data: tournaments, error, mutate } = useSWR('/api/tournaments/', fetcher); //Fetch all tournaments
  const { id, tab } = useParams();
  const tournament = tournaments?.find(tour => tour.id === id);
  const [options, setOptions] = useState([]);
  const Navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [currOption, setCurrOption] = useState(tab); //for current option pointer
  const [deletekey, setDeleteKey] = useState();
  const findtab = tournament?.tabs.find(tabs => tabs.label === tab);

  const removeEvent = async (e) => {       
    e.preventDefault();
    if (deletekey === 1){
      setOpenModal(false);
      return;
    }
    for (let i = deletekey-1; i<tournament.tabs.length; i++) {
      tournament.tabs[i].key -= 1
    }

    tournament.tabs = tournament.tabs.filter(tabs => tabs.label !== currOption)
    
    const response = await fetch(`/api/tournaments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabs: tournament.tabs }),
      });

    if (!response.ok) {
        throw new Error('Failed to add new tab');
    }

    setCurrOption('Schedule');
    Navigate(`/addtour/${id}/Schedule`);
    setOpenModal(false);
};

  const items = [
    {
      key: '1',
      label: (
        <a href={`/addevent/${id}`}>
          Add Event
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <label onClick = {()=>setOpenModal(true)}>
          Remove Event
        </label>
      ),
    },
    {
      key: '3',
      label: (
        <a href={`/verifytime/${id}`}>
          Verify Time
        </a>
      ),
    },
  ];

  // Error handling
  if (error) return <div>Failed to load tournaments</div>;
  if (!tournaments) return <div>Loading...</div>;

  return (
    <div>
      {/* Display tournament name */}
      <h1 style={{ textAlign: 'left', paddingLeft: '100px' }}>
        {tournament ? (findtab?` ${tournament.name}: ${currOption}`: 'Tab not found') : 'Tournament not found'}
      </h1>
      
      <a style={{ position: 'absolute', top: 40, right: 200 }}>
        <Dropdown placement="bottom" menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              Edit
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </a>
      <Tabs
        tabBarStyle = {{height: 50}}
        style={{ position: 'absolute', bottom: 110, left: 100 }}
        defaultActiveKey={1}
        // activeKey={findtab? findtab.key: null}
        type="card"
        size="large"
        items = {tournament?.tabs.map((option) => ({
          label: option.label,
          key: option.key,
          children: `Content for ${option.label}`,
        }))}
        onTabClick = {(key)=>{
          const selectedTab = tournament.tabs.find((tab, idx) => idx+1 === parseInt(key));
          if(selectedTab){
            const tablabel = selectedTab.label;
            setDeleteKey(selectedTab.key)
            setCurrOption(tablabel);
            Navigate(`/addtour/${id}/${tablabel}`)
          }}}
      />

        <Modal title = "Proceed With Caution!!!" open = {openModal} centered = {true} onOk = {removeEvent} onCancel={()=>setOpenModal(false)} okText = "Delete">
          Would you really like to delete this event?
        </Modal>
    </div>
  );
}

export default AddTour;