import React, { useEffect, useState } from "react";
import "./styles.css";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { toolbarOptions } from "views/pages/subAdmin/nftManagement/utils/constants";
import { convertFromHTML } from "draft-convert";

export const ParseHtmlToText = ({ description }) => {
  const [styleMap, setStyleMap] = useState({});
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

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
    <Editor
      readOnly
      toolbar={toolbarOptions}
      editorState={editorState}
      customStyleMap={styleMap}
      toolbarClassName="custom-toolbar-view"
    />
  );
};
