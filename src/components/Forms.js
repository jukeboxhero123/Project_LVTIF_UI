import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useHistory } from "react-router-dom";

function Forms(props) {

    const [state, updateState] = useState({ forms:[], isCreatingNewForm: false });
    const [formState, updateFormState] = useState('');
    const history = props.history;
    useEffect(() => {
        axios
            .get(`https://project-lvtif.herokuapp.com/api/forms`)
            .then((response) => {
                updateState({...state, forms: response.data})
            })
    }, []);

    const handleOnChange = (e) => {
        updateFormState(e.target.value);
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        if (formState !== '') {
            const params = {
                title: formState
            };
            axios
                .post(`https://project-lvtif.herokuapp.com/api/forms`, params, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    const newState = {...state};
                    newState.forms.push(response.data);
                    newState.isCreatingNewForm = false;
                    updateState(newState);

                })
        }
    }

    const redirect = (pathname) => {
        history.push({
            pathname,
        });
    }

    return (
        <div>
            {
                state.forms.map((form) => {
                    return <div style={{ border: '1px solid black', padding: '8px', margin: '8px' }}>
                        <p>{form.title}</p>
                        <p>Share Link: {`${process.env.URL || 'localhost:3000'}/forms/${form.id}/responses/new`}</p>
                        <button onClick={() => redirect(`/forms/${form.id}/questions`)}>Edit</button> <button onClick={() => redirect(`/forms/${form.id}/responses`)}>See Responses</button>
                    </div>
                })
            }
            <div style={{ border: '1px solid black', padding: '8px', margin: '8px' }} onClick={() => updateState({...state, isCreatingNewForm: true})}>
                + Click to Create New Form
            </div>

            <Modal isOpen={state.isCreatingNewForm} >
                <form onSubmit={(e)=>handleSubmitForm(e)}>
                    <label>Title:</label>
                    <input type="text" id="title" name="title" value={formState} onChange={e => handleOnChange(e)}/>
                    <input type="submit" value="Submit"/>
                </form>
            </Modal>
        </div>
    )
}
export default Forms;