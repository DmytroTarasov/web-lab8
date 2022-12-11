import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './components/Auth';
import UserInfo from './components/UserInfo';

function App() {
	return (
		<div className='vh-100'>
			<Router>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/user-info' element={<UserInfo />} />
          <Route path='*' element={<Navigate to='user-info' />} />
        </Routes>
      </Router>
		</div>
	);
}

export default App;
