//For joining the tournament
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
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
    try {
      await fetch(`/api/tournaments/${id}`, {
        method: 'DELETE',
      });
      // Revalidate SWR cache or update local state
      mutate('/api/tournaments');
    } catch (error) {
      console.error("Failed to delete tournament:", error);
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
            <Link to={`/addtour/${tournament.id}/schedule`} id="edittournaments">
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
