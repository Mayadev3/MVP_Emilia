import React, {useEffect, useState} from 'react';
import './App.css';
import CollabList from './components/CollabList';
import NewCollabForm from './components/NewCollabForm';
import LoginView from './components/LoginView';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useNavigate, Link, Outlet, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Local from './helpers/Local';
import Api from './helpers/Api';


export default function App() {
  const [collabs, setCollabs] = useState([]);
  const [user, setUser] = useState(Local.getUser());
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCollabs();
  }, []);


  async function getCollabs() {
    try {
        let response = await fetch('/collabs');
        if (response.ok) {
          let data = await response.json();
          const updatedData = data.map(item => {
            const { date, ...rest } = item;
            const newDate = new Date(date).toISOString().substring(0, 10);
            return { ...rest, date: newDate};
          });
        setCollabs(updatedData);

        } else {
            console.log(`Server error: ${response.status} ${response.statusText}`);
        }

    } catch (err) {
        console.log(`Server error: ${err.message}`);
    }
  }

    async function addCollab(collab) {

      if (collab.collab_id) {

          let options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collab)
        };
    
        try {
            let response = await fetch(`/collabs/${collab.collab_id}`, options);
            if (response.ok) {
                let data = await response.json();
                const updatedData = data.map(item => {
                  const { date, ...rest } = item;
                  const newDate = new Date(date).toISOString().substring(0, 10);
                  return { ...rest, date: newDate};
                });
                setCollabs(updatedData);
            } else {
                console.log(`Server error: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.log(`Server error: ${err.message}`);
        }

      } else {

        let options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collab)
        };

        try {
            let response = await fetch('/collabs', options);
            if (response.ok) {
                let data = await response.json();
                const updatedData = data.map(item => {
                  const { date, ...rest } = item;
                  const newDate = new Date(date).toISOString().substring(0, 10);
                  return { ...rest, date: newDate};
                });
                setCollabs(updatedData);
            } else {
                console.log(`Server error: ${response.status} ${response.statusText}`);
            }
        } catch (err) {
            console.log(`Server error: ${err.message}`);
        }
      }
    }

    async function editCollab(id, collab) {
      let options = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collab)
    };

    try {
        let response = await fetch(`/collabs/${id}`, options);
        if (response.ok) {
            let collabs = await response.json();
            setCollabs(collabs);
        } else {
            console.log(`Server error: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.log(`Server error: ${err.message}`);
    }
    }

    async function doLogin(u, e, p) {
      let myresponse = await Api.loginUser(u, e, p);
      if (myresponse.ok) {
        Local.saveUserInfo(myresponse.data.token, myresponse.data.user);
        setUser(myresponse.data.user);
        setLoginErrorMsg('');
        navigate('/');
      } else {
        setLoginErrorMsg('Login failed.');
      }
    }

    function doLogout() {
      Local.removeUserInfo();
      setUser(null);
      // (in demo, NavBar will sends user to home page, adjust here)
  }

  return (
    <div className="App">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous"
        />

          {/* <Navbar>
              <Container>
                <Navbar.Brand href="#home">Influencer Collaborations</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                  <Navbar.Text>
                    Signed in as: `${user.username}`
                  </Navbar.Text>
                </Navbar.Collapse>
              </Container>
          </Navbar> */}


          <h1>Influencer Collaborations</h1>

          <Routes>
                <Route path="/login" element={
                    <LoginView 
                      loginCb={(username, email, password) => doLogin(username, email, password) }
                      loginError={loginErrorMsg}
                    />   
                  } />

                <Route element={
                    <div>
                      <Outlet />
                      <CollabList 
                      editCb = {editCollab}
                      collabs = {collabs}
                      addCollabCb={addCollab}
                      />
                    </div>
                    } 
                  >
                        <Route path="/collabsform" element={
                          // <PrivateRoute>
                            <NewCollabForm 
                            addCollabCb={addCollab}
                            />
                          // </PrivateRoute>
                          } 
                        />
                </Route>
          </Routes>

    </div>
  );
}

