import React, { useState } from "react";
import NewCollabForm from "./NewCollabForm";
import Table from 'react-bootstrap/Table';
import "./CollabList.css";

function CollabList(props) {

    const headers = [
        {name: "Influencer name", id: "influencer_name", type:"string", width: "7"},
        {name: "handle", id: "handle", type:"string", width: "5"},
        {name: "platform", id: "platform", type:"string", width: "5"},
        {name: "date", id: "date", type:"date", format: "yyyy-MM-dd" , width: "5"},
        {name: "brief", id: "brief", type:"int", width: "3"},
        {name: "collaboration status", id: "status_collab", type:"string", width: "5"},
        {name: "followers", id: "followers", type:"int", width: "5"},
        {name: "price (ex VAT)", id: "price_ex_vat", type:"int", width: "5"},
        {name: "ig post", id: "ig_post", type:"boolean", width: "5"},
        {name: "ig story", id: "ig_story", type:"boolean", width: "5"},
        {name: "boosted content", id: "boosted", type:"boolean", width: "5"},
        {name: "comments", id: "comments", type:"text", width: "9"},
        {name: "country code", id: "country_code", type:"text", width: "5"},
    ]

    const [editingId, setEditingId] = useState(null);
    const [editedCollab, setEditedCollab] = useState(null);

    async function handleEditClick(id) {
        setEditingId(id);
        setEditedCollab(props.collabs.find((c) => c.collab_id === id));
    }

    return (
        <Table hover size="sm" responsive className="CollabList">
          <thead>
            <tr className="Headers">
              <p></p>
              {headers.map(header => (
                <th key={header.name}>{header.name}</th>
              ))}
            </tr>
          </thead>
      
          <tbody>
            {props.collabs.map(c => (
              c.collab_id === editingId 
              ? (
                <tr key={c.collab_id}>
                  <td colSpan={headers.length + 1}>
                    <NewCollabForm 
                        editingId = {editingId}
                        editedCollab = {editedCollab}
                        setEditingId = {setEditingId}
                        addCollabCb = {props.addCollabCb}
                    />
                  </td>
                </tr>
                ) 
              : (
                <tr key={c.collab_id}>
                  <td>
                    {
                      props.user && +props.user.isAdmin === +1
                      ? <button
                        onClick={e => handleEditClick(c.collab_id)}
                        title="edit"
                        type="button"
                        >
                        edit
                        </button>
                      : null
                    }
                  </td>
                  {headers.map(header => {
                    const value =
                      header.id === "date"
                        ? new Date(c[header.id]).toISOString().substring(0, 10)
                             : header.id === "followers" || header.id === "price_ex_vat"
                             ?  header.value = c[header.id].toLocaleString("fi-FI")
                                : c[header.id];
                    return <td key={header.id}>{value}</td>;
                  })}
                </tr>
              )
            ))}
          </tbody>
        </Table>
      );
      
}

export default CollabList;