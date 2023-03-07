import React, {useEffect, useState} from 'react';
import { Route, Routes, useNavigate, Link, Outlet, useParams } from 'react-router-dom';

import './App.css';
import CollabList from './components/CollabList';
import NewCollabForm from './components/NewCollabForm';
import LoginView from './components/LoginView';
import RegView from './components/RegView';
import ErrorView from './components/ErrorView';
import UsersView from './components/UsersView';
import PrivateRoute from './components/PrivateRoute';

import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';

import Local from './helpers/Local';
import Api from './helpers/Api';


export default function App() {
  const [collabs, setCollabs] = useState([]);
  const [user, setUser] = useState(Local.getUser());
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [registrationErrorMsg, setRegistrationErrorMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCollabs();
    getUsers();
  }, [user]);

  async function getUsers() {
    let options = {
      method: 'GET',
      headers: {},
    };

    let token = Local.getToken();
        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }
    
    try {
        let response = await fetch('/users/users', options);
        if (response.ok) {
          let users = await response.json();
          setUsers(users);
        } else {
          console.log(`Server error: ${response.status} ${response.statusText}`)
        }
      } catch (err) {
        console.log(`Server error: ${err.message}`);
      }
  }

  async function getCollabs() {
        let myresponse = await Api.getCollabs();
        if (myresponse.ok) {
              let data = myresponse.data;
              const updatedData = data.map(item => {
                const { date, ...rest } = item;
                const newDate = new Date(date).toISOString().substring(0, 10);
                return { ...rest, date: newDate};
              });
              setCollabs(updatedData);
        } else {
            console.log(`Server error: ${myresponse.status} ${myresponse.statusText}`);
        }    
  }

  async function addCollab(collab) {
      if (collab.collab_id) {
          let options = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(collab)
          };

      let token = Local.getToken();
              if (token) {
                  options.headers['Authorization'] = 'Bearer ' + token;
              }
          
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
              let token = Local.getToken();
              if (token) {
                  options.headers['Authorization'] = 'Bearer ' + token;
              }
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
        navigate('/collabs');
      } else {
        setLoginErrorMsg('Login failed.');
      }
    }

  async function doRegistration(u, e, p) {
      let myresponse = await Api.registerUser(u, e, p);
      if (myresponse.ok) {
        doLogin(u, e, p)
        setRegistrationErrorMsg('');
      } else {
        setRegistrationErrorMsg('Registration failed.');
      }
    }

  function doLogout() {
      Local.removeUserInfo();
      setUser(null);
      setActive(false);
      setUsers([]);
      navigate('/login');
    }

  function toggleActive() {
    setActive(!active);
  }

  async function deleteUser(id) {
    let options = {
          method: 'DELETE',
          headers: {}
        }

    let token = Local.getToken();
        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }
    
    try {
        let response = await fetch(`/users/users/${id}`, options);
        if (response.ok) {
          let updatedUsers = await response.json();
          setUsers(updatedUsers);
        } else {
          console.log(`Server error: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.log(`Server error: ${err.message}`);
    }
  }

  async function makeAdmin(id) {
    let options = {
          method: 'PUT',
          headers: {}
        }

    let token = Local.getToken();
        if (token) {
            options.headers['Authorization'] = 'Bearer ' + token;
        }
    
    try {
        let response = await fetch(`/users/users/${id}`, options);
        if (response.ok) {
          let updatedAdmins = await response.json();
          setUsers(updatedAdmins);
        } else {
          console.log(`Server error: ${response.status} ${response.statusText}`);
        }
    } catch (err) {
        console.log(`Server error: ${err.message}`);
    }
  }

  return (
    <div className="App">
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
          crossorigin="anonymous"
        />

          <Routes>
                <Route path="/login" element={
                  <div>
                    <h1>Influencer Collaborations</h1>
                    <div className='authGrid' >
                        <div className='authItem1'>
                        <LoginView 
                            loginCb={(username, email, password) => doLogin(username, email, password) }
                            loginError={loginErrorMsg}
                          />
                        </div>
                          
                        <div className='authItem2'>
                          <RegView 
                            registrationCb={(username, email, password) => doRegistration(username, email, password) }
                            registrationError={registrationErrorMsg}
                          />
                        </div>
                    </div>
                  </div>  
                  } 
                />
                
                <Route path="/collabs" element={
                    <PrivateRoute>
                      <div>
                          <div className='mainHeader'>
                            <h2>Influencer Collaborations</h2>
                            <div className='mainHeaderBtn'>
                                { user && <p>User: {user.username}</p> }

                                { 
                                  user && +user.isAdmin === +1 
                                  ? <div>
                                        <Button onClick={ toggleActive } variant="secondary">
                                          manage users
                                        </Button>
                                    </div>
                                  : null
                                }

                                <div>
                                    <Button onClick={ doLogout } variant="secondary">
                                      Logout
                                    </Button>
                                </div>
                          </div>
                      </div>

                        {
                          active 
                          ? <UsersView 
                                users = { users } 
                                deleteUserCb = { deleteUser }
                                makeAdminCb = { makeAdmin }
                            />
                          : null
                        }

                        { 
                          user && +user.isAdmin === +1 
                          ? <NewCollabForm addCollabCb={addCollab} />
                          : null
                        }
                        
                        <CollabList 
                              editCb = {editCollab}
                              collabs = {collabs}
                              addCollabCb={addCollab}
                              user = {user}
                        />
                        
                      </div>
                    </PrivateRoute>
                  } 
                />

                <Route path="*" element={<ErrorView code="404" text="Page not found" />} />
          </Routes>

    </div>
  );
}

