import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './RegView.css';

export default function RegView(props) {
    const [username, setUsername] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword] = useState('');

    function handleChange(e) {
        let { name, value } = e.target;
        switch (name) {
            case 'usernameInput':
                setUsername(value);
                break;
            case 'emailInput':
                setEmail(value);
                break;
            case 'passwordInput':
                setPassword(value);
                break;
            default:
                break;
            }
        }

    function handleSubmit(e) {
        e.preventDefault();
        props.registrationCb(username, email, password)
    }


  return (
    <div className='RegView'>

        <h3>User Registration</h3>
        
        {
            props.registrationError && (
                <p className="alert alert-danger">{props.registrationError}</p>
            )
        }

        <Form onSubmit={handleSubmit}>

            <Form.Group className="mb-3" >
                <Form.Label>Username</Form.Label>
                <Form.Control 
                    type="text" 
                    name="usernameInput"
                    placeholder="Jane Doe"
                    required 
                    value={username}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                    type="email" 
                    name="emailInput"
                    placeholder="name@example.com" 
                    required
                    value={email}
                    onChange={handleChange}
                />
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label>Your password</Form.Label>
                <Form.Control 
                    type="password"
                    name="passwordInput" 
                    placeholder="your password" 
                    required
                    value={password}
                    onChange={handleChange}
                />
            </Form.Group>
            
            <div className='button'>
            <Button 
                type="submit"
                variant="secondary">
                Register
            </Button>
            </div>

        </Form>

    </div>
        
  )
}
