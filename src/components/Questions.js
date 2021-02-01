import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default function Questions (props) {
    
    const defaultFormState = {
        label: '',
        type: '',
        options: []
    };

    const [state, updateState] = useState({
        questions: [],
        isCreatingNewQuestion: false
    })

    const [formState, updateFormState] = useState(defaultFormState)

    useEffect(() => {
        axios
        .get(`https://project-lvtif.herokuapp.com/api${props.location.pathname}`)
        .then((response) => {
            updateState({...state, ...response.data})
        })
    }, []);

    const handleOnChange = (e) => {
        let newState = {...formState, [e.target.name]: e.target.value};
        updateFormState(newState);
    }

    const handleOnChangetwo = (e, i) => {
        let newState = {...formState};
        newState.options[i].value = e.target.value;
        updateFormState(newState);
    }

    const handleSubmitQuestion = (e) => {
        e.preventDefault();
        if (formState.label !== '' && formState.type !== '') {
            const params = {
                ...formState,
                order: state.questions.length + 1
            }

            axios
                .post(`https://project-lvtif.herokuapp.com/api${props.location.pathname}`, params, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    const newState = {...state};
                    newState.questions.push(response.data);
                    newState.isCreatingNewQuestion = false;
                    updateState(newState);
                    updateFormState(defaultFormState);
                })
        }
    }
    
    return (
        <div>
            <p>Editing {state.title}</p>
            {
                state.questions.map((question, i) => 
                    <div id={question.id} style={{ border: '1px solid black', padding: '8px', margin: '8px' }}>
                        Label: {question.label} 
                        <br/>
                        Type: {question.type}
                        {
                            question.options 
                                ? question.options.map((option) =>
                                    <div id={option.id}>
                                        {option.value}
                                    </div>
                                )
                                : ""
                        }
                    </div>
                )
            }
            <div style={{ border: '1px solid black', padding: '8px', margin: '8px' }} onClick={() => updateState({...state, isCreatingNewQuestion: true})}>
                + Click to add question
            </div>
            <Modal isOpen={state.isCreatingNewQuestion} >
                <form onSubmit={(e)=>handleSubmitQuestion(e)}>
                    <label>Label:</label>
                    <input type="text" id="label" name="label" value={formState.label} onChange={e => handleOnChange(e)}/>
                    <br/>
                    <label>Type:</label>
                    <select name="type" id="type" selected={formState.type} onChange={e => handleOnChange(e)}>
                        <option value=""/>
                        <option value="text">Text</option>
                        <option value="long">Long</option>
                        <option value="choice">Choice</option>
                    </select>
                    <br/>
                    {
                        formState.type === 'choice'
                            ? <div>
                                {
                                    formState.options.map((option, i) => 
                                        <div id={i}>
                                            <input type="text" id={i} name="" value={formState.options[i].value} onChange={e => handleOnChangetwo(e,i)}/>
                                            <button onClick={() => {
                                                let newState = {...formState};
                                                newState.options.splice(i, 1);   
                                                updateFormState(newState);
                                            }}> Delete</button>
                                            <br/>
                                        </div>
                                    )
                                }
                                <div onClick={() => {
                                    let options = [...formState.options];
                                    options.push({value:''});
                                    updateFormState({...formState, options})
                                }}>Add Option</div>
                            </div>
                            : ''
                        }
                    <input type="submit" value="Submit"/>
                </form>
            </Modal>
        </div>
    )
}