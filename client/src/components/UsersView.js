import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import './UsersView.css';

export default function UsersView(props) {
    

  return (
    <div className='UsersView'>

        <div className='usersTable'>
            <table class="table" size="sm">
                    <thead>
                        <tr>
                            <th scope="col">id</th>
                            <th scope="col">username</th>
                            <th scope="col">email</th>
                            <th scope="col">rights</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.users.map(user => (
                            <tr>
                                <th scope="row">{user.id}</th>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin}</td>
                                <td>
                                    <button onClick={(e) => props.makeAdminCb(user.id)} type="button">
                                        make admin
                                    </button>
                                </td>
                                <td>
                                    <button onClick={(e) => props.deleteUserCb(user.id)} type="button">
                                        delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
            </table>
        </div>
    </div>
        
  )
}
