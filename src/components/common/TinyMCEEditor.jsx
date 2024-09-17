import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEEditor = ({ value, onChange }) => {
  const [editorValue, setEditorValue] = useState(value || "");

  const handleEditorChange = (content) => {
    setEditorValue(content);
    if (onChange) onChange(content);
  };

  return (
    <>
      {/* <div>
        <TinyMCEEditor
          value={formData.description}
          onChange={(content) =>
            setFormData({ ...formData, description: content })
          }
          placeholder="Add more info on Salary(optional), Required Qualifications, Company Overview, Benefits, etc."
        />
      </div> */}
      <Editor
      apiKey="1v6xjeurng0xgrsfz1ppr1tg97yi0mzlu39i3qdwja85096a"
      value={editorValue}
      init={{
        height: 400,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code help wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
      }}
      onEditorChange={handleEditorChange}
    />
    </>
  );
};

export default TinyMCEEditor;
