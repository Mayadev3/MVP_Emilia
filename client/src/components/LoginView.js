import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function LoginView(props) {
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
        props.loginCb(username, email, password)
    }



  return (
    <div className='LoginView'>
        <h2>User Login</h2>

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
            
            <Button 
                type="submit"
                variant="secondary">
                Log in
            </Button>

        </Form>

    </div>
        
  )
}
