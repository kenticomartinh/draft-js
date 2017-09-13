/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getSelectionOffsetKeyForNode
 * @typechecks
 * @flow
 */

'use strict';

var getSelectionOffsetKeyNode = require('getSelectionOffsetKeyNode');

/**
 * Get offset key from a node or it's child nodes. Return the first offset key
 * found on the DOM tree of given node.
 */
function getSelectionOffsetKeyForNode(node: Node): ?string {
  let keyNode = getSelectionOffsetKeyNode(node);
  if (keyNode != null) {
    return keyNode.getAttribute('data-offset-key');
  }
  return null;
}

module.exports = getSelectionOffsetKeyForNode;
