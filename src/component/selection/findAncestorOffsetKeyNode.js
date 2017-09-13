/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule findAncestorOffsetKeyNode
 * @typechecks
 * @flow
 */

'use strict';

var getSelectionOffsetKeyNode = require('getSelectionOffsetKeyNode');

/**
 * Get the key from the node's nearest offset-aware ancestor.
 */
function findAncestorOffsetKeyNode(node: Node): ?Node {
  let searchNode = node;
  while (searchNode && searchNode !== document.documentElement) {
    var keyNode = getSelectionOffsetKeyNode(searchNode);
    if (keyNode) {
      return keyNode;
    }
    searchNode = searchNode.parentNode;
  }
  return null;
}

module.exports = findAncestorOffsetKeyNode;
