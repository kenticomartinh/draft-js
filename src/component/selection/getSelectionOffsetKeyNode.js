/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getSelectionOffsetKeyNode
 * @typechecks
 * @flow
 */

'use strict';

/**
 * Get the node containing offset key from a node or it's child nodes.
 * Return the first node with offset key found on the DOM tree of given node.
 */
function getSelectionOffsetKeyNode(node: Node): ?Node {
  if (node instanceof Element) {
    var offsetKey = node.getAttribute('data-offset-key');
    if (offsetKey) {
      return node;
    }
    for (var ii = 0; ii < node.childNodes.length; ii++) {
      var keyNode = getSelectionOffsetKeyNode(node.childNodes[ii]);
      if (keyNode) {
        return keyNode;
      }
    }
  }
  return null;
}

module.exports = getSelectionOffsetKeyNode;
