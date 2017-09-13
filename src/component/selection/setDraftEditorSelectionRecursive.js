/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setDraftEditorSelectionRecursive
 * @typechecks
 * @flow
 */

'use strict';

import type SelectionState from 'SelectionState';

const setDraftEditorSelection = require('setDraftEditorSelection');

/**
 * Selection is applied recursively to all descendants
 * as individual leaf nodes may contain extra child nodes
 */
function setDraftEditorSelectionRecursive(
  selectionState: SelectionState,
  node: Node,
  blockKey: string,
  nodeStart: number,
): number {
  if (node.nodeType === Node.TEXT_NODE) {
    const length = node.textContent.length;
    const nodeEnd = nodeStart + length;
    setDraftEditorSelection(
      selectionState,
      node,
      blockKey,
      nodeStart,
      nodeEnd,
    );
    return nodeEnd;
  } else if (node.tagName === 'BR') {
    const nodeEnd = nodeStart + 1;
    setDraftEditorSelection(
      selectionState,
      node,
      blockKey,
      nodeStart,
      nodeEnd,
    );
    return nodeEnd;
  }

  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    nodeStart = setDraftEditorSelectionRecursive(
      selectionState,
      children[i],
      blockKey,
      nodeStart,
    );
  }

  return nodeStart;
}

module.exports = setDraftEditorSelectionRecursive;
