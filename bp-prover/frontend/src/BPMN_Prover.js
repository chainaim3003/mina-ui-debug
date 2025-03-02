import React, { useState } from 'react';
import './BPMN_Prover.css';

const BPMN = () => {
    const [expectedFile, setExpectedFile] = useState(null);
    const [actualFile, setActualFile] = useState(null);
    const [booleanResult, setBooleanResult] = useState(null);

    const handleFileChange = (e, type) => {
        if (e.target.files) {
            if (type === 'expected') {
                setExpectedFile(e.target.files[0]);
            }
            if (type === 'actual') {
                setActualFile(e.target.files[0]);
            }
            setBooleanResult(null); // Reset result to ensure reprocessing
        }
    };
    
    const handleProcessFiles = async () => {
        if (expectedFile && actualFile) {
            console.log("Expected File: ", expectedFile);
            console.log("Actual File: ", actualFile); // This should print the updated files
            try {
                const formData = new FormData();
                formData.append('bpmnFile', expectedFile);
                formData.append('bpmnFile', actualFile);
    
                // Send both files to the backend
                await fetch('https://zk-pret-bpmn-nine.vercel.app/api/upload/expected-and-actual', {
                    method: 'POST',
                    body: formData,
                });
    
                const resultResponse = await fetch('https://zk-pret-bpmn-nine.vercel.app/api/verify-bpmn');
                const resultData = await resultResponse.json();
                setBooleanResult(resultData.isVerified);
                
            } catch (error) {
                console.error('Error processing files:', error);
                alert('An error occurred while processing the files.');
            }
        } else {
            alert('Please upload both files to proceed.');
        }
    };
    
    return (
        <div className="container">
            <header className="header">
                <div className="logo-container">
                    <h1 className="logo">CHAINAIM</h1>
                    <div className="auth-buttons">
                        <button className="link-button" onClick={() => alert("Login button clicked")}>LOGIN</button>
                        <button className="link-button" onClick={() => alert("SSO Sign-in button clicked")}>SSO SIGN-IN</button>
                    </div>
                </div>
                <button className="wallet-button">CONNECT WALLET</button>
            </header>

            <main className="main-content">
                <h2 className="title">BUSINESS PROCESS PROVER</h2>

                <p className="step">
                    STEP 1: CREATE BUSINESS PROCESS MODELS USING{' '}
                    <a
                        href="https://bpmn.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bpmn-link"
                    >
                        BPMN.IO
                    </a>
                </p>
                <p className="step">STEP 2: UPLOAD OR SELECT EXPECTED & ACTUAL MODELS</p>

                <div className="process-container">
                    <div className="process-section">
                        <h3 className="section-title">BUSINESS PROCESS - EXPECTED</h3>
                        <div className="button-container">
                            <input
                                type="file"
                                id="upload-expected"
                                className="file-input"
                                onChange={(e) => handleFileChange(e, 'expected')}
                            />
                        </div>
                        {expectedFile && (
                            <p className="file-name">Uploaded: {expectedFile.name}</p>
                        )}
                    </div>

                    <div className="divider"></div>

                    <div className="process-section">
                        <h3 className="section-title">BUSINESS PROCESS - ACTUAL</h3>
                        <div className="button-container">
                            <input
                                type="file"
                                id="upload-actual"
                                className="file-input"
                                onChange={(e) => handleFileChange(e, 'actual')}
                            />
                        </div>
                        {actualFile && (
                            <p className="file-name">Uploaded: {actualFile.name}</p>
                        )}
                    </div>
                </div>

                {expectedFile && actualFile && (
                    <button className="action-button" onClick={handleProcessFiles}>
                        Process Both Files
                    </button>
                )}

                <div className="output">
                    <h1>{booleanResult !== null ? booleanResult.toString() : 'No result yet'}</h1>
                </div>
            </main>

            <footer className="footer">
                <p>STEP 3: GENERATE PROOF AND VERIFY</p>
                <div className="actions">
                    <button className="action-button" onClick={() => alert("Proof generated")}>
                        GENERATE PROOF
                    </button>
                    <button className="action-button" onClick={() => alert("Verification completed")}>
                        VERIFY
                    </button>
                </div>
                <p className="evaluation">
                    EXPECTED VS ACTUAL EVALUATION IS: <b>{booleanResult !== null ? booleanResult.toString() : 'PASS/FAIL'}</b>
                </p>
            </footer>
        </div>
    );
};

export default BPMN;
