import React, { useRef } from 'react';

import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';

const MyApp = () => {
  const emailEditorRef = useRef();

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

    const onReady = (unlayer, json) => {
      // editor is ready
      // you can load your template here;
      // the design json can be obtained by calling
      // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)

      const templateJson = { json };
      unlayer.loadDesign(templateJson);
    };

    return (
      <div>
        <EmailEditor ref={emailEditorRef} onReady={onReady} />
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