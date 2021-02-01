import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

export default function Responses(props) {

    const [responseState, updateResponseState] = useState([]);
    const [state, updateState] = useState({ questions:[] });
    const [responseIdx, updateResponseIndex] = useState(-1);

    useEffect(() => {
        axios
            .get(`https://project-lvtif.herokuapp.com/api/forms/${props.match.params.id}/questions`)
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
        axios
            .get(`https://project-lvtif.herokuapp.com/api/forms/${props.match.params.id}/responses`)
            .then(response => {
                let data = [];
                response.data.map((res) => {
                    let response = { ...res };
                    let newAnswers = {};
                    response.answers.map((answer) => {
                        newAnswers[answer.questionId] = answer.answer;
                    });
                    response.answers = newAnswers;
                    data.push(response);
                })
                updateResponseState(data);
            })
    }, []);


    return (
        <div>
            <h3>Responses</h3>
            {
                responseState.length !== 0
                    ? responseState.map((response, idx) => {
                        return <div style={{ border: '1px solid black', padding: '8px', margin: '8px' }}>
                            <p>{response.name}</p>
                            <p>{String(new Date(response.createdAt))}</p>
                            <button onClick={() => updateResponseIndex(idx)}>Expand</button>
                        </div>
                    })
                    : ''
            }


            <Modal isOpen={responseIdx !== -1} >
                {
                    state.questions.map((question) => {
                        if (!responseState[responseIdx]) {
                            return '';
                        }
                        return (<div style={{ border: '1px solid black', padding: '8px', margin: '8px' }} id={question.id}>
                            {question.label}: 
                            <br/>
                            {
                                responseState[responseIdx] 
                                    ? responseState[responseIdx].answers[question.id]
                                    : '' 
                            }
                        </div>)
                    })
                }
                <button onClick={() => updateResponseIndex(-1)}>Close</button>
            </Modal>

        </div>
    )
}
