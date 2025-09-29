import React, { useEffect, useState } from "react";
import "./styles.css";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toolbarOptions } from "../utils/constants";
import { Typography } from "@mui/material";
import { convertFromHTML } from "draft-convert";

const RichTextEditor = ({ formik, name, description, errorsArray, setErrorsArray }) => {
  const [styleMap, setStyleMap] = useState({});
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editorState) => {
    const currentContent = editorState.getCurrentContent();
    const rawContentState = convertToRaw(currentContent);
    const html = draftToHtml(rawContentState);

    // Set placeholder visibility
    const emptyListHtml = ["<ul>\n<li></li>\n</ul>\n", "<ol>\n<li></li>\n</ol>\n"];
    setShowPlaceholder(!emptyListHtml.includes(html));

    // Handle empty paragraph
    const isEmptyParagraph = html === "<p></p>\n";
    formik.setFieldValue(name, isEmptyParagraph ? "" : html);
    setEditorState(editorState);

    // Update error array if name is nftDescription
    if (name === "nftDescription" && !isEmptyParagraph) {
      setErrorsArray((prevErrors) => prevErrors.filter((item) => item !== "General"));
    }
  };

  useEffect(() => {
    if (description) {
      const contentState = convertFromHTML({
        htmlToStyle: (nodeName, node, currentStyle) => {
          if (node.style && node.style.color) {
            // Create a unique style key for each color
            const colorStyle = `color-${node.style.color}`;
            return currentStyle.add(colorStyle);
          }
          return currentStyle;
        }
      })(description);

      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [description]);

  useEffect(() => {
    const rawContent = convertToRaw(editorState.getCurrentContent());

    let styleData = {};
    Object.values(rawContent.blocks).forEach((block) => {
      block.inlineStyleRanges.forEach((styleRange) => {
        const style = styleRange.style;
        if (style.startsWith("color-")) {
          const color = style.replace("color-", "");
          styleData[style] = { color };
        }
      });
    });

    setStyleMap(styleData);
  }, [editorState]);

  return (
    <>
      <Editor
        customStyleMap={styleMap}
        placeholder={showPlaceholder ? "Type here..." : ""}
        toolbar={toolbarOptions}
        editorState={editorState}
        toolbarClassName="custom-toolbar"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={onEditorStateChange}
      />
      {formik?.errors[name] ? <Typography sx={{ color: "red" }}>{formik?.errors[name]}</Typography> : ""}
    </>
  );
};

export default RichTextEditor;
