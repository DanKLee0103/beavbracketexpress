//For joining the tournament
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createRoot } from "react-dom/client";
import { Modal, Button, Spin } from 'antd';
import {DeleteOutlined, SyncOutlined} from '@ant-design/icons';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function JoinTour() {
  const { data: tournaments, error, mutate } = useSWR('/api/tournaments', fetcher);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Open modal with specific tournament ID
  const openModal = (id) => {
    setSelectedTournamentId(id);
    setIsModalOpen(true);
  };

  //close modal
  const closeModal = () => {
    setSelectedTournamentId(null);
    setIsModalOpen(false);
  };

  // Function to delete a tournament
  const deleteTournament = async (id) => {
    const mountNode = document.createElement('div');
     document.body.appendChild(mountNode); //Append it to the body
     const root = createRoot(mountNode); 
 
     //Show the spinner while the request is in progress (the request needs some time before navigation)
     root.render(
        <Spin indicator = {<SyncOutlined spin/>} style = {{position: 'fixed', right: '51%', top: '44%', left: '49%', bottom: '56%' }} size="large"></Spin>,
        mountNode
     );
    try {
      await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE',
      });
      // Revalidate SWR cache or update local state
    } catch (error) {
      console.error("Failed to delete tournament:", error);
    }
    finally{
      //set a short delay before navigating to ensure spinner is shown
       setTimeout(() => {
          //remove the spinner
          mutate(`/api/tournaments/${id}`);
          root.unmount();
          document.body.removeChild(mountNode); // Clean up the DOM
       }, 2000); //2 seconds to show the spinner
     }  
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Want To Join A Tournament?</h1>
      <h3>Click on any of the tournaments below!</h3>
      <ul id="tournaments">
        {Array.isArray(tournaments) && tournaments.map((tournament) => (
          <li key={tournament.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <Link to={`/addtour/${tournament.id}/Schedule`} id="edittournaments">
              <h1>{tournament.name}</h1>
            </Link>
            <Button onClick={() => openModal(tournament.id)} icon={<DeleteOutlined />}/>
            {selectedTournamentId === tournament.id && (
              <Modal
                title="Proceed With Caution!!!"
                open={isModalOpen}
                centered={true}
                okText="Delete"
                okType = "danger"
                onOk={()=>deleteTournament(tournament.id)}
                onCancel={closeModal}
              >
                <p>Would you really like to delete this tournament?</p>
              </Modal>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JoinTour;
