import React, { useState, useEffect} from 'react';
import '../App.css';
import useSWR from 'swr';
import { useParams, useNavigate  } from 'react-router-dom';
import { Dropdown, Space, Tabs, Modal, Spin } from 'antd';
import { DownOutlined, SyncOutlined } from '@ant-design/icons';
import { createRoot } from "react-dom/client";

const fetcher = (url) => fetch(url).then((res) => res.json());

function AddTour({tabName}) {
//   const tournamentId = useParams(); //Gets the tournamentId from the URL
  const { data: tournaments, error, mutate } = useSWR('/api/tournaments/', fetcher); //Fetch all tournaments
  const { id, tab } = useParams();
  const tournament = tournaments?.find(tour => tour.id === id);
  const [options, setOptions] = useState([]);
  const Navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [currOption, setCurrOption] = useState(tab.label); //for current option pointer
  const [deletekey, setDeleteKey] = useState('1');
  // const findtab = tournament?.tabs.find(tabs => tabs.label === tab);

  //to make sure page resets properly to default once reloaded
  useEffect(() => {
    const findtab = tournament?.tabs.find(tabs => tabs.label === tab);
    if (findtab) {
      setDeleteKey(findtab.key);
      setCurrOption(findtab.label);
  
      // Only navigate if the current URL doesn't already match the desired tab
      if (tab !== findtab.label) {
        Navigate(`/addtour/${id}/${findtab.label}`);
      }
    }
  }, [tab, tournament]);

  const removeEvent = async (e) => {       
    e.preventDefault();
    console.log(deletekey)
    if (deletekey === '1'){
      setOpenModal(false);
      return;
    }
    for (let i = deletekey-1; i<tournament.tabs.length; i++) {
      tournament.tabs[i].key -= 1
      tournament.tabs[i].key = tournament.tabs[i].key.toString();
    }

    tournament.tabs = tournament.tabs.filter(tabs => tabs.label !== currOption)
    
     //create a mountNode for the spinner
     const mountNode = document.createElement('div');
     document.body.appendChild(mountNode); //Append it to the body
     const root = createRoot(mountNode); 
 
     //Show the spinner while the request is in progress (the request needs some time before navigation)
     root.render(
        <Spin indicator = {<SyncOutlined spin/>} style = {{position: 'fixed', right: '51%', top: '44%', left: '49%', bottom: '56%' }} size="large"></Spin>,
        mountNode
     );
     try{
      const response = await fetch(`/api/tournaments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tabs: tournament.tabs }),
        });

      if (!response.ok) {
          throw new Error('Failed to add new tab');
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
         document.body.removeChild(mountNode);
      }, 2000); //2 seconds to show the spinner
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
        {tournament ? (tournament?.tabs.find(tabs => tabs.label === tab)?` ${tournament.name}: ${currOption}`: 'Tab not found') : 'Tournament not found'}
      </h1>
      
      <a id = 'dropdown'>
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
        // defaultActiveKey={'1'}
        activeKey={currOption? (tournament.tabs.find(t => t.label === currOption)?.key) : '1'}

        type="card"
        size="large"
        items = {tournament?.tabs.map((option) => ({
          label: option.label,
          key: option.key,
          children: `Content for ${option.label}`,
        }))}
        onChange = {(key)=>{
          const selectedTab = tournament.tabs.find(t => t.key === key);
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