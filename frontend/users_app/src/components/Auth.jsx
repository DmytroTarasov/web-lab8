import { useState, useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Toast from 'react-bootstrap/Toast';

import { login, signup } from '../services/auth-service';

const loginFields = [
	{
		name: 'email',
		initialValue: '',
		type: Yup.string()
			.email('Please provide a valid email')
			.required('Email is required'),
	},
	{
		name: 'password',
		initialValue: '',
		type: Yup.string()
			.min(6, 'Must be at least 6 characters long')
			.required('Password is required'),
	},
];

const signupFields = [
	{
		name: 'name',
		initialValue: '',
		type: Yup.string().required('Name is required'),
	},
	{
		name: 'role',
		initialValue: '',
		type: Yup.string().equals(['user', 'admin']).required('Role is required'),
	},
	{
		name: 'group',
		initialValue: '',
		type: Yup.string().required('Group is required'),
	},
];

const Auth = () => {
	const navigate = useNavigate();
	const [birthdate, setBirthdate] = useState(new Date());
	const [authError, setAuthError] = useState(null);
	const [loginMode, setLoginMode] = useState(true);
	const [showToast, setShowToast] = useState(true);
	const [registerMessage, setRegisterMessage] = useState(null);

	const [fields, setFields] = useState(loginFields);
	const [initialValues, setInitialValues] = useState({
		email: '',
		password: '',
	});
	const [validationSchema, setValidationSchema] = useState(
		Yup.object({
			email: Yup.string()
				.email('Please provide a valid email')
				.required('Email is required'),
			password: Yup.string()
				.min(6, 'Must be at least 6 characters long')
				.required('Password is required'),
		})
	);

	useEffect(() => {
		setFields(loginMode ? loginFields : [...loginFields, ...signupFields]);
	}, [loginMode]);

	useEffect(() => {
		if (fields) {
			setInitialValues(
				Object.fromEntries(
					fields.map(field => [field.name, field.initialValue])
				)
			);
		}
	}, [fields]);

	useEffect(() => {
		if (fields) {
			setValidationSchema(
				Yup.object(
					Object.fromEntries(fields.map(field => [field.name, field.type]))
				)
			);
		}
	}, [fields]);

	const handleAuth = e => {
		e.preventDefault();
		handleSubmit(e);
	};

	const handleInputChange = e => {
		setAuthError(null);
		handleChange(e);
	};

	const switchLoginMode = () => setLoginMode(!loginMode);

	const toggleShowToast = () => setShowToast(!showToast);

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: values => {
			let authPromise;
			if (loginMode) {
				authPromise = login(values).then(res => {
					localStorage.setItem('token', res.data.token);
					navigate('/user-info');
				});
			} else {
				authPromise = signup({ ...values, birthdate }).then(res => {
					setRegisterMessage(res.data.message)
        });
			}
			authPromise
        .then(_ => resetForm())
				.catch(err => setAuthError(err.response.data.message))
				.finally(_ => setSubmitting(false));
		},
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
    resetForm
	} = formik;

	return (
		<div className='h-100 mx-auto d-flex align-items-center justify-content-center position-relative'>
			<Form className='w-25' onSubmit={handleAuth}>
				<h2 className='text-center mb-4'>{loginMode ? 'Login' : 'Register'}</h2>
				{fields &&
					initialValues &&
					validationSchema &&
					fields.map(({ name }, index) => (
						<Form.Group controlId={name} key={index}>
							<Form.Control
								className='mb-2'
								type={name !== 'password' ? 'text' : 'password'}
								name={name}
								placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
								value={values[name] || ''}
								onBlur={handleBlur}
								onChange={handleInputChange}
								isValid={touched[name] && !errors[name]}
							/>
							<Form.Text className='text-danger fw-semibold'>
								{touched[name] && errors[name] ? (
									<div className='mb-2'>{errors[name]}</div>
								) : null}
							</Form.Text>
						</Form.Group>
					))}
				{authError && (
					<div className='text-center bg-danger my-2 text-white py-1 rounded'>
						{authError}
					</div>
				)}

				{!loginMode && (
					<>
						<p className='text-muted mb-1'>Birthdate</p>
						<DatePicker
							className='w-100 rounded border-secondary border-opacity-25 mb-2'
							selected={birthdate}
							onChange={date => setBirthdate(date)}
						/>
					</>
				)}

				<div className='text-center'>
					<Button
						variant='secondary'
						type='submit'
						disabled={!(isValid && dirty) || isSubmitting || authError}
						style={{ height: '40px', width: '80px' }}
					>
						{!isSubmitting ? (
							loginMode ? (
								'Login'
							) : (
								'Register'
							)
						) : (
							<Spinner animation='border' size='sm' />
						)}
					</Button>
				</div>

				<div className='text-center'>
					<p className='my-1'>or</p>
					<button
						type='button'
						className='btn btn-link'
						onClick={switchLoginMode}>
						{loginMode ? 'Register' : 'Login'} instead
					</button>
				</div>
			</Form>

			{registerMessage && (
				<ToastContainer position='bottom-end' className='p-3'>
					<Toast
						show={showToast}
						onClose={toggleShowToast}
						bg='success'
						className='text-light fw-semibold'
						delay={3000}
						autohide>
						<Toast.Body>{registerMessage}</Toast.Body>
					</Toast>
				</ToastContainer>
			)}
		</div>
	);
};

export default Auth;
