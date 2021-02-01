import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default function Response(props) {

    const [state, updateState] = useState({});
    const [nameState, updateNameState] = useState('');
    const [formState, updateFormState] = useState({});
    const history = props.history;
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/api/forms/${props.match.params.id}/questions`)
            .then((response) => {
                response.data.questions.sort((x, y) => {
                    if (x.order < y.order) {
                        return -1
                    }
                    if (x.order > y.order) {
                        return 1;
                    }
                    return 0;
                })
                updateState({ ...response.data });
            })
    }, []);

    const handleSubmitResponse = (e) => {
        e.preventDefault();
        let answers = [];
        for (const id in formState) {
            answers.push({ answer: formState[id], questionId: id })
        }
        let params = {
            name: nameState,
            answers 
        }
        axios
            .post(`http://127.0.0.1:8000/api${props.location.pathname}`, params, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => history.push({
                pathname: `${props.location.pathname}/success`
            }))

    }

    const handleOnChange = (e) => {
        let newFormState = {
            ...formState,
            [e.target.name]: e.target.value
        };
        updateFormState(newFormState);
    }

    return (
        <div>
            <h3>{state.title}</h3>
            <form onSubmit={(e)=>handleSubmitResponse(e)}>
                <div style={{ border: '1px solid black', margin: '8px', padding: '8px' }} >
                    <label>Name</label>
                    <br />
                    <input type="text" name="name" value={nameState} onChange={(e) => updateNameState(e.target.value)} />
                </div>
                {
                    state.questions
                        ? state.questions.map((question) => {
                            if (question.type === "long") {
                                return (
                                    <div style={{ border: '1px solid black', margin: '8px', padding: '8px' }} id={question.id}>
                                        <label>{question.label}</label>
                                        <br />
                                        <textarea name={question.id} onChange={(e) => handleOnChange(e)} />
                                    </div>
                                )
                            } else if (question.type === "text") {
                                return (
                                    <div style={{ border: '1px solid black', margin: '8px', padding: '8px' }} id={question.id}>
                                        <label>{question.label}</label>
                                        <br />
                                        <input name={question.id} type="text" onChange={(e) => handleOnChange(e)} />
                                    </div>
                                )
                            } else {
                                return (
                                    <div style={{ border: '1px solid black', margin: '8px', padding: '8px' }} id={question.id}>
                                        <label>{question.label}</label>
                                        <br />
                                        {
                                            question.options.map((option) =>
                                                <React.Fragment>
                                                    <input type="radio" name={question.id} value={option.value} onChange={(e) => handleOnChange(e)} />{option.value}<br />
                                                </React.Fragment>
                                            )
                                        }
                                    </div>
                                )
                            }
                        })
                        : ""
                }
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )
}
