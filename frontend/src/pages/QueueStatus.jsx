import React, { useState, useEffect} from 'react'
import QueueService from '../services/queue.service.js';
import { useParams } from 'react-router-dom';

function QueueStatus() {
    const {publicToken} = useParams();

    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState(null)

    useEffect(() => {
        const fetchQueueStatus = async () => {
            setLoading(true)
            try {
                const response = await QueueService.getQueuePosition(publicToken);
                setCustomer(response.data);
            } catch (error) {
                console.error("Error fetching queue status:", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchQueueStatus();
    }, []);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : customer ? (
                <div>
                    <h2>Queue Status</h2>
                    <p>Name: {customer.name}</p>
                    <p>Token Number: {customer.token_number}</p>
                    <p>Position: {customer.position}</p>
                    <p>People Ahead: {customer.people_ahead}</p>
                </div>
            ) : (
                <p>Customer not found.</p>
            )}
        </div>
    )
}

export default QueueStatus
