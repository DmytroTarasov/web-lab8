import React, { useState, useEffect } from 'react';
import {
	Card,
	Button,
	ButtonGroup,
	Spinner,
	Toast,
	ToastContainer,
} from 'react-bootstrap';
import dateFormat from 'dateformat';
import { useNavigate } from 'react-router-dom';

import { getProfileInfo, deleteProfile } from '../services/auth-service';
import EditProfile from './EditProfile';

const UserInfo = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [show, setShow] = useState(false);
	const [deleteMessage, setDeleteMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [showToast, setShowToast] = useState(true);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      getProfileInfo()
        .then(res => setUser(res.data))
        .finally(() => setLoading(false));
    }
	}, []);

	const updateUser = user => setUser(user);

	const toggleShowToast = () => setShowToast(!showToast);

	const deleteUserProfile = () => {
		const token = localStorage.getItem('token');
    if (token) {
      setLoading(true);
      deleteProfile()
        .then(res => {
          setDeleteMessage(res.data.message);
          localStorage.removeItem('token');
          navigate('/');
        })
        .finally(() => setLoading(false));
    }
	};

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

	return (
		<div className='w-25 h-100 mx-auto d-flex align-items-center justify-content-center'>
			{user ? (
				<>
					<Card className='w-100' border='info'>
						<Card.Body>
							<Card.Title>User information</Card.Title>
							{Object.keys(user).map((key, index) => (
								<Card.Text key={index} className='mb-1'>
									{key}:{' '}
									{key !== 'birthdate'
										? user[key]
										: dateFormat(user[key], 'mmmm dS, yyyy')}
								</Card.Text>
							))}
							<ButtonGroup className='w-100 mt-4'>
								<Button className='w-50' variant='success' onClick={handleShow}>
									Edit
								</Button>
								<Button
									className='w-50'
									variant='danger'
									onClick={deleteUserProfile}>
									{!loading ? (
										'Delete'
									) : (
										<Spinner animation='border' size='sm' />
									)}
								</Button>
                <Button className='w-50' variant='info' onClick={logout}>
									Logout
								</Button>
							</ButtonGroup>
						</Card.Body>
					</Card>

					<EditProfile
						show={show}
						handleClose={handleClose}
						user={user}
						updateUser={user => updateUser(user)}
					/>

					{deleteMessage && (
						<ToastContainer position='bottom-end' className='p-3'>
							<Toast
								show={showToast}
								onClose={toggleShowToast}
								bg='success'
								className='text-light fw-semibold'
								delay={3000}
								autohide
							>
								<Toast.Body>{deleteMessage}</Toast.Body>
							</Toast>
						</ToastContainer>
					)}
				</>
			) : (
        loading ? (<Spinner animation='border' variant='secondary' />) : (<h1>Access denied</h1>)
			)}
		</div>
	);
};

export default UserInfo;
