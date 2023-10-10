import React, { useRef, useState } from 'react';

import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import EmailInput from "../components/EmailInput";
import Subject from "../components/Subject";

const MyApp = ({emails,initToEmails,initCcEmails,initBccEmails,initEmailHTML}) => {
    const [unchosenEmails, setUnchosenEmails] = useState(emails);
    const [emailBody, setEmailBody] = useState(initEmailHTML);
    const [subjectBody, setSubjectBody] = useState("");
    const [toEmails, setToEmails] = useState(initToEmails);
    const [ccEmails, setCcEmails] = useState(initCcEmails);
    const [bccEmails, setBccEmails] = useState(initBccEmails);
    const emailEditorRef = useRef();


    const getHtml = () => {
      const unlayer = emailEditorRef.current?.editor;

      unlayer?.getHtml((data) => {
        const { html } = data;
        //console.log('exportHtml', html);
        //console.log('designHtml', design);
        return html
      })
    }


    window.getEmailText = function() {
      const toEmailsObj = toEmails.map(email => ({ Email: email }));
      const ccEmailsObj = ccEmails.map(email => ({ Email: email }));
      const bccEmailsObj = bccEmails.map(email => ({ Email: email }));
      // REVIEW WITH JB. See "https://github.com/zenoamaro/react-quill#the-unprivileged-editor"
      // const bodyText = ReactQuill.editor.getText(emailBody);
      // console.log(bodyText);
      let plainText = ""; // Declare it here
      let html = ""; // Declare it here
      if (unlayer) {
        html = getHtml();
      };
      const emailComponents = {
        html,
        plainText,
        subjectBody,
        toEmails: toEmailsObj,
        ccEmails: ccEmailsObj,
        bccEmails: bccEmailsObj
      };
      
      FileMaker.PerformScript("receiveEmailText", JSON.stringify(emailComponents));
    };

    window.clearEmails = (input) => {
      const data = JSON.parse(input);
      const type = data.type;
      let setEmail;
      switch (type) {
        case "to":
          setEmail = setToEmails;
          break;
        case "cc":
          setEmail = setCcEmails;
          break;
        case "bcc":
          setEmail = setBccEmails;
          break;
        default:
          console.log("Hit default case. Unexpected type:", type);
          return;
      }
      setEmail([]);  // Reset to an empty array
    };
  

    window.addEmail = (json) => {
      const data = JSON.parse(json);
      const type = data.type;
      const newEmail = data.newEmail;
      console.log("type: ", type, "newEmail: ", newEmail)
      let setEmail;
      switch (type) {
        case "to":
          setEmail = setToEmails;
          break;
        case "cc":
          setEmail = setCcEmails;
          break;
        case "bcc":
          setEmail = setBccEmails;
          break;
        default:
          return;
      }
      setEmail(prevEmails => [...prevEmails, newEmail]);
    };

    const exportHtml = () => {
      const unlayer = emailEditorRef.current?.editor;

      unlayer?.exportHtml((data) => {
        const { design, html } = data;
        //console.log('exportHtml', html);
        //console.log('designHtml', design);
        const output = {'json': design,'html': html}
        FileMaker.PerformScript("receiveEmailHTML", JSON.stringify(output))
      });
    };

    const onReady = (unlayer, emailBody) => {
      // editor is ready
      // you can load your template here;
      // the design json can be obtained by calling
      // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)

      const templateJson = { emailBody };
      unlayer.loadDesign(templateJson);
    };

    return (
      <div id='dom' className='px-4 py-5 bg-white'>
        <div id='emailDom'>
          <EmailInput id='toEmail' title='TO' addEmail={addEmail} unchosenEmails={unchosenEmails} setUnchosenEmails={setUnchosenEmails} chosenEmails={toEmails} setChosenEmails={setToEmails}/>
          <EmailInput id='ccEmail' title='CC' addEmail={addEmail} unchosenEmails={unchosenEmails} setUnchosenEmails={setUnchosenEmails} chosenEmails={ccEmails} setChosenEmails={setCcEmails}/>
          <EmailInput id='bccEmail' title='BCC' addEmail={addEmail} unchosenEmails={unchosenEmails} setUnchosenEmails={setUnchosenEmails} chosenEmails={bccEmails} setChosenEmails={setBccEmails}/>
        </div>
        <div id='subjectDom'>
          <Subject title='' setSubjectBody={setSubjectBody} subjectBody={subjectBody} />
        </div>
        <div id='textDom'>
          <EmailEditor ref={emailEditorRef} onReady={onReady} /> 
        </div>
        <div>
          <button class="m-8 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={exportHtml}>
            <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
            <span>Download</span>
          </button>
        </div>
        
      </div>
    );
  };
  
  export default MyApp;