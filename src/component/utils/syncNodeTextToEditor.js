/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule syncNodeTextToEditor
 * @typechecks
 * @flow
 */

'use strict';

import type DraftEditor from 'DraftEditor.react';

var DraftModifier = require('DraftModifier');
var DraftOffsetKey = require('DraftOffsetKey');
var EditorState = require('EditorState');

var getSelectionOffsetKeyForNode = require('getSelectionOffsetKeyForNode');
var findAncestorBlockNode = require('findAncestorBlockNode');
var nullthrows = require('nullthrows');

var DOUBLE_NEWLINE = '\n\n';

/**
 * Synchronizes the given node text to editor if needed
 */
function syncNodeTextToEditor(
    editor: DraftEditor,
    offsetKeyNode: HTMLElement,
): EditorState | null {
    var domText = offsetKeyNode.textContent;
    var editorState = editor._latestEditorState;
    var offsetKey = nullthrows(getSelectionOffsetKeyForNode(offsetKeyNode));
    var {blockKey, decoratorKey, leafKey} = DraftOffsetKey.decode(offsetKey);

    var content = editorState.getCurrentContent();
    var block = content.getBlockForKey(blockKey);
    var blockText = block.getText();

    var blockNode = findAncestorBlockNode(offsetKeyNode);
    var domBlockText = blockNode.textContent;

    // No change in the entire block -- the DOM is up to date. Nothing to do here.
    if (domBlockText === blockText) {
      return null;
    }

    var {start, end} = editorState
      .getBlockTree(blockKey)
      .getIn([decoratorKey, 'leaves', leafKey]);

    var modelText = blockText.slice(start, end);

    // Special-case soft newlines here. If the DOM text ends in a soft newline,
    // we will have manually inserted an extra soft newline in DraftEditorLeaf.
    // We want to remove this extra newline for the purpose of our comparison
    // of DOM and model text.
    if (domText.endsWith(DOUBLE_NEWLINE)) {
      domText = domText.slice(0, -1);
    }

    // No change -- the DOM is up to date. Nothing to do here.
    if (domText === modelText) {
      return null;
    }

    var selection = editorState.getSelection();

    // We'll replace the entire leaf with the text content of the target.
    var targetRange = selection.merge({
      anchorOffset: start,
      focusOffset: end,
      isBackward: false,
    });

    const entityKey = block.getEntityAt(start);
    const entity = entityKey && content.getEntity(entityKey);
    const entityType = entity && entity.getMutability();
    const preserveEntity = entityType === 'MUTABLE';

    // Immutable or segmented entities cannot properly be handled by the
    // default browser undo, so we have to use a different change type to
    // force using our internal undo method instead of falling through to the
    // native browser undo.
    const changeType = preserveEntity ? 'spellcheck-change' : 'apply-entity';

    const newContent = DraftModifier.replaceText(
      content,
      targetRange,
      domText,
      block.getInlineStyleAt(start),
      preserveEntity ? block.getEntityAt(start) : null,
    );

    // We don't change the selection by this sync operation
    var contentWithAdjustedDOMSelection = newContent.merge({
        selectionBefore: content.getSelectionAfter(),
        selectionAfter: content.getSelectionAfter(),
    });

    return EditorState.push(
      editorState,
      contentWithAdjustedDOMSelection,
      changeType,
    );
}

module.exports = syncNodeTextToEditor;
