import { useState } from 'react';
import { Form, Button, Spinner, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';

import { editProfileInfo } from '../services/auth-service';

const EditProfile = ({ user, show, handleClose, updateUser }) => {
	const [error, setError] = useState(null);
	const [birthdate, setBirthdate] = useState(new Date(user.birthdate));
  const formValues = { ...user, password: '' };

	const handleEditProfile = e => {
		e.preventDefault();
		handleSubmit(e);
	};

	const handleInputChange = e => {
		setError(null);
		handleChange(e);
	};

	const formik = useFormik({
		initialValues: formValues,
		validationSchema: Yup.object({
			email: Yup.string()
				.email('Please provide a valid email')
				.required('Email is required'),
			password: Yup.string()
				.min(6, 'Must be at least 6 characters long')
				.required('Password is required'),
			name: Yup.string().required('Name is required'),
			group: Yup.string().required('Group is required'),
			role: Yup.string().equals(['user', 'admin']).required('Role is required'),
		}),
		onSubmit: values => {
      const token = localStorage.getItem('token');

      if (token) {
        editProfileInfo({ ...values, birthdate })
        .then(res => {
          updateUser(res.data);
          resetForm();
          handleClose();
        })
        .catch(err => setError(err.response.data.message))
        .finally(_ => setSubmitting(false));
      }
		},
    enableReinitialize: true
	});

	const {
		handleSubmit,
		handleChange,
		handleBlur,
		values,
		touched,
		isValid,
		dirty,
		errors,
		isSubmitting,
		setSubmitting,
		resetForm,
	} = formik;

	return (
		<Modal show={show} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>Edit profile</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form className='w-75 mx-auto' onSubmit={handleEditProfile}>
					{Object.keys(formValues)
						.filter(key => key !== 'birthdate')
						.map((value, index) => (
							<Form.Group controlId={value} key={index}>
								<Form.Control
									className='mb-2'
									type={value !== 'password' ? 'text' : 'password'}
									name={value}
									placeholder={value.charAt(0).toUpperCase() + value.slice(1)}
									value={values[value]}
									onBlur={handleBlur}
									onChange={handleInputChange}
									isValid={touched[value] && !errors[value]}
								/>
								<Form.Text className='text-danger fw-semibold'>
									{touched[value] && errors[value] ? (
										<div className='mb-2'>{errors[value]}</div>
									) : null}
								</Form.Text>
							</Form.Group>
						))}
					{error && (
						<div className='text-center bg-danger my-2 text-white py-1 rounded'>
							{error}
						</div>
					)}

					<>
						<p className='text-muted mb-1'>Birthdate</p>
						<DatePicker
							className='w-100 rounded border-secondary border-opacity-25 mb-2'
							selected={birthdate}
							onChange={date => setBirthdate(date)}
						/>
					</>

					<div className='text-center'>
						<Button
							variant='primary'
							type='submit'
							disabled={!(isValid && dirty)|| isSubmitting || error}
							style={{ height: '40px', width: '150px' }}
						>
							{!isSubmitting ? (
								'Save changes'
							) : (
								<Spinner animation='border' size='sm' />
							)}
						</Button>
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default EditProfile;
